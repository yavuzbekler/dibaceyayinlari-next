"use client";

import { useState } from "react";
import {
  Plus, Trash2, Pencil, Save, X, Package, Upload, Image as ImageIcon,
  Link as LinkIcon, BookOpen, Eye, EyeOff
} from "lucide-react";
import type { Author, Book } from "@/lib/types";

const CHANNELS = ["Ravza Kitap", "Kitapyurdu", "Trendyol", "Hepsiburada", "Amazon"];

type SetItem = { book_id: string };
type SetLink = { name: string; url: string; price: number };

type SetData = {
  id: string;
  name: string;
  description: string;
  cover: string;
  items: SetItem[];
  sales_links: SetLink[];
};

type BookSetRow = {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  created_at?: string;
  show_on_homepage: boolean;
  book_set_items: { book_id: string; book: { id: string; title: string; cover: string | null; author_id: string; author: { name: string } | null } | null }[];
  set_sales_links: { name: string; url: string; price: number }[];
};

const emptyForm: SetData = {
  id: "", name: "", description: "", cover: "", items: [], sales_links: [],
};

export function SetManager({ sets: initialSets, books, authors }: { sets: BookSetRow[]; books: Book[]; authors: Author[] }) {
  const [sets, setSets] = useState(initialSets);
  const [editing, setEditing] = useState<SetData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(set: BookSetRow) {
    setEditing({
      id: set.id,
      name: set.name,
      description: set.description ?? "",
      cover: set.cover ?? "",
      items: set.book_set_items.map((i) => ({ book_id: i.book_id })),
      sales_links: (set.set_sales_links ?? []).map((l) => ({ name: l.name, url: l.url, price: l.price })),
    });
    setIsAdding(false);
  }

  function startAdd() {
    setEditing({ ...emptyForm });
    setIsAdding(true);
  }

  function cancel() {
    setEditing(null);
    setIsAdding(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.name) {
      alert("Set adı zorunludur.");
      return;
    }
    if (!editing.id) {
      alert("Set ID (slug) zorunludur.");
      return;
    }
    if (editing.items.length < 2) {
      alert("Bir set en az 2 kitap içermelidir.");
      return;
    }
    if (editing.items.length > 3) {
      alert("Bir set en fazla 3 kitap içerebilir.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return alert(data.error ?? "Kaydetme hatası");
    setSets((prev) => {
      const without = prev.filter((s) => s.id !== data.id);
      return [...without, data].sort((a, b) =>
        String(a.created_at ?? a.id).localeCompare(String(b.created_at ?? b.id))
      );
    });
    cancel();
  }

  async function handleDelete(set: BookSetRow) {
    if (!confirm(`"${set.name}" setini silmek istediğinize emin misiniz?`)) return;
    const res = await fetch(`/api/admin/sets?id=${encodeURIComponent(set.id)}`, { method: "DELETE" });
    if (!res.ok) return alert("Silme hatası");
    setSets((prev) => prev.filter((s) => s.id !== set.id));
  }

  async function toggleHomepage(set: BookSetRow) {
    const newVal = !set.show_on_homepage;
    const res = await fetch("/api/admin/sets/toggle-homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: set.id, show_on_homepage: newVal }),
    });
    if (!res.ok) return alert("Güncelleme hatası");
    setSets((prev) =>
      prev.map((s) => (s.id === set.id ? { ...s, show_on_homepage: newVal } : s))
    );
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

  function toggleBook(bookId: string) {
    if (!editing) return;
    const exists = editing.items.some((i) => i.book_id === bookId);
    if (exists) {
      setEditing({ ...editing, items: editing.items.filter((i) => i.book_id !== bookId) });
    } else {
      if (editing.items.length >= 3) {
        alert("Bir sete en fazla 3 kitap ekleyebilirsiniz.");
        return;
      }
      setEditing({ ...editing, items: [...editing.items, { book_id: bookId }] });
    }
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

  const [bookFilter, setBookFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");

  const filteredBooks = books.filter((b) => {
    const matchTitle = b.title.toLowerCase().includes(bookFilter.toLowerCase());
    const matchAuthor = !authorFilter || b.author_id === authorFilter;
    return matchTitle && matchAuthor;
  });

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Set Yönetimi</h1>
          <p>Kitapları 2'li veya 3'lü setler halinde gruplandırın.</p>
        </div>
        <button className="admin-btn" onClick={startAdd}>
          <Package size={16} /> Yeni Set Oluştur
        </button>
      </div>

      {editing && (
        <section className="admin-card book-edit-card">
          <h2 style={{ marginBottom: 16 }}>{isAdding ? "Yeni Set Oluştur" : "Seti Düzenle"}</h2>

          <div className="book-edit-grid">
            <div className="book-edit-left">
              {isAdding && (
                <div className="field">
                  <label>Slug / ID</label>
                  <input value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} placeholder="set-adi" />
                </div>
              )}
              <div className="field">
                <label>Set Adı</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
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
                <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Satış Linkleri & Fiyatlar</label>
                <button className="admin-btn secondary" onClick={addLink} style={{ fontSize: 12, padding: "4px 10px" }}>
                  <Plus size={12} /> Ekle
                </button>
              </div>
              <div className="sales-links-edit-list" style={{ maxHeight: 240 }}>
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
                  <p style={{ opacity: 0.4, fontSize: 13, textAlign: "center", padding: 16 }}>Henüz satış linki eklenmemiş.</p>
                )}
              </div>
            </div>

            <div className="book-edit-right">
              <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: "block" }}>
                Kitap Seçimi ({editing.items.length}/3)
              </label>
              <p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>
                2 veya 3 kitap seçin. Seçili kitaplar yeşil kenarlıkla işaretlenir.
              </p>
              <div className="field-row" style={{ marginBottom: 10 }}>
                <input
                  placeholder="Kitap ara..."
                  value={bookFilter}
                  onChange={(e) => setBookFilter(e.target.value)}
                  style={{ fontSize: 13 }}
                />
                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="">Tüm Yazarlar</option>
                  {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="set-book-picker">
                {filteredBooks.map((book) => {
                  const selected = editing.items.some((i) => i.book_id === book.id);
                  const author = authors.find((a) => a.id === book.author_id);
                  return (
                    <div
                      key={book.id}
                      className={`set-book-option${selected ? " selected" : ""}`}
                      onClick={() => toggleBook(book.id)}
                    >
                      <div className="set-book-option-cover">
                        {book.cover ? (
                          <img src={book.cover} alt={book.title} />
                        ) : (
                          <div className="set-book-option-placeholder"><BookOpen size={16} /></div>
                        )}
                      </div>
                      <div className="set-book-option-info">
                        <strong>{book.title}</strong>
                        <span>{author?.name ?? "—"}</span>
                      </div>
                      {selected && <div className="set-book-check">✓</div>}
                    </div>
                  );
                })}
                {filteredBooks.length === 0 && (
                  <p style={{ opacity: 0.4, fontSize: 13, textAlign: "center", padding: 20 }}>Kitap bulunamadı.</p>
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

      <div className="set-grid">
        {sets.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, opacity: 0.4 }}>Henüz set oluşturulmamış.</p>
        ) : (
          sets.map((set) => {
            const itemBooks = set.book_set_items
              .map((i) => i.book)
              .filter(Boolean) as { id: string; title: string; cover: string | null; author: { name: string } | null }[];
            const linkCount = set.set_sales_links?.length ?? 0;
            return (
              <div key={set.id} className="set-card">
                <div className="set-card-covers">
                  {itemBooks.map((b) => (
                    <div key={b.id} className="set-card-cover-thumb">
                      {b.cover ? <img src={b.cover} alt={b.title} /> : <BookOpen size={20} />}
                    </div>
                  ))}
                  <div className="set-card-overlay">
                    <button className="book-card-action" onClick={() => startEdit(set)}>
                      <Pencil size={18} />
                    </button>
                    <button className="book-card-action danger" onClick={() => handleDelete(set)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="set-card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                    <h3>{set.name}</h3>
                    <button
                      className={`set-homepage-toggle${set.show_on_homepage ? " active" : ""}`}
                      onClick={() => toggleHomepage(set)}
                      title={set.show_on_homepage ? "Anasayfadan kaldır" : "Anasayfada göster"}
                    >
                      {set.show_on_homepage ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{set.show_on_homepage ? "Anasayfada" : "Gizli"}</span>
                    </button>
                  </div>
                  <p className="set-card-books">
                    {itemBooks.map((b) => b.title).join(" + ")}
                  </p>
                  <div className="set-card-meta">
                    <span><Package size={11} /> {itemBooks.length} kitap</span>
                    {linkCount > 0 && <span><LinkIcon size={11} /> {linkCount} kanal</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
