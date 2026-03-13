create table if not exists public.cities (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  state     text,
  latitude  float8,
  longitude float8
);

alter table public.cities enable row level security;

create policy "Cities are viewable by everyone"
  on public.cities for select using (true);