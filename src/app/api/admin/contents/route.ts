import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

export async function POST(request: Request) {
  return upsertContent(request);
}

export async function PUT(request: Request) {
  return upsertContent(request);
}

async function upsertContent(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { original_id, created_at, updated_at, ...content } = body;
  const { data, error } = await (await getAdminClient()).from("site_contents").upsert(content, { onConflict: "key" }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  const { error } = await (await getAdminClient()).from("site_contents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
