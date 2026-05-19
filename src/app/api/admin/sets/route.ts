import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!await isAdminAuthenticated()) return unauthorized();
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from("book_sets")
    .select("*, book_set_items(*, book:books(id, title, cover, author_id, author:authors(name))), set_sales_links(*)")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return unauthorized();
  const body = await request.json();
  const { items = [], sales_links = [], ...set } = body;

  if (!set.id || !set.name) {
    return NextResponse.json({ error: "Set ID ve adı zorunlu." }, { status: 400 });
  }

  const supabase = await getAdminClient();

  const { data, error } = await supabase
    .from("book_sets")
    .upsert({ id: set.id, name: set.name, description: set.description || null, cover: set.cover || null })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("book_set_items").delete().eq("set_id", set.id);
  if (items.length > 0) {
    const rows = items.map((item: { book_id: string }, i: number) => ({
      set_id: set.id,
      book_id: item.book_id,
      sort_order: i,
    }));
    const { error: itemsErr } = await supabase.from("book_set_items").insert(rows);
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 });
  }

  await supabase.from("set_sales_links").delete().eq("set_id", set.id);
  if (sales_links.length > 0) {
    const links = sales_links.map((l: { name: string; url: string; price: number }, i: number) => ({
      set_id: set.id,
      name: l.name,
      url: l.url,
      price: Number(l.price) || 0,
      sort_order: i,
    }));
    const { error: linksErr } = await supabase.from("set_sales_links").insert(links);
    if (linksErr) return NextResponse.json({ error: linksErr.message }, { status: 400 });
  }

  const { data: fresh, error: freshErr } = await supabase
    .from("book_sets")
    .select("*, book_set_items(*, book:books(id, title, cover, author_id, author:authors(name))), set_sales_links(*)")
    .eq("id", data.id)
    .single();
  if (freshErr) return NextResponse.json({ error: freshErr.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json(fresh);
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthenticated()) return unauthorized();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await (await getAdminClient()).from("book_sets").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
