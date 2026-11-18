import { brand } from "@/brand/brand";

/**
 * Phiên đăng nhập admin: cookie "<slug>_admin" = "<hết hạn>.<chữ ký HMAC>".
 * Dùng Web Crypto nên chạy được cả trong middleware (Edge) lẫn server.
 */
export const ADMIN_COOKIE = `${brand.slug}_admin`;
const SESSION_HOURS = 12;

async function hmac(data: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SECRET must be at least 32 characters");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSessionToken() {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return { token: `${exp}.${await hmac(`admin:${exp}`)}`, maxAge: SESSION_HOURS * 60 * 60 };
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const expected = await hmac(`admin:${exp}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

/** So sánh mật khẩu không lộ thời gian */
export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return (await hmac(`pw:${input}`)) === (await hmac(`pw:${expected}`));
}
