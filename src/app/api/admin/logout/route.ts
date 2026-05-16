import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";

function redirectUrl(request: Request, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("x-original-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";

  if (host && !host.startsWith("0.0.0.0")) {
    return new URL(path, `${proto}://${host}`);
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return new URL(path, new URL(referer).origin);
  }

  return new URL(path, "https://dibaceyayinlari.xoka.com");
}

export function GET(request: Request) {
  const response = NextResponse.redirect(redirectUrl(request, "/admin/login"));
  response.cookies.delete(adminCookieName);
  return response;
}
