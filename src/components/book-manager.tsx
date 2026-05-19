"use client";

import { useState } from "react";
import {
  Plus, Trash2, Pencil, Save, X, BookPlus, Upload, Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import type { Author, Book } from "@/lib/types";

const CHANNELS = ["Ravza Kitap", "Kitapyurdu", "Trendyol", "Hepsiburada", "Amazon"];

type FormData = {
  id: string;
  original_id?: string;
  title: string;
  author_id: string;
  cover: string;
  summary: string;
  isbn: string;
  published_date: string;
  genre: string;
  sales_links: { name: string; url: string; price: number }[];
};

const emptyForm: FormData = {
  id: "", title: "", author_id: "", cover: "", summary: "",
  isbn: "", published_date: "", genre: "", sales_links: [],
};

export function BookManager({ books: initialBooks, authors }: { books: Book[]; authors: Author[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [editing, setEditing] = useState<FormData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(book: Book) {
    setEditing({
      id: book.id,
      original_id: book.id,
      title: book.title,
      author_id: book.author_id,
      cover: book.cover ?? "",
      summary: book.summary ?? "",
      isbn: book.isbn ?? "",
      published_date: book.published_date ?? "",
      genre: book.genre ?? "",
      sales_links: (book.sales_links ?? []).map((l) => ({ name: l.name, url: l.url, price: l.price })),
    });
    setIsAdding(false);
  }

  function startAdd() {
    setEditing({ ...emptyForm, author_id: authors[0]?.id ?? "" });
    setIsAdding(true);
  }

  function cancel() {
    setEditing(null);
    setIsAdding(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title || !editing.author_id) {
      alert("Kitap başlığı ve yazar zorunludur.");
      return;
    }
    setSaving(true);
    const method = isAdding ? "POST" : "PUT";
    const res = await fetch("/api/admin/books", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return alert(data.error ?? "Kaydetme hatası");
    setBooks((prev) => {
      const without = prev.filter((b) => b.id !== data.id && b.id !== editing.original_id);
      return [...without, data].sort((a, b) =>
        String(a.created_at ?? a.id).localeCompare(String(b.created_at ?? b.id))
      );
    });
    cancel();
  }

  async function handleDelete(book: Book) {
    if (!confirm(`"${book.title}" kitabını silmek istediğinize emin misiniz?`)) return;
    const res = await fetch(`/api/admin/books?id=${encodeURIComponent(book.id)}`, { method: "DELETE" });
    if (!res.ok) return alert("Silme hatası");
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditing({ ...editing, cover: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function addLink() {
    if (!editing) return;
    setEditing({
      ...editing,
      sales_links: [...editing.sales_links, { name: "Ravza Kitap", url: "", price: 0 }],
    });
  }

  function updateLink(i: number, field: string, value: string | number) {
    if (!editing) return;
    const links = [...editing.sales_links];
    links[i] = { ...links[i], [field]: value };
    setEditing({ ...editing, sales_links: links });
  }

  function removeLink(i: number) {
    if (!editing) return;
    setEditing({ ...editing, sales_links: editing.sales_links.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Kitap Yönetimi</h1>
          <p>Kitap listesini, kapaklarını ve satış linklerini yönetin.</p>
        </div>
        <button className="admin-btn" onClick={startAdd}>
          <BookPlus size={16} /> Yeni Kitap Ekle
        </button>
      </div>

      {editing && (
        <section className="admin-card book-edit-card">
          <h2 style={{ marginBottom: 16 }}>{isAdding ? "Yeni Kitap Ekle" : "Kitabı Düzenle"}</h2>
          <div className="book-edit-grid">
            <div className="book-edit-left">
              {isAdding && (
                <div className="field">
                  <label>Slug / ID</label>
                  <input value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} placeholder="kitap-adi" />
                </div>
              )}
              <div className="field">
                <label>Kitap Başlığı</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="field">
                <label>Yazar</label>
                <select value={editing.author_id} onChange={(e) => setEditing({ ...editing, author_id: e.target.value })}>
                  <option value="">Yazar Seçin</option>
                  {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>ISBN</label>
                  <input value={editing.isbn} onChange={(e) => setEditing({ ...editing, isbn: e.target.value })} />
                </div>
                <div className="field">
                  <label>Yayın Yılı</label>
                  <input value={editing.published_date} onChange={(e) => setEditing({ ...editing, published_date: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Tür</label>
                <input value={editing.genre} onChange={(e) => setEditing({ ...editing, genre: e.target.value })} />
              </div>
              <div className="field">
                <label>Kapak Görseli</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ flex: 1 }} placeholder="Görsel URL" value={editing.cover} onChange={(e) => setEditing({ ...editing, cover: e.target.value })} />
                  <label className="admin-btn secondary upload-btn">
                    <Upload size={16} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                </div>
                {editing.cover && (
                  <small style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, opacity: 0.5 }}>
                    <ImageIcon size={12} />
                    {editing.cover.startsWith("data:") ? "Yüklenen görsel" : editing.cover.slice(0, 50)}
                  </small>
                )}
              </div>
              <div className="field">
                <label>Açıklama</label>
                <textarea rows={4} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
              </div>
            </div>

            <div className="book-edit-right">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Satış Linkleri & Fiyatlar</label>
                <button className="admin-btn secondary" onClick={addLink} style={{ fontSize: 12, padding: "4px 10px" }}>
                  <Plus size={12} /> Ekle
                </button>
              </div>
              <div className="sales-links-edit-list">
                {editing.sales_links.map((link, i) => (
                  <div key={i} className="sales-link-edit-item">
                    <button className="sales-link-remove-btn" onClick={() => removeLink(i)}><X size={14} /></button>
                    <div className="field-row">
                      <select value={link.name} onChange={(e) => updateLink(i, "name", e.target.value)}>
                        {CHANNELS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                      </select>
                      <div className="price-input-wrap">
                        <input type="number" step="0.01" value={link.price} onChange={(e) => updateLink(i, "price", parseFloat(e.target.value) || 0)} />
                        <span className="price-suffix">₺</span>
                      </div>
                    </div>
                    <input placeholder="Satış URL'si" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} style={{ fontSize: 12 }} />
                  </div>
                ))}
                {editing.sales_links.length === 0 && (
                  <p style={{ opacity: 0.4, fontSize: 13, textAlign: "center", padding: 20 }}>Henüz satış linki eklenmemiş.</p>
                )}
              </div>
            </div>
          </div>
          <div className="admin-actions" style={{ marginTop: 16, borderTop: "1px solid var(--admin-border)", paddingTop: 16 }}>
            <button className="admin-btn" disabled={saving} onClick={handleSave}>
              {saving ? "Kaydediliyor..." : <><Save size={16} /> Kaydet</>}
            </button>
            <button className="admin-btn secondary" onClick={cancel}>İptal</button>
          </div>
        </section>
      )}

      <div className="book-grid">
        {books.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, opacity: 0.4 }}>Henüz kitap eklenmemiş.</p>
        ) : (
          books.map((book) => {
            const author = authors.find((a) => a.id === book.author_id);
            const linkCount = book.sales_links?.length ?? 0;
            return (
              <div key={book.id} className="book-card">
                <div className="book-card-cover">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} />
                  ) : (
                    <div className="book-card-placeholder">
                      <BookPlus size={32} />
                    </div>
                  )}
                  <div className="book-card-overlay">
                    <button className="book-card-action" onClick={() => startEdit(book)}>
                      <Pencil size={18} />
                    </button>
                    <button className="book-card-action danger" onClick={() => handleDelete(book)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="book-card-body">
                  <h3>{book.title}</h3>
                  <p className="book-card-author">{author?.name ?? "—"}</p>
                  <div className="book-card-meta">
                    {book.isbn && <span>{book.isbn}</span>}
                    {book.published_date && <span>{book.published_date}</span>}
                  </div>
                  {linkCount > 0 && (
                    <div className="book-card-links">
                      <LinkIcon size={12} /> {linkCount} satış kanalı
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
