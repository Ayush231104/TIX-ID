drop policy if exists "Authenticated users can update news likes counter" on public.news;

create policy "Authenticated users can update news likes counter"
  on public.news for update to authenticated
  using (true)
  with check (true);
