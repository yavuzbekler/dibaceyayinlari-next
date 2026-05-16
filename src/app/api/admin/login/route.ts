import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

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

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const supabase = await getAdminClient();
  const { data: admin } = await supabase.from("admins").select("*").eq("username", username).maybeSingle();
  const ok = admin?.password_hash ? await bcrypt.compare(password, admin.password_hash) : false;

  if (!ok) {
    return NextResponse.redirect(redirectUrl(request, "/admin/login?error=1"));
  }

  const response = NextResponse.redirect(redirectUrl(request, "/admin"));
  response.cookies.set(adminCookieName, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
