import Link from "next/link";
import { logout } from "./actions";
import { brand } from "@/brand/brand";

export function AdminShell({ children, active }: { children: React.ReactNode; active: "orders" | "products" }) {
  const tab = (href: string, label: string, on: boolean) => (
    <Link href={href} className={`px-3 py-2 text-sm ${on ? "bg-ivory text-ink" : "text-sand hover:text-accent-light"}`}>{label}</Link>
  );
  return (
    <div className="min-h-screen">
      <header className="border-b border-ivory/10 bg-ink-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-display text-xl tracking-[0.2em]">{brand.wordmark} · ADMIN</span>
            <nav className="flex gap-1">
              {tab("/admin", "Đơn hàng", active === "orders")}
              {tab("/admin/products", "Sản phẩm", active === "products")}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/vi" className="text-smoke hover:text-accent-light">Xem cửa hàng ↗</Link>
            <form action={logout}><button className="text-smoke hover:text-accent-light">Đăng xuất</button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
};
export const PAYMENT_LABEL: Record<string, string> = { COD: "COD", BANK_TRANSFER: "Chuyển khoản", VNPAY: "VNPay" };
export const PAYMENT_STATUS_LABEL: Record<string, string> = { UNPAID: "Chưa thanh toán", PAID: "Đã thanh toán", FAILED: "Thất bại" };
