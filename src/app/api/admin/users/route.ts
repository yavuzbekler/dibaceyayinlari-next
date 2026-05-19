import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await getAdminClient();
  const { data, error } = await supabase.from("admins").select("id, username, email, created_at").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username, password, email } = await request.json();
  if (!username || !password) return NextResponse.json({ error: "Kullanıcı adı ve şifre zorunlu." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from("admins")
    .insert({ username, password_hash: hash, email: email || null })
    .select("id, username, email, created_at")
    .single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Bu kullanıcı adı zaten mevcut." }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await getAdminClient();
  const { count } = await supabase.from("admins").select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) return NextResponse.json({ error: "Son yönetici silinemez." }, { status: 400 });

  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
