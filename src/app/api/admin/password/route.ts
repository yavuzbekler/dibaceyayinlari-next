import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { isAdminAuthenticated, getAdminUsername } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const username = await getAdminUsername();
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { oldPassword, newPassword } = await request.json();
  if (!oldPassword || !newPassword) return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  if (newPassword.length < 6) return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });

  const supabase = await getAdminClient();
  const { data: admin } = await supabase.from("admins").select("*").eq("username", username).maybeSingle();
  if (!admin) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  const valid = await bcrypt.compare(oldPassword, admin.password_hash);
  if (!valid) return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase.from("admins").update({ password_hash: hash }).eq("id", admin.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
