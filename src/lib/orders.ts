import "server-only";
import { prisma } from "./prisma";
import { SHOP, calcShipping } from "./config";
import { generateOrderCode } from "./order-code";
import type { OrderInput } from "./validation";

export class OrderError extends Error {
  constructor(public code: "variant_not_found" | "out_of_stock", public detail?: string) {
    super(code);
  }
}

/**
 * Tạo đơn hàng: giá luôn lấy từ database (không tin giá client gửi lên),
 * trừ tồn kho có điều kiện trong cùng một transaction để tránh bán vượt.
 */
export async function createOrder(input: OrderInput) {
  const ids = [...new Set(input.items.map((i) => i.variantId))];
  const variants = await prisma.variant.findMany({
    where: { id: { in: ids }, product: { active: true } },
    include: { product: { select: { name: true } } },
  });
  const byId = new Map(variants.map((v) => [v.id, v]));

  const lines = input.items.map((item) => {
    const v = byId.get(item.variantId);
    if (!v) throw new OrderError("variant_not_found", item.variantId);
    return {
      variantId: v.id,
      productName: v.product.name,
      sizeMl: v.sizeMl,
      unitPrice: v.price,
      quantity: item.quantity,
      engraving: item.engraving?.trim() || null,
      giftWrap: item.giftWrap,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const giftFee = lines.reduce((s, l) => s + (l.giftWrap ? SHOP.giftWrapFee * l.quantity : 0), 0);
  const shippingFee = calcShipping(subtotal);
  const total = subtotal + giftFee + shippingFee;

  // Tổng số lượng theo variant (cùng variant có thể ở nhiều dòng: khắc tên khác nhau)
  const need = new Map<string, number>();
  for (const l of lines) need.set(l.variantId, (need.get(l.variantId) ?? 0) + l.quantity);

  return prisma.$transaction(async (tx) => {
    for (const [variantId, qty] of need) {
      const updated = await tx.variant.updateMany({
        where: { id: variantId, stock: { gte: qty } },
        data: { stock: { decrement: qty } },
      });
      if (updated.count === 0) throw new OrderError("out_of_stock", byId.get(variantId)?.product.name);
    }

    // Thử lại nếu trùng mã (rất hiếm)
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateOrderCode();
      const exists = await tx.order.findUnique({ where: { code }, select: { id: true } });
      if (exists) continue;
      return tx.order.create({
        data: {
          code,
          paymentMethod: input.paymentMethod,
          customerName: input.customerName,
          phone: input.phone,
          email: input.email,
          address: input.address,
          province: input.province,
          note: input.note || null,
          subtotal,
          giftFee,
          shippingFee,
          total,
          locale: input.locale,
          items: { create: lines },
        },
        select: { code: true, total: true, paymentMethod: true, locale: true },
      });
    }
    throw new Error("Could not generate a unique order code");
  });
}

/** Hoàn lại tồn kho khi huỷ đơn */
export async function restockOrder(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction(
    items.map((i) => prisma.variant.update({ where: { id: i.variantId }, data: { stock: { increment: i.quantity } } })),
  );
}
