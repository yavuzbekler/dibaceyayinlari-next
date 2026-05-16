import "server-only";

import type { Author, Book, SiteContent } from "./types";
import { authorsSeed, booksSeed, contentsSeed } from "./site-data";
import { getSupabase, getSupabaseAdmin } from "./supabase";

function attachAuthors(books: Book[], authors: Author[]) {
  return books.map((book) => ({
    ...book,
    author: authors.find((author) => author.id === book.author_id) ?? null
  }));
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const { data, error } = await getSupabase().from("authors").select("*").order("id");
    if (error) throw error;
    return data ?? authorsSeed;
  } catch {
    return authorsSeed;
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const { data, error } = await getSupabase()
      .from("books")
      .select("*, author:authors(*), sales_links(*)")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as Book[]) ?? attachAuthors(booksSeed, authorsSeed);
  } catch {
    return attachAuthors(booksSeed, authorsSeed);
  }
}

export async function getBook(id: string): Promise<Book | null> {
  const fallback = attachAuthors(booksSeed, authorsSeed).find((book) => book.id === id) ?? null;
  try {
    const { data, error } = await getSupabase()
      .from("books")
      .select("*, author:authors(*), sales_links(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Book | null) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getAuthor(id: string): Promise<(Author & { books: Book[] }) | null> {
  const fallback = authorsSeed.find((author) => author.id === id);
  try {
    const { data, error } = await getSupabase().from("authors").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data && !fallback) return null;
    const books = (await getBooks()).filter((book) => book.author_id === id);
    return { ...((data as Author | null) ?? fallback!), books };
  } catch {
    if (!fallback) return null;
    return { ...fallback, books: booksSeed.filter((book) => book.author_id === id) };
  }
}

export async function getContents(): Promise<SiteContent[]> {
  try {
    const { data, error } = await getSupabase().from("site_contents").select("*").order("key");
    if (error) throw error;
    return data ?? contentsSeed;
  } catch {
    return contentsSeed;
  }
}

export async function getAdminStats() {
  const [authors, books] = await Promise.all([getAuthors(), getBooks()]);
  return {
    authorCount: authors.length,
    bookCount: books.length,
    salesLinkCount: books.reduce((total, book) => total + (book.sales_links?.length ?? 0), 0)
  };
}

export async function getAdminClient() {
  return getSupabaseAdmin();
}
