-- brands
create policy "Only super_admin can manage brands"
  on public.brands for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- cities
create policy "Only super_admin can manage cities"
  on public.cities for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- movies
create policy "Only super_admin can manage movies"
  on public.movies for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- theater
create policy "Theater admin can manage own theater"
  on public.theater for all
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- screen
create policy "Theater admin can manage own screens"
  on public.screen for all
  using (
    exists (
      select 1 from public.theater t
      where t.id = theater_id and t.user_id = auth.uid()
    )
    or exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- seats
create policy "Theater admin can manage own seats"
  on public.seats for all
  using (
    exists (
      select 1 from public.screen sc
      join public.theater t on t.id = sc.theater_id
      where sc.id = screen_id and t.user_id = auth.uid()
    )
    or exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- showtimes
create policy "Theater admin can manage own showtimes"
  on public.showtimes for all
  using (
    exists (
      select 1 from public.theater t
      where t.id = theater_id and t.user_id = auth.uid()
    )
    or exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- seat_locked
create policy "Super admin can view all locked seats"
  on public.seat_locked for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- discount
create policy "Only super_admin can manage discounts"
  on public.discount for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- bookings
create policy "Super admin can view all bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );

-- booking_seats
create policy "Super admin can view all booking seats"
  on public.booking_seats for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid() and p.role = 'super_admin'
    )
  );