import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const pathname = request.nextUrl.pathname;

  if (host.startsWith("dibaceyayinlari-v1.") && !pathname.startsWith("/v1")) {
    const url = request.nextUrl.clone();
    url.pathname = `/v1${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon|.*\\..*).*)"]
};
