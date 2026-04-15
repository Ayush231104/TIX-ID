-- Backfill missing seat rows based on screen dimensions.
-- Mirrors the same generation pattern used in seed data.
insert into public.seats (id, screen_id, seat_row, seat_col)
select
  gen_random_uuid(),
  s.id,
  r.row_num,
  c.col_num
from public.screen s
cross join generate_series(1, s.seat_row) as r(row_num)
cross join generate_series(1, s.seat_col) as c(col_num)
where s.seat_row is not null
  and s.seat_col is not null
  and not exists (
    select 1
    from public.seats st
    where st.screen_id = s.id
      and st.seat_row = r.row_num
      and st.seat_col = c.col_num
  );

-- Theater admin can manage seats only for screens that belong to their own theaters.
drop policy if exists "Theater admin can manage own theater seats" on public.seats;
create policy "Theater admin can manage own theater seats"
  on public.seats for all to authenticated
  using (
    public.get_current_user_role() = 'theater_admin'
    and exists (
      select 1
      from public.screen s
      join public.theater t on t.id = s.theater_id
      where s.id = screen_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    public.get_current_user_role() = 'theater_admin'
    and exists (
      select 1
      from public.screen s
      join public.theater t on t.id = s.theater_id
      where s.id = screen_id
        and t.user_id = auth.uid()
    )
  );
