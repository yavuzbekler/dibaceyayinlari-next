export type Author = {
  id: string;
  name: string;
  photo: string | null;
  short_bio: string | null;
  full_bio: string | null;
};

export type SalesLink = {
  id?: string;
  book_id?: string;
  name: string;
  url: string;
  price: number;
  sort_order?: number;
};

export type Book = {
  id: string;
  title: string;
  author_id: string;
  cover: string | null;
  summary: string | null;
  isbn: string | null;
  published_date: string | null;
  genre: string | null;
  author?: Author | null;
  sales_links?: SalesLink[];
};

export type SiteContent = {
  id?: string;
  key: string;
  value: string;
  description: string;
};
