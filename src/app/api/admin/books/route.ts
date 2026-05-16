import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  const {
    sales_links = [],
    author,
    original_id,
    created_at,
    updated_at,
    ...book
  } = body;

  if (!book.id) {
    return NextResponse.json({ error: "Kitap ID zorunlu." }, { status: 400 });
  }

  if (!slugPattern.test(book.id)) {
    return NextResponse.json({ error: "Kitap ID sadece küçük harf, rakam ve tire içerebilir." }, { status: 400 });
  }

  const supabase = await getAdminClient();
  const { data, error } = await supabase.from("books").upsert(book).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("sales_links").delete().eq("book_id", book.id);
  if (sales_links.length) {
    const links = sales_links.map((link: any, index: number) => ({
      name: link.name,
      url: link.url,
      price: Number(link.price) || 0,
      book_id: book.id,
      sort_order: index
    }));
    const { error: linksError } = await supabase.from("sales_links").insert(links);
    if (linksError) return NextResponse.json({ error: linksError.message }, { status: 400 });
  }

  const { data: fresh, error: freshError } = await supabase
    .from("books")
    .select("*, author:authors(*), sales_links(*)")
    .eq("id", data.id)
    .single();
  if (freshError) return NextResponse.json({ error: freshError.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json(fresh);
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await (await getAdminClient()).from("books").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
