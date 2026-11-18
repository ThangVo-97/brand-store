import { NextResponse, type NextRequest } from "next/server";
import { orderSchema } from "@/lib/validation";
import { createOrder, OrderError } from "@/lib/orders";
import { createPaymentUrl, vnpayEnabled } from "@/lib/vnpay";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return NextResponse.json({ error: "validation", fields }, { status: 400 });
  }
  if (parsed.data.paymentMethod === "VNPAY" && !vnpayEnabled()) {
    return NextResponse.json({ error: "payment_unavailable" }, { status: 400 });
  }

  try {
    const order = await createOrder(parsed.data);
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

    if (order.paymentMethod === "VNPAY") {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      const paymentUrl = createPaymentUrl({
        orderCode: order.code,
        amount: order.total,
        locale: order.locale === "en" ? "en" : "vi",
        ipAddr: ip,
        returnUrl: `${site}/api/payments/vnpay/return`,
      });
      return NextResponse.json({ code: order.code, paymentUrl });
    }
    return NextResponse.json({ code: order.code });
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.code, detail: err.detail }, { status: 409 });
    }
    console.error("[orders] create failed", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
