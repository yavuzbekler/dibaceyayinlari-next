import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";

export function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.delete(adminCookieName);
  return response;
}
