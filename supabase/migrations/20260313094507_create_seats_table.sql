create table if not exists public.seats (
  id         uuid primary key default gen_random_uuid(),
  screen_id  uuid references public.screen(id) on delete cascade,
  seat_row   int4 not null,
  seat_col   int4 not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (screen_id, seat_row, seat_col)
);

alter table public.seats enable row level security;

create policy "Seats are viewable by everyone"
  on public.seats for select using (true);

create trigger seats_updated_at
  before update on public.seats
  for each row execute procedure public.handle_updated_at();