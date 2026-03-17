create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text,
  subtitle     text,
  img          text,
  release_date date,
  category     text,
  tag          text,
  content      text,
  likes        integer default 0,
  constraint news_likes_check check (likes >= 0)
);