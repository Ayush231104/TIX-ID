create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  showtime_id    uuid references public.showtimes(id) on delete cascade,
  discount_id    uuid references public.discount(id) on delete set null,
  user_id        uuid references auth.users(id) on delete cascade,
  total_amount   float8,
  total_seats    int4,
  booking_status public.booking_status_enum default 'pending',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.handle_updated_at();