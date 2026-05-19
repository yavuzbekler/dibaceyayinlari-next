create extension if not exists "pgcrypto";

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists authors (
  id text primary key,
  name text not null,
  photo text,
  short_bio text,
  full_bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists books (
  id text primary key,
  title text not null,
  author_id text not null references authors(id) on delete restrict,
  cover text,
  summary text,
  isbn text,
  published_date text,
  genre text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sales_links (
  id uuid primary key default gen_random_uuid(),
  book_id text not null references books(id) on delete cascade,
  name text not null,
  url text not null,
  price numeric(10,2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists site_contents (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists authors_updated_at on authors;
create trigger authors_updated_at before update on authors for each row execute function handle_updated_at();
drop trigger if exists books_updated_at on books;
create trigger books_updated_at before update on books for each row execute function handle_updated_at();
drop trigger if exists site_contents_updated_at on site_contents;
create trigger site_contents_updated_at before update on site_contents for each row execute function handle_updated_at();

alter table admins enable row level security;
alter table authors enable row level security;
alter table books enable row level security;
alter table sales_links enable row level security;
alter table site_contents enable row level security;

drop policy if exists "Public read authors" on authors;
create policy "Public read authors" on authors for select using (true);
drop policy if exists "Public read books" on books;
create policy "Public read books" on books for select using (true);
drop policy if exists "Public read sales links" on sales_links;
create policy "Public read sales links" on sales_links for select using (true);
drop policy if exists "Public read site contents" on site_contents;
create policy "Public read site contents" on site_contents for select using (true);

create table if not exists book_sets (
  id text primary key,
  name text not null,
  description text,
  cover text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists book_set_items (
  id uuid primary key default gen_random_uuid(),
  set_id text not null references book_sets(id) on delete cascade,
  book_id text not null references books(id) on delete cascade,
  sort_order integer not null default 0,
  unique(set_id, book_id)
);

create table if not exists set_sales_links (
  id uuid primary key default gen_random_uuid(),
  set_id text not null references book_sets(id) on delete cascade,
  name text not null,
  url text not null default '',
  price numeric(10,2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

drop trigger if exists book_sets_updated_at on book_sets;
create trigger book_sets_updated_at before update on book_sets for each row execute function handle_updated_at();

alter table book_sets enable row level security;
alter table book_set_items enable row level security;
alter table set_sales_links enable row level security;

drop policy if exists "Public read book_sets" on book_sets;
create policy "Public read book_sets" on book_sets for select using (true);
drop policy if exists "Public read book_set_items" on book_set_items;
create policy "Public read book_set_items" on book_set_items for select using (true);
drop policy if exists "Public read set_sales_links" on set_sales_links;
create policy "Public read set_sales_links" on set_sales_links for select using (true);

create index if not exists books_author_id_idx on books(author_id);
create index if not exists sales_links_book_id_idx on sales_links(book_id, sort_order);
create index if not exists book_set_items_set_id_idx on book_set_items(set_id, sort_order);
create index if not exists set_sales_links_set_id_idx on set_sales_links(set_id, sort_order);
