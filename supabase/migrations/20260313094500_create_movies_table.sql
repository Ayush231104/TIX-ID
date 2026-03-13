create table if not exists public.movies (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  movie_img      text,
  director       text,
  duration       timetz,
  age_rating     public.age_rating_enum,
  audience_score float8,
  genre          public.genre_enum,
  movies_status  public.movie_status_enum default 'upcoming',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.movies enable row level security;

create policy "Movies are viewable by everyone"
  on public.movies for select using (true);

create trigger movies_updated_at
  before update on public.movies
  for each row execute procedure public.handle_updated_at();