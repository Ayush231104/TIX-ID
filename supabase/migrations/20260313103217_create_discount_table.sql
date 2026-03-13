create table if not exists public.discount (
  id                uuid primary key default gen_random_uuid(),
  code              text not null unique,
  valid_until       timestamptz,
  is_active         bool default true,
  discounted_amount int4,
  min_amount        int4,
  usage_limit       int4,
  usage_count       int4 default 0,
  discount_type     public.discount_type_enum,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table public.discount enable row level security;

create policy "Active discounts are viewable by everyone"
  on public.discount for select
  using (is_active = true);

create trigger discount_updated_at
  before update on public.discount
  for each row execute procedure public.handle_updated_at();