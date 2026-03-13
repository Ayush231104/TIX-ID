create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.brands enable row level security;

create policy "Brands are viewable by everyone"
  on public.brands for select using (true);

create trigger brands_updated_at
  before update on public.brands
  for each row execute procedure public.handle_updated_at();