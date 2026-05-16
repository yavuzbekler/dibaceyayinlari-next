import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dibace Yayınları - Tasavvuf, Felsefe ve İslam Kitapları",
  description: "Dibace Yayınları ile tasavvuf, felsefe ve İslam düşüncesi alanında seçkin eserler keşfedin."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
