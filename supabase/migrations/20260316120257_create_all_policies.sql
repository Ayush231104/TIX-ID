-- ─────────────────────────────────────────
-- HELPER FUNCTION (fixes infinite recursion)
-- ─────────────────────────────────────────
create or replace function public.get_current_user_role()
returns text as $$
  select role::text
  from public.profile
  where user_id = auth.uid();
$$ language sql security definer stable;

-- ─────────────────────────────────────────
-- PROFILE
-- ─────────────────────────────────────────
drop policy if exists "Super admin can view all profiles" on public.profile;
drop policy if exists "Users can view own profile" on public.profile;
drop policy if exists "Users can insert own profile" on public.profile;
drop policy if exists "Users can update own profile" on public.profile;

create policy "Users can view own profile"
  on public.profile for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profile for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profile for update to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- PUBLIC READ (everyone can see)
-- ─────────────────────────────────────────
drop policy if exists "Movies are viewable by everyone" on public.movies;
create policy "Movies are viewable by everyone"
  on public.movies for select to public using (true);

drop policy if exists "News are viewable by everyone" on public.news;
create policy "News are viewable by everyone"
  on public.news for select to public using (true);

drop policy if exists "Theaters are viewable by everyone" on public.theater;
create policy "Theaters are viewable by everyone"
  on public.theater for select to public using (true);

drop policy if exists "Screens are viewable by everyone" on public.screen;
create policy "Screens are viewable by everyone"
  on public.screen for select to public using (true);

drop policy if exists "Seats are viewable by everyone" on public.seats;
create policy "Seats are viewable by everyone"
  on public.seats for select to public using (true);

drop policy if exists "Showtimes are viewable by everyone" on public.showtimes;
create policy "Showtimes are viewable by everyone"
  on public.showtimes for select to public using (true);

drop policy if exists "Cities are viewable by everyone" on public.cities;
create policy "Cities are viewable by everyone"
  on public.cities for select to public using (true);

drop policy if exists "Brands are viewable by everyone" on public.brands;
create policy "Brands are viewable by everyone"
  on public.brands for select to public using (true);

drop policy if exists "Active discounts are viewable by everyone" on public.discount;
create policy "Active discounts are viewable by everyone"
  on public.discount for select to public using (is_active = true);

-- ─────────────────────────────────────────
-- SUPER ADMIN MANAGE (insert/update/delete)
-- ─────────────────────────────────────────
drop policy if exists "Super admin can manage movies" on public.movies;
create policy "Super admin can manage movies"
  on public.movies for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage news" on public.news;
create policy "Super admin can manage news"
  on public.news for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage theaters" on public.theater;
create policy "Super admin can manage theaters"
  on public.theater for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage screens" on public.screen;
create policy "Super admin can manage screens"
  on public.screen for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage seats" on public.seats;
create policy "Super admin can manage seats"
  on public.seats for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage showtimes" on public.showtimes;
create policy "Super admin can manage showtimes"
  on public.showtimes for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage cities" on public.cities;
create policy "Super admin can manage cities"
  on public.cities for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage brands" on public.brands;
create policy "Super admin can manage brands"
  on public.brands for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

drop policy if exists "Super admin can manage discounts" on public.discount;
create policy "Super admin can manage discounts"
  on public.discount for all to authenticated
  using (public.get_current_user_role() = 'super_admin')
  with check (public.get_current_user_role() = 'super_admin');

-- ─────────────────────────────────────────
-- BOOKINGS (logged in users only)
-- ─────────────────────────────────────────
drop policy if exists "Users can view own bookings" on public.bookings;
create policy "Users can view own bookings"
  on public.bookings for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own bookings" on public.bookings;
create policy "Users can insert own bookings"
  on public.bookings for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own bookings" on public.bookings;
create policy "Users can update own bookings"
  on public.bookings for update to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- BOOKING SEATS (logged in users only)
-- ─────────────────────────────────────────
drop policy if exists "Users can view own booking seats" on public.booking_seats;
create policy "Users can view own booking seats"
  on public.booking_seats for select to authenticated
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own booking seats" on public.booking_seats;
create policy "Users can insert own booking seats"
  on public.booking_seats for insert to authenticated
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- SEAT LOCKED (logged in users only)
-- ─────────────────────────────────────────
drop policy if exists "Users can view own locked seats" on public.seat_locked;
create policy "Users can view own locked seats"
  on public.seat_locked for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own locked seats" on public.seat_locked;
create policy "Users can insert own locked seats"
  on public.seat_locked for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own locked seats" on public.seat_locked;
create policy "Users can update own locked seats"
  on public.seat_locked for update to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- PAYMENTS (logged in users only)
-- ─────────────────────────────────────────
drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments"
  on public.payments for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own payments" on public.payments;
create policy "Users can insert own payments"
  on public.payments for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own payments" on public.payments;
create policy "Users can update own payments"
  on public.payments for update to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- STORAGE WRITE POLICIES
-- ─────────────────────────────────────────
drop policy if exists "Only super_admin can upload movie images" on storage.objects;
create policy "Only super_admin can upload movie images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'movies_imgs' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can update movie images" on storage.objects;
create policy "Only super_admin can update movie images"
  on storage.objects for update to authenticated
  using (bucket_id = 'movies_imgs' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can delete movie images" on storage.objects;
create policy "Only super_admin can delete movie images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'movies_imgs' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can upload news images" on storage.objects;
create policy "Only super_admin can upload news images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'news_Image' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can update news images" on storage.objects;
create policy "Only super_admin can update news images"
  on storage.objects for update to authenticated
  using (bucket_id = 'news_Image' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can delete news images" on storage.objects;
create policy "Only super_admin can delete news images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'news_Image' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can upload brand logos" on storage.objects;
create policy "Only super_admin can upload brand logos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brands_logos' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can update brand logos" on storage.objects;
create policy "Only super_admin can update brand logos"
  on storage.objects for update to authenticated
  using (bucket_id = 'brands_logos' and public.get_current_user_role() = 'super_admin');

drop policy if exists "Only super_admin can delete brand logos" on storage.objects;
create policy "Only super_admin can delete brand logos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'brands_logos' and public.get_current_user_role() = 'super_admin');