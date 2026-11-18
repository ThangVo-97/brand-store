import "server-only";
import { createHmac } from "node:crypto";

/**
 * Tích hợp VNPay (phiên bản API 2.1.0).
 * Tài liệu: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 * Cần đăng ký tài khoản merchant/sandbox để có VNPAY_TMN_CODE và VNPAY_HASH_SECRET.
 */

export function vnpayEnabled() {
  return Boolean(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET);
}

/** Sắp xếp key, encode theo chuẩn VNPay (khoảng trắng → "+") */
function buildQuery(params: Record<string, string>) {
  return Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k]).replace(/%20/g, "+")}`)
    .join("&");
}

function sign(query: string) {
  return createHmac("sha512", process.env.VNPAY_HASH_SECRET!).update(Buffer.from(query, "utf-8")).digest("hex");
}

/** yyyyMMddHHmmss theo giờ Việt Nam */
function vnTimestamp(date = new Date()) {
  const vn = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    vn.getUTCFullYear() +
    p(vn.getUTCMonth() + 1) +
    p(vn.getUTCDate()) +
    p(vn.getUTCHours()) +
    p(vn.getUTCMinutes()) +
    p(vn.getUTCSeconds())
  );
}

export function createPaymentUrl(opts: { orderCode: string; amount: number; locale: "vi" | "en"; ipAddr: string; returnUrl: string }) {
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: process.env.VNPAY_TMN_CODE!,
    vnp_Amount: String(opts.amount * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: opts.orderCode,
    vnp_OrderInfo: `Thanh toan don hang ${opts.orderCode}`,
    vnp_OrderType: "other",
    vnp_Locale: opts.locale === "vi" ? "vn" : "en",
    vnp_ReturnUrl: opts.returnUrl,
    vnp_IpAddr: opts.ipAddr,
    vnp_CreateDate: vnTimestamp(),
  };
  const query = buildQuery(params);
  const base = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  return `${base}?${query}&vnp_SecureHash=${sign(query)}`;
}

/** Kiểm tra chữ ký trên URL VNPay trả về (return URL hoặc IPN) */
export function verifyReturn(searchParams: URLSearchParams) {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("vnp_") && key !== "vnp_SecureHash" && key !== "vnp_SecureHashType") params[key] = value;
  });
  const received = searchParams.get("vnp_SecureHash") ?? "";
  const valid = received.length > 0 && sign(buildQuery(params)).toLowerCase() === received.toLowerCase();
  return {
    valid,
    orderCode: params.vnp_TxnRef ?? "",
    amount: Number(params.vnp_Amount ?? 0) / 100,
    success: params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00",
    transactionNo: params.vnp_TransactionNo ?? null,
  };
}
