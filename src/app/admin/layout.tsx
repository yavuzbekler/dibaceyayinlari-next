export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem("dibace-theme");if(t==="dark"||(t==="system"||!t)&&window.matchMedia("(prefers-color-scheme:dark)").matches)document.documentElement.classList.add("dark")})()` }} />
      {children}
    </>
  );
}
