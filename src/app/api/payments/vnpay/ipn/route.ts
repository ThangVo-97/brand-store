import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyReturn } from "@/lib/vnpay";

/**
 * IPN: VNPay gọi server-to-server để xác nhận kết quả thanh toán.
 * Khai báo URL này trong trang quản trị merchant VNPay: <site>/api/payments/vnpay/ipn
 */
export async function GET(req: NextRequest) {
  const r = verifyReturn(req.nextUrl.searchParams);
  if (!r.valid) return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });

  const order = await prisma.order.findUnique({ where: { code: r.orderCode } });
  if (!order) return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  if (order.total !== r.amount) return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
  if (order.paymentStatus === "PAID") return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });

  await prisma.order.update({
    where: { id: order.id },
    data: r.success
      ? { paymentStatus: "PAID", paymentRef: r.transactionNo, status: order.status === "PENDING" ? "CONFIRMED" : order.status }
      : { paymentStatus: "FAILED" },
  });
  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
