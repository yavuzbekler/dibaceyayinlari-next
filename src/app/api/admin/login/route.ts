import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const supabase = await getAdminClient();
  const { data: admin } = await supabase.from("admins").select("*").eq("username", username).maybeSingle();
  const ok = admin?.password_hash ? await bcrypt.compare(password, admin.password_hash) : false;

  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(adminCookieName, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
