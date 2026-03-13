create table if not exists public.booking_seats (
  id                  uuid primary key default gen_random_uuid(),
  showtime_id         uuid references public.showtimes(id) on delete cascade,
  booking_id          uuid references public.bookings(id) on delete cascade,
  seat_id             uuid references public.seats(id) on delete cascade,
  booking_seat_status public.booking_seat_status_enum default 'reserved',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  unique (showtime_id, seat_id)
);

alter table public.booking_seats enable row level security;

create policy "Users can view own booking seats"
  on public.booking_seats for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.user_id = auth.uid()
    )
  );

create policy "Users can insert own booking seats"
  on public.booking_seats for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.user_id = auth.uid()
    )
  );

create trigger booking_seats_updated_at
  before update on public.booking_seats
  for each row execute procedure public.handle_updated_at();