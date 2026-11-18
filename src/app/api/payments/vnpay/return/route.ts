import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyReturn } from "@/lib/vnpay";

/** Khách được VNPay chuyển về đây sau khi thanh toán */
export async function GET(req: NextRequest) {
  const result = verifyReturn(req.nextUrl.searchParams);
  const order = result.orderCode
    ? await prisma.order.findUnique({ where: { code: result.orderCode }, select: { code: true, total: true, locale: true, paymentStatus: true } })
    : null;

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  if (!order) return NextResponse.redirect(`${site}/vi`);

  const ok = result.valid && result.success && result.amount === order.total;
  // IPN là nguồn xác nhận chính; ở đây cập nhật thêm để môi trường local (không nhận được IPN) vẫn chạy
  if (ok && order.paymentStatus !== "PAID") {
    await prisma.order.update({ where: { code: order.code }, data: { paymentStatus: "PAID", paymentRef: result.transactionNo } });
  } else if (result.valid && !result.success && order.paymentStatus === "UNPAID") {
    await prisma.order.update({ where: { code: order.code }, data: { paymentStatus: "FAILED" } });
  }
  return NextResponse.redirect(`${site}/${order.locale}/checkout/success?code=${order.code}`);
}
