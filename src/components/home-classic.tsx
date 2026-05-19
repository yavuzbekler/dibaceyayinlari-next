"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Compass,
  ScrollText,
} from "lucide-react";
import type { Book } from "@/lib/types";
import { SetsShowcase } from "@/components/sets-showcase";

const QuoteIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
  </svg>
);

type SetWithBooks = {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  book_set_items: { book_id: string; book: { id: string; title: string; cover: string | null; author_id: string; author: { name: string } | null } | null }[];
  set_sales_links: { name: string; url: string; price: number }[];
};

export function HomeClassic({
  books,
  content,
  sets = [],
}: {
  books: Book[];
  content: Record<string, string>;
  sets?: SetWithBooks[];
}) {
  const [current, setCurrent] = useState(0);
  const [bookSlide, setBookSlide] = useState(0);

  const slides = useMemo(
    () => [
      {
        image: "/slider-hero.png",
        title: content.HOME_HERO_1_TITLE,
        subtitle: content.HOME_HERO_1_SUBTITLE,
        href: "/hakkimizda",
        button: content.HOME_HERO_1_BUTTON,
      },
      {
        image: "/slider-hands.png",
        title: content.HOME_HERO_2_TITLE,
        subtitle: content.HOME_HERO_2_SUBTITLE,
        href: "/kitaplar",
        button: content.HOME_HERO_2_BUTTON,
      },
      {
        image: "/slider-wisdom.png",
        title: content.HOME_HERO_3_TITLE,
        subtitle: content.HOME_HERO_3_SUBTITLE,
        href: "/yazarlar",
        button: content.HOME_HERO_3_BUTTON,
      },
    ],
    [content]
  );

  const featuredBooks = useMemo(() => books.slice(0, 6), [books]);

  useEffect(() => {
    const t = window.setInterval(
      () => setCurrent((v) => (v + 1) % slides.length),
      6000
    );
    return () => window.clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    if (featuredBooks.length === 0) return;
    const t = window.setInterval(
      () => setBookSlide((v) => (v + 1) % featuredBooks.length),
      5000
    );
    return () => window.clearInterval(t);
  }, [featuredBooks.length]);

  return (
    <main className="page">
      {/* Hero Slider */}
      <section className="hero">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={`hero-slide ${i === current ? "active" : ""}`}
          >
            <img src={slide.image} alt={slide.title} />
            <div className="hero-content">
              <div className="hero-orb">
                <div>
                  <span className="eyebrow hero-label">
                    {content.HOME_BRAND_LABEL}
                  </span>
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                  <Link className="btn" href={slide.href}>
                    {slide.button} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          className="hero-arrow left"
          onClick={() =>
            setCurrent((current + slides.length - 1) % slides.length)
          }
          aria-label="Önceki"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="hero-arrow right"
          onClick={() => setCurrent((current + 1) % slides.length)}
          aria-label="Sonraki"
        >
          <ChevronRight size={24} />
        </button>

        <div className="hero-strip">
          <div className="container hero-strip-inner">
            <div className="hero-strip-left">
              <div className="hero-quote-icon">
                <QuoteIcon size={20} />
              </div>
              <p
                className="hero-quote"
                dangerouslySetInnerHTML={{
                  __html: content.HOME_QUOTE_TEXT,
                }}
              />
            </div>
            <div className="hero-strip-right">
              <div className="hero-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`hero-dot ${i === current ? "active" : ""}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <Link href="/hakkimizda" className="hero-story-btn">
                Hikayemiz <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Slider */}
      <section className="section books-section">
        <div className="wide-container">
          <div className="section-head books-head">
            <div>
              <span className="eyebrow">
                {content.HOME_FEATURED_SUBTITLE}
              </span>
              <h2>{content.HOME_FEATURED_TITLE}</h2>
            </div>
            <div className="books-controls">
              <div className="book-dots">
                {featuredBooks.map((_, i) => (
                  <button
                    key={i}
                    className={`book-dot ${i === bookSlide ? "active" : ""}`}
                    onClick={() => setBookSlide(i)}
                    aria-label={`Kitap ${i + 1}`}
                  />
                ))}
              </div>
              <Link href="/kitaplar" className="btn-text desktop-only">
                {content.HOME_FEATURED_VIEW_ALL} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="book-slider">
            <button
              className="book-slider-arrow left"
              onClick={() =>
                setBookSlide(
                  bookSlide === 0 ? featuredBooks.length - 1 : bookSlide - 1
                )
              }
              aria-label="Önceki kitap"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="book-slider-arrow right"
              onClick={() =>
                setBookSlide(
                  bookSlide === featuredBooks.length - 1 ? 0 : bookSlide + 1
                )
              }
              aria-label="Sonraki kitap"
            >
              <ChevronRight size={20} />
            </button>
            <div className="book-slider-viewport">
              <div
                className="book-slider-track"
                style={{ transform: `translateX(-${bookSlide * 100}%)` }}
              >
                {featuredBooks.map((book) => (
                  <div key={book.id} className="book-slider-item">
                    <div className="book-slider-grid">
                      <Link
                        href={`/kitap/${book.id}`}
                        className="book-slider-cover-link"
                      >
                        <div className="book-slider-cover">
                          <img
                            src={book.cover ?? "/logo.jpg"}
                            alt={book.title}
                          />
                        </div>
                      </Link>
                      <div className="book-slider-info">
                        <span className="eyebrow">{book.genre}</span>
                        <h3 className="book-slider-title serif">
                          {book.title}
                        </h3>
                        <p className="book-slider-author">
                          {book.author?.name}
                        </p>
                        <p className="book-slider-summary">{book.summary}</p>
                        <Link href={`/kitap/${book.id}`} className="btn">
                          Detayları Gör <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mobile-only book-view-all">
            <Link href="/kitaplar" className="btn-text-underline">
              Tüm Eserleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Book Sets Section */}
      {sets.length > 0 && (
        <section className="section sets-section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Özel Koleksiyonlar</span>
                <h2>Kitap Setleri</h2>
              </div>
              <Link href="/setler" className="btn-text desktop-only">
                Tüm Setleri Gör <ArrowRight size={14} />
              </Link>
            </div>
            <SetsShowcase sets={sets} />
            <div className="mobile-only book-view-all" style={{ marginTop: 24 }}>
              <Link href="/setler" className="btn-text-underline">
                Tüm Setleri Gör
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="section philosophy">
        <div className="container philosophy-grid">
          {[
            {
              Icon: BookOpen,
              title: content.HOME_PHILOSOPHY_1_TITLE,
              desc: content.HOME_PHILOSOPHY_1_DESC,
              href: "/kitaplar?q=siyaset",
            },
            {
              Icon: ScrollText,
              title: content.HOME_PHILOSOPHY_2_TITLE,
              desc: content.HOME_PHILOSOPHY_2_DESC,
              href: "/kitaplar?q=tasavvuf",
            },
            {
              Icon: Compass,
              title: content.HOME_PHILOSOPHY_3_TITLE,
              desc: content.HOME_PHILOSOPHY_3_DESC,
              href: "/kitaplar?q=hikmet",
            },
          ].map(({ Icon, title, desc, href }) => (
            <Link href={href} key={title} className="philosophy-card">
              <div className="philosophy-icon">
                <Icon size={22} color="#fff" />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
