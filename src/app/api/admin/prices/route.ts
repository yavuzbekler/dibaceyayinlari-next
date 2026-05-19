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
    .from("books")
    .select("id, title, cover, sales_links(id, name, url, price, sort_order)")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

type UpdateItem = { id: string; price: number };
type CreateItem = { book_id: string; name: string; price: number };

function isCreate(item: UpdateItem | CreateItem): item is CreateItem {
  return "book_id" in item;
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return unauthorized();
  const items: (UpdateItem | CreateItem)[] = await request.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Array bekleniyor" }, { status: 400 });
  }
  const supabase = await getAdminClient();
  const created: { id: string; name: string; book_id: string }[] = [];

  for (const item of items) {
    if (isCreate(item)) {
      const { data, error } = await supabase
        .from("sales_links")
        .insert({ book_id: item.book_id, name: item.name, url: "", price: item.price })
        .select("id, name, book_id")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      created.push(data);
    } else {
      const { error } = await supabase
        .from("sales_links")
        .update({ price: item.price })
        .eq("id", item.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, created });
}
