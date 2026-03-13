create table if not exists public.showtimes (
  id         uuid primary key default gen_random_uuid(),
  theater_id uuid references public.theater(id) on delete cascade,
  movie_id   uuid references public.movies(id) on delete cascade,
  screen_id  uuid references public.screen(id) on delete cascade,
  show_time  timestamptz not null,
  price      float8,
  is_active  bool default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.showtimes enable row level security;

create policy "Showtimes are viewable by everyone"
  on public.showtimes for select using (true);

create trigger showtimes_updated_at
  before update on public.showtimes
  for each row execute procedure public.handle_updated_at();