"use client";

import { useState } from "react";
import type { Author, Book, SiteContent } from "@/lib/types";

type Mode = "books" | "authors" | "contents";

export function AdminManager({ mode, rows, authors = [] }: { mode: Mode; rows: (Book | Author | SiteContent)[]; authors?: Author[] }) {
  const [items, setItems] = useState(rows);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const endpoint = `/api/admin/${mode}`;
  const isBook = mode === "books";
  const isAuthor = mode === "authors";

  async function save() {
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing)
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) return alert(data.error ?? "Kaydetme hatası");
    setItems((current) => {
      const without = current.filter((item: any) => item.id !== data.id);
      return [...without, data].sort((a: any, b: any) => {
        if (a.created_at && b.created_at) return String(a.created_at).localeCompare(String(b.created_at));
        return String(a.id ?? a.key).localeCompare(String(b.id ?? b.key));
      });
    });
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    const response = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) return alert("Silme hatası");
    setItems((current) => current.filter((item: any) => item.id !== id));
  }

  const empty = isBook
    ? { id: "", title: "", author_id: authors[0]?.id ?? "", cover: "", summary: "", isbn: "", published_date: "", genre: "", sales_links: [] }
    : isAuthor
      ? { id: "", name: "", photo: "", short_bio: "", full_bio: "" }
      : { key: "", value: "", description: "" };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>{isBook ? "Kitap Yönetimi" : isAuthor ? "Yazar Yönetimi" : "Site Metinleri"}</h1>
          <p>{isBook ? "Eser bilgilerini ve satış kanallarını düzenleyin." : isAuthor ? "Yazar bilgilerini ve biyografilerini düzenleyin." : "Sitede görünen metinleri düzenleyin."}</p>
        </div>
        <button className="admin-btn" onClick={() => setEditing(empty)}>Yeni Ekle</button>
      </div>

      {editing && (
        <section className="admin-card" style={{ marginBottom: 22 }}>
          <div className="admin-form">
            {isBook && <BookFields value={editing} setValue={setEditing} authors={authors} />}
            {isAuthor && <AuthorFields value={editing} setValue={setEditing} />}
            {mode === "contents" && <ContentFields value={editing} setValue={setEditing} />}
            <div className="admin-actions">
              <button className="admin-btn" disabled={saving} onClick={save}>{saving ? "Kaydediliyor..." : "Kaydet"}</button>
              <button className="admin-btn secondary" onClick={() => setEditing(null)}>Vazgeç</button>
            </div>
          </div>
        </section>
      )}

      <section className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Başlık</th><th>Detay</th><th>İşlem</th></tr></thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id ?? item.key}>
                <td><strong>{item.title ?? item.name ?? item.key}</strong></td>
                <td>{item.genre ?? item.short_bio ?? item.description}</td>
                <td className="admin-actions">
                  <button
                    className="admin-btn secondary"
                    onClick={() => setEditing(isBook ? { ...item, original_id: item.id } : item)}
                  >
                    Düzenle
                  </button>
                  <button className="admin-btn danger" onClick={() => remove(item.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function BookFields({ value, setValue, authors }: { value: any; setValue: (v: any) => void; authors: Author[] }) {
  const isExisting = Boolean(value.original_id);

  return (
    <>
      <input
        placeholder="Slug / ID"
        value={value.id ?? ""}
        disabled={isExisting}
        onChange={(e) => setValue({ ...value, id: e.target.value })}
      />
      <input placeholder="Kitap adı" value={value.title ?? ""} onChange={(e) => setValue({ ...value, title: e.target.value })} />
      <select value={value.author_id ?? ""} onChange={(e) => setValue({ ...value, author_id: e.target.value })}>{authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}</select>
      <input placeholder="Kapak URL" value={value.cover ?? ""} onChange={(e) => setValue({ ...value, cover: e.target.value })} />
      <textarea placeholder="Özet" value={value.summary ?? ""} onChange={(e) => setValue({ ...value, summary: e.target.value })} />
      <input placeholder="ISBN" value={value.isbn ?? ""} onChange={(e) => setValue({ ...value, isbn: e.target.value })} />
      <input placeholder="Yayın yılı" value={value.published_date ?? ""} onChange={(e) => setValue({ ...value, published_date: e.target.value })} />
      <input placeholder="Tür" value={value.genre ?? ""} onChange={(e) => setValue({ ...value, genre: e.target.value })} />
      <textarea placeholder='Satış linkleri JSON: [{"name":"Ravza Kitap","url":"...","price":60}]' value={JSON.stringify(value.sales_links ?? [], null, 2)} onChange={(e) => {
        try { setValue({ ...value, sales_links: JSON.parse(e.target.value) }); } catch {}
      }} />
    </>
  );
}

function AuthorFields({ value, setValue }: { value: any; setValue: (v: any) => void }) {
  return (
    <>
      <input placeholder="ID" value={value.id ?? ""} onChange={(e) => setValue({ ...value, id: e.target.value })} />
      <input placeholder="Yazar adı" value={value.name ?? ""} onChange={(e) => setValue({ ...value, name: e.target.value })} />
      <input placeholder="Fotoğraf URL" value={value.photo ?? ""} onChange={(e) => setValue({ ...value, photo: e.target.value })} />
      <input placeholder="Kısa biyografi" value={value.short_bio ?? ""} onChange={(e) => setValue({ ...value, short_bio: e.target.value })} />
      <textarea placeholder="Tam biyografi" value={value.full_bio ?? ""} onChange={(e) => setValue({ ...value, full_bio: e.target.value })} />
    </>
  );
}

function ContentFields({ value, setValue }: { value: any; setValue: (v: any) => void }) {
  return (
    <>
      <input placeholder="Anahtar" value={value.key ?? ""} onChange={(e) => setValue({ ...value, key: e.target.value })} />
      <textarea placeholder="Değer" value={value.value ?? ""} onChange={(e) => setValue({ ...value, value: e.target.value })} />
      <input placeholder="Açıklama" value={value.description ?? ""} onChange={(e) => setValue({ ...value, description: e.target.value })} />
    </>
  );
}
