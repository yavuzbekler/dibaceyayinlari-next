import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import ts from "typescript";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing Supabase env variables.");
}

const source = fs.readFileSync(new URL("../src/lib/site-data.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
const module = { exports: {} };
new Function("exports", "require", "module", "__filename", "__dirname", output)(
  module.exports,
  () => ({}),
  module,
  "site-data.ts",
  "."
);

const { authorsSeed, booksSeed, contentsSeed } = module.exports;
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const admins = [
  { username: "admin", password: "123123", email: "admin@dibace.com" },
  { username: "Platon", password: "Kaiser2534.!", email: "platon@dibace.com" }
];

for (const admin of admins) {
  const password_hash = await bcrypt.hash(admin.password, 10);
  const { error } = await supabase
    .from("admins")
    .upsert({ username: admin.username, password_hash, email: admin.email }, { onConflict: "username" });
  if (error) throw error;
}

const { error: authorsError } = await supabase.from("authors").upsert(authorsSeed);
if (authorsError) throw authorsError;

for (const book of booksSeed) {
  const { sales_links = [], author, ...bookRow } = book;
  const { error: bookError } = await supabase.from("books").upsert(bookRow);
  if (bookError) throw bookError;
  await supabase.from("sales_links").delete().eq("book_id", book.id);
  if (sales_links.length) {
    const { error: linksError } = await supabase.from("sales_links").insert(
      sales_links.map((link, index) => ({ ...link, book_id: book.id, sort_order: index }))
    );
    if (linksError) throw linksError;
  }
}

const { error: contentError } = await supabase.from("site_contents").upsert(contentsSeed, { onConflict: "key" });
if (contentError) throw contentError;

console.log(`Seeded ${authorsSeed.length} authors, ${booksSeed.length} books, ${contentsSeed.length} content rows.`);
