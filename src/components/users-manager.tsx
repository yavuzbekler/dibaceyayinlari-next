"use client";

import { useState, useEffect } from "react";

type AdminUser = {
  id: string;
  username: string;
  email: string | null;
  created_at: string;
};

export function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", email: "" });

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  async function addUser() {
    if (!form.username || !form.password) return alert("Kullanıcı adı ve şifre zorunlu.");
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return alert(data.error ?? "Hata oluştu.");
    setUsers([...users, data]);
    setForm({ username: "", password: "", email: "" });
    setAdding(false);
  }

  async function removeUser(id: string, username: string) {
    if (!confirm(`"${username}" kullanıcısını silmek istediğinize emin misiniz?`)) return;
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      return alert(data.error ?? "Silme hatası.");
    }
    setUsers(users.filter((u) => u.id !== id));
  }

  if (loading) return <p style={{ color: "var(--admin-muted)" }}>Yükleniyor...</p>;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Kullanıcı Yönetimi</h1>
          <p>Yönetici hesaplarını oluşturun ve yönetin.</p>
        </div>
        <button className="admin-btn" onClick={() => setAdding(true)}>Yeni Kullanıcı</button>
      </div>

      {adding && (
        <section className="admin-card" style={{ marginBottom: 22 }}>
          <div className="admin-form">
            <input placeholder="Kullanıcı adı" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input type="password" placeholder="Şifre (min. 6 karakter)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input placeholder="E-posta (opsiyonel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="admin-actions">
              <button className="admin-btn" disabled={saving} onClick={addUser}>{saving ? "Kaydediliyor..." : "Kaydet"}</button>
              <button className="admin-btn secondary" onClick={() => { setAdding(false); setForm({ username: "", password: "", email: "" }); }}>Vazgeç</button>
            </div>
          </div>
        </section>
      )}

      <section className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Kullanıcı</th><th>E-posta</th><th>Kayıt Tarihi</th><th>İşlem</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.username}</strong></td>
                <td>{user.email ?? "—"}</td>
                <td>{new Date(user.created_at).toLocaleDateString("tr-TR")}</td>
                <td>
                  <button className="admin-btn danger" onClick={() => removeUser(user.id, user.username)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
