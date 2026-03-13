create table if not exists public.theater (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  brand_id   uuid references public.brands(id) on delete set null,
  city_id    uuid references public.cities(id) on delete set null,
  user_id    uuid references auth.users(id) on delete set null,
  address    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.theater enable row level security;

create policy "Theaters are viewable by everyone"
  on public.theater for select using (true);

create trigger theater_updated_at
  before update on public.theater
  for each row execute procedure public.handle_updated_at();