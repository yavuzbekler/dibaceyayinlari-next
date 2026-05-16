"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Compass, ScrollText } from "lucide-react";
import type { Book } from "@/lib/types";
import { BookCard } from "./book-card";

export function HomeClassic({ books, content }: { books: Book[]; content: Record<string, string> }) {
  const [current, setCurrent] = useState(0);
  const slides = useMemo(() => [
    { image: "/slider-hero.png", title: content.HOME_HERO_1_TITLE, subtitle: content.HOME_HERO_1_SUBTITLE, href: "/hakkimizda", button: content.HOME_HERO_1_BUTTON },
    { image: "/slider-hands.png", title: content.HOME_HERO_2_TITLE, subtitle: content.HOME_HERO_2_SUBTITLE, href: "/kitaplar", button: content.HOME_HERO_2_BUTTON },
    { image: "/slider-wisdom.png", title: content.HOME_HERO_3_TITLE, subtitle: content.HOME_HERO_3_SUBTITLE, href: "/yazarlar", button: content.HOME_HERO_3_BUTTON }
  ], [content]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <main className="page">
      <section className="hero">
        {slides.map((slide, index) => (
          <div key={slide.image} className={`hero-slide ${index === current ? "active" : ""}`}>
            <img src={slide.image} alt={slide.title} />
            <div className="hero-content">
              <div className="hero-orb">
                <div>
                  <span className="eyebrow hero-label">{content.HOME_BRAND_LABEL}</span>
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                  <Link className="btn" href={slide.href}>
                    {slide.button} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="hero-strip">
          <div className="container hero-strip-inner">
            <p className="hero-quote" dangerouslySetInnerHTML={{ __html: content.HOME_QUOTE_TEXT }} />
            <div className="slider-buttons">
              <button className="icon-button" type="button" aria-label="Önceki görsel" onClick={() => setCurrent((current + slides.length - 1) % slides.length)}>
                <ChevronLeft size={22} />
              </button>
              <button className="icon-button" type="button" aria-label="Sonraki görsel" onClick={() => setCurrent((current + 1) % slides.length)}>
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{content.HOME_FEATURED_SUBTITLE}</span>
              <h2>{content.HOME_FEATURED_TITLE}</h2>
            </div>
            <Link className="btn ghost" href="/kitaplar">{content.HOME_FEATURED_VIEW_ALL}</Link>
          </div>
          <div className="book-grid">
            {books.slice(0, 6).map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      <section className="section philosophy">
        <div className="container philosophy-grid">
          {[
            [BookOpen, content.HOME_PHILOSOPHY_1_TITLE, content.HOME_PHILOSOPHY_1_DESC],
            [ScrollText, content.HOME_PHILOSOPHY_2_TITLE, content.HOME_PHILOSOPHY_2_DESC],
            [Compass, content.HOME_PHILOSOPHY_3_TITLE, content.HOME_PHILOSOPHY_3_DESC]
          ].map(([Icon, title, desc]) => (
            <article className="philosophy-card" key={String(title)}>
              <Icon color="#7a4a2e" />
              <h3>{title as string}</h3>
              <p>{desc as string}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
