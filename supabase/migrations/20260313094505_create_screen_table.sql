create table if not exists public.screen (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  theater_id  uuid references public.theater(id) on delete cascade,
  type        text,
  seat_col    int4,
  seat_row    int4,
  total_seats int4,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.screen enable row level security;

create policy "Screens are viewable by everyone"
  on public.screen for select using (true);

create trigger screen_updated_at
  before update on public.screen
  for each row execute procedure public.handle_updated_at();