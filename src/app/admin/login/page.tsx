export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="login-screen">
      <form className="login-card admin-form" action="/api/admin/login" method="POST">
        <div>
          <span className="eyebrow" style={{ color: "#4ade80" }}>Dibace</span>
          <h1>Admin Panel</h1>
          <p style={{ color: "#a3a3a3" }}>Kitap, yazar ve site içeriklerini yönetin.</p>
        </div>
        {searchParams.error && <p style={{ color: "#ff453a" }}>Geçersiz kullanıcı adı veya şifre.</p>}
        <input name="username" placeholder="Kullanıcı adı" required />
        <input name="password" type="password" placeholder="Şifre" required />
        <button className="admin-btn" type="submit">Giriş Yap</button>
      </form>
    </main>
  );
}
