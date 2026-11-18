import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "./admin-auth";

/** Gọi đầu mỗi trang và server action của admin */
export async function requireAdmin() {
  const store = await cookies();
  if (!(await verifySessionToken(store.get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
}
