create table if not exists public.profile (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       public.role_enum default 'user',
  first_name text,
  last_name  text,
  email      text,
  mobile_no  text,
  age        int4,
  address    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profile enable row level security;

create policy "Users can view own profile"
  on public.profile for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profile for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profile for update
  using (auth.uid() = user_id);

create policy "Super admin can view all profiles"
  on public.profile for all
  using (
    exists (
      select 1 from public.profile p
      where p.user_id = auth.uid()
        and p.role = 'super_admin'
    )
  );

-- Trigger: updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profile_updated_at
  before update on public.profile
  for each row execute procedure public.handle_updated_at();

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profile (user_id, role, email)
  values (
    new.id,
    'user',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();