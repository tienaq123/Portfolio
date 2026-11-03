import type { NextRequest } from "next/server";
import { adminProxy } from "@/lib/admin/proxy";
import { localeProxy } from "@/i18n/proxy";

// One proxy per app: route each concern by path.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminProxy(request);
  }
  return localeProxy(request);
}

export const config = {
  matcher: [
    // Locale redirects: skip API, admin, CV downloads, Next internals and files.
    "/((?!api|admin|cv|_next|_vercel|.*\\..*).*)",
    // Owner dashboard: Basic auth.
    "/admin",
    "/admin/:path*",
  ],
};
