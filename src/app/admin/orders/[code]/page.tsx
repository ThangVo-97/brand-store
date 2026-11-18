import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { formatDate, formatVnd } from "@/lib/format";
import { AdminShell, PAYMENT_LABEL, PAYMENT_STATUS_LABEL, STATUS_LABEL } from "../../AdminShell";
import { updateOrder } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ code: string }> }) {
  await requireAdmin();
  const { code } = await params;
  const order = await prisma.order.findUnique({ where: { code }, include: { items: true } });
  if (!order) notFound();

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between gap-6 py-2 text-sm"><span className="text-smoke">{label}</span><span className="text-right">{value}</span></div>
  );

  return (
    <AdminShell active="orders">
      <Link href="/admin" className="text-sm text-smoke hover:text-accent-light">← Danh sách đơn</Link>
      <h1 className="mb-8 mt-3 font-display text-4xl">Đơn {order.code}</h1>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8">
          <section className="border border-ivory/10 bg-ink-2 p-6">
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-smoke">Sản phẩm</h2>
            <ul className="flex flex-col divide-y divide-ivory/10">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3 text-sm">
                  <span>
                    {i.productName} · {i.sizeMl} ml × {i.quantity}
                    {i.engraving && <span className="block text-accent-light">Khắc: “{i.engraving}”</span>}
                    {i.giftWrap && <span className="block text-sand">Gói quà</span>}
                  </span>
                  <span>{formatVnd(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-ivory/10 pt-4">
              {row("Tạm tính", formatVnd(order.subtotal))}
              {order.giftFee > 0 && row("Phí gói quà", formatVnd(order.giftFee))}
              {row("Phí giao hàng", formatVnd(order.shippingFee))}
              {row("Tổng cộng", <strong className="font-display text-2xl text-accent-light">{formatVnd(order.total)}</strong>)}
            </div>
          </section>

          <section className="border border-ivory/10 bg-ink-2 p-6">
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-smoke">Khách hàng</h2>
            {row("Họ tên", order.customerName)}
            {row("Điện thoại", <a href={`tel:${order.phone}`} className="text-accent-light">{order.phone}</a>)}
            {row("Email", order.email)}
            {row("Địa chỉ", `${order.address}, ${order.province}`)}
            {order.note && row("Ghi chú", order.note)}
            {row("Ngôn ngữ", order.locale.toUpperCase())}
            {row("Ngày đặt", formatDate(order.createdAt))}
          </section>
        </div>

        <form action={updateOrder} className="flex h-fit flex-col gap-4 border border-ivory/10 bg-ink-2 p-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-smoke">Cập nhật đơn</h2>
          <input type="hidden" name="code" value={order.code} />
          <label htmlFor="status" className="text-xs text-smoke">Trạng thái</label>
          <select id="status" name="status" defaultValue={order.status} className="field bg-ink">
            {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <p className="text-sm text-sand">Thanh toán: {PAYMENT_LABEL[order.paymentMethod]}{order.paymentRef && ` · Mã GD ${order.paymentRef}`}</p>
          <label htmlFor="paymentStatus" className="text-xs text-smoke">Tình trạng thanh toán</label>
          <select id="paymentStatus" name="paymentStatus" defaultValue={order.paymentStatus} className="field bg-ink">
            {Object.entries(PAYMENT_STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <p className="text-xs text-ash">Chuyển sang “Đã huỷ” sẽ hoàn lại tồn kho.</p>
          <button className="btn-primary">Lưu thay đổi</button>
        </form>
      </div>
    </AdminShell>
  );
}
