import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { formatDate, formatVnd } from "@/lib/format";
import { AdminShell, PAYMENT_LABEL, PAYMENT_STATUS_LABEL, STATUS_LABEL } from "./AdminShell";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"] as const;

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status, q } = await searchParams;
  const filterStatus = STATUSES.find((s) => s === status);
  const query = q?.trim();

  const [orders, counts, revenue] = await Promise.all([
    prisma.order.findMany({
      where: {
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(query
          ? { OR: [{ code: { contains: query, mode: "insensitive" } }, { phone: { contains: query } }, { customerName: { contains: query, mode: "insensitive" } }] }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <AdminShell active="orders">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-ivory/10 bg-ink-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-smoke">Chờ xác nhận</p>
          <p className="mt-2 font-display text-4xl">{countOf("PENDING")}</p>
        </div>
        <div className="border border-ivory/10 bg-ink-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-smoke">Đang giao</p>
          <p className="mt-2 font-display text-4xl">{countOf("SHIPPING")}</p>
        </div>
        <div className="border border-ivory/10 bg-ink-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-smoke">Doanh thu (trừ đơn huỷ)</p>
          <p className="mt-2 font-display text-4xl text-accent-light">{formatVnd(revenue._sum.total ?? 0)}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin" className={`border px-3 py-1.5 ${!filterStatus ? "border-accent-light text-accent-light" : "border-ivory/20 text-sand"}`}>Tất cả</Link>
          {STATUSES.map((s) => (
            <Link key={s} href={`/admin?status=${s}`} className={`border px-3 py-1.5 ${filterStatus === s ? "border-accent-light text-accent-light" : "border-ivory/20 text-sand"}`}>
              {STATUS_LABEL[s]} ({countOf(s)})
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          {filterStatus && <input type="hidden" name="status" value={filterStatus} />}
          <label htmlFor="q" className="sr-only">Tìm đơn</label>
          <input id="q" name="q" defaultValue={query} placeholder="Mã đơn, SĐT, tên…" className="field min-h-10 w-56" />
          <button className="btn-ghost min-h-10 px-4 text-xs">Tìm</button>
        </form>
      </div>

      <div className="overflow-x-auto border border-ivory/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-ink-2 text-xs uppercase tracking-[0.15em] text-smoke">
            <tr>
              <th className="px-4 py-3 font-normal">Mã đơn</th>
              <th className="px-4 py-3 font-normal">Khách hàng</th>
              <th className="px-4 py-3 font-normal">Ngày đặt</th>
              <th className="px-4 py-3 font-normal">Thanh toán</th>
              <th className="px-4 py-3 font-normal">Trạng thái</th>
              <th className="px-4 py-3 text-right font-normal">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-smoke">Chưa có đơn hàng nào.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-ivory/10 hover:bg-ink-2">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.code}`} className="text-accent-light hover:text-ivory">{o.code}</Link></td>
                <td className="px-4 py-3">{o.customerName}<span className="block text-xs text-smoke">{o.phone}</span></td>
                <td className="px-4 py-3 text-sand">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">{PAYMENT_LABEL[o.paymentMethod]}<span className="block text-xs text-smoke">{PAYMENT_STATUS_LABEL[o.paymentStatus]}</span></td>
                <td className="px-4 py-3">{STATUS_LABEL[o.status]}</td>
                <td className="px-4 py-3 text-right">{formatVnd(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
