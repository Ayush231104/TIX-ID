drop policy if exists "Users can view own locked seats" on public.seat_locked;

create policy "Anyone can view locked seats"
  on public.seat_locked for select
  using (true);

drop policy if exists "Users can view own booking seats" on public.booking_seats;

create policy "Anyone can view booking seats"
  on public.booking_seats for select
  using (true);