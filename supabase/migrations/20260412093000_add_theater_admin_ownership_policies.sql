-- Theater admin can manage only their own theater rows

drop policy if exists "Theater admin can manage own theaters" on public.theater;
create policy "Theater admin can manage own theaters"
  on public.theater for all to authenticated
  using (
    public.get_current_user_role() = 'theater_admin'
    and user_id = auth.uid()
  )
  with check (
    public.get_current_user_role() = 'theater_admin'
    and user_id = auth.uid()
  );

-- Theater admin can manage screens only under their own theaters

drop policy if exists "Theater admin can manage own theater screens" on public.screen;
create policy "Theater admin can manage own theater screens"
  on public.screen for all to authenticated
  using (
    public.get_current_user_role() = 'theater_admin'
    and exists (
      select 1
      from public.theater t
      where t.id = theater_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    public.get_current_user_role() = 'theater_admin'
    and exists (
      select 1
      from public.theater t
      where t.id = theater_id
        and t.user_id = auth.uid()
    )
  );

-- Theater admin can manage showtimes only under their own theaters

drop policy if exists "Theater admin can manage own theater showtimes" on public.showtimes;
create policy "Theater admin can manage own theater showtimes"
  on public.showtimes for all to authenticated
  using (
    public.get_current_user_role() = 'theater_admin'
    and exists (
      select 1
      from public.theater t
      where t.id = theater_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    public.get_current_user_role() = 'theater_admin'
    and exists (
      select 1
      from public.theater t
      where t.id = theater_id
        and t.user_id = auth.uid()
    )
  );
