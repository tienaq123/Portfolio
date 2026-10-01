import type { NextRequest } from "next/server";
import { localeProxy } from "@/i18n/proxy";

// One proxy per app: route each concern by path here (M8 adds the /admin session refresh).
export function proxy(request: NextRequest) {
  return localeProxy(request);
}

export const config = {
  // Skip API, admin, CV downloads, Next internals and any path with a file extension.
  matcher: ["/((?!api|admin|cv|_next|_vercel|.*\\..*).*)"],
};
