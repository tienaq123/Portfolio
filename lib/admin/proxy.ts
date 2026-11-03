import { NextResponse, type NextRequest } from "next/server";
import { adminCredentials, isAdminAuthorization } from "./auth";

export function adminProxy(request: NextRequest) {
  if (!adminCredentials()) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!isAdminAuthorization(request.headers.get("authorization"))) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Portfolio admin", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  }
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}
