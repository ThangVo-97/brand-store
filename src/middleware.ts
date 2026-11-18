import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin: bắt buộc đăng nhập (trừ trang login)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  // Trang khách: luôn có tiền tố /vi hoặc /en
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return NextResponse.next();

  const preferred = req.cookies.get("NEXT_LOCALE")?.value;
  const accept = req.headers.get("accept-language") ?? "";
  const locale = preferred && isLocale(preferred) ? preferred : accept.toLowerCase().startsWith("en") ? "en" : defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Bỏ qua API, file tĩnh và nội bộ Next
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
