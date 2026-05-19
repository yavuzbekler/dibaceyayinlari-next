"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, Search, TrendingUp } from "lucide-react";

type SalesLink = { id: string; name: string; url: string; price: number; sort_order?: number };
type BookWithPrices = { id: string; title: string; cover: string | null; sales_links: SalesLink[] };

const CHANNELS = ["Ravza Kitap", "Kitapyurdu", "Trendyol", "Hepsiburada", "Amazon"];

type Change = { id: string; price: number } | { book_id: string; name: string; price: number };

export function PriceManager() {
  const [books, setBooks] = useState<BookWithPrices[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState<Map<string, Change>>(new Map());

  useEffect(() => {
    fetch("/api/admin/prices")
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => alert("Kitaplar yüklenirken hata oluştu."))
      .finally(() => setLoading(false));
  }, []);

  function handlePrice(linkId: string | null, bookId: string, channel: string, value: number) {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const existingLink = b.sales_links.find((l) => l.name === channel);
        if (existingLink) {
          return { ...b, sales_links: b.sales_links.map((l) => (l.id === existingLink.id ? { ...l, price: value } : l)) };
        }
        const tempId = `new-${bookId}-${channel}`;
        return { ...b, sales_links: [...b.sales_links, { id: tempId, name: channel, url: "", price: value }] };
      })
    );

    const existingLink = books.find((b) => b.id === bookId)?.sales_links.find((l) => l.name === channel);
    if (existingLink) {
      setDirty((prev) => new Map(prev).set(existingLink.id, { id: existingLink.id, price: value }));
    } else {
      const key = `new-${bookId}-${channel}`;
      setDirty((prev) => new Map(prev).set(key, { book_id: bookId, name: channel, price: value }));
    }
    setSaved(false);
  }

  async function handleSave() {
    if (dirty.size === 0) return;
    setSaving(true);
    const updates = Array.from(dirty.values());
    const res = await fetch("/api/admin/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    if (res.ok) {
      const result = await res.json();
      if (result.created && result.created.length > 0) {
        setBooks((prev) =>
          prev.map((b) => ({
            ...b,
            sales_links: b.sales_links.map((l) => {
              const created = result.created.find((c: SalesLink) => c.name === l.name && `new-${b.id}-${l.name}` === l.id);
              return created ? { ...l, id: created.id } : l;
            }),
          }))
        );
      }
      setSaved(true);
      setDirty(new Map());
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Kaydetme hatası");
    }
  }

  const filtered = books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Fiyat Yönetimi</h1>
          <p>Tüm kitapların satış fiyatlarını tek bir tablodan güncelleyin.</p>
        </div>
        <button className="admin-btn" onClick={handleSave} disabled={saving || dirty.size === 0}>
          {saving ? "Kaydediliyor..." : saved ? <><CheckCircle size={16} /> Kaydedildi</> : <><Save size={16} /> Tümünü Kaydet</>}
        </button>
      </div>

      <section className="admin-card" style={{ overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", maxWidth: 300, flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
            <input
              placeholder="Kitap ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34, width: "100%" }}
            />
          </div>
          {dirty.size > 0 && (
            <span style={{ fontSize: 12, opacity: 0.5, display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={12} /> {dirty.size} değişiklik kaydedilmedi
            </span>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Kitap</th>
                {CHANNELS.map((ch) => (
                  <th key={ch} style={{ textAlign: "center", minWidth: 110 }}>{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={CHANNELS.length + 1} style={{ textAlign: "center", padding: 40, opacity: 0.5 }}>Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={CHANNELS.length + 1} style={{ textAlign: "center", padding: 40, opacity: 0.5 }}>Sonuç bulunamadı.</td></tr>
              ) : (
                filtered.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {book.cover && (
                          <img src={book.cover} alt="" style={{ width: 28, height: 40, objectFit: "cover", borderRadius: 3 }} />
                        )}
                        <strong style={{ fontSize: 13 }}>{book.title}</strong>
                      </div>
                    </td>
                    {CHANNELS.map((ch) => {
                      const link = book.sales_links.find((l) => l.name === ch);
                      return (
                        <td key={ch} style={{ textAlign: "center" }}>
                          <input
                            type="number"
                            step="0.01"
                            value={link?.price ?? ""}
                            placeholder="0.00"
                            onChange={(e) => handlePrice(link?.id ?? null, book.id, ch, parseFloat(e.target.value) || 0)}
                            style={{ width: 90, textAlign: "center", fontSize: 13 }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
