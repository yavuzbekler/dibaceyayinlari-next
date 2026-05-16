import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  return upsertBook(request);
}

export async function PUT(request: Request) {
  return upsertBook(request);
}

async function upsertBook(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();
  const body = await request.json();
  const { sales_links = [], author, ...book } = body;
  const supabase = await getAdminClient();
  const { data, error } = await supabase.from("books").upsert(book).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("sales_links").delete().eq("book_id", book.id);
  if (sales_links.length) {
    await supabase.from("sales_links").insert(sales_links.map((link: any, index: number) => ({ ...link, book_id: book.id, sort_order: index })));
  }
  return NextResponse.json({ ...data, sales_links });
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await (await getAdminClient()).from("books").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
