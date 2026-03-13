create table if not exists public.seat_locked (
  id                 uuid primary key default gen_random_uuid(),
  showtime_id        uuid references public.showtimes(id) on delete cascade,
  seat_id            uuid references public.seats(id) on delete cascade,
  user_id            uuid references auth.users(id) on delete cascade,
  locked_at          timestamptz default now(),
  expires_at         timestamptz not null,
  reservation_status public.reservation_status_enum default 'hold',
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table public.seat_locked enable row level security;

create policy "Users can view own locked seats"
  on public.seat_locked for select
  using (auth.uid() = user_id);

create policy "Users can insert own locked seats"
  on public.seat_locked for insert
  with check (auth.uid() = user_id);

create policy "Users can update own locked seats"
  on public.seat_locked for update
  using (auth.uid() = user_id);

create or replace function public.release_expired_locks()
returns void as $$
begin
  delete from public.seat_locked
  where expires_at < now()
    and reservation_status = 'hold';
end;
$$ language plpgsql;

create trigger seat_locked_updated_at
  before update on public.seat_locked
  for each row execute procedure public.handle_updated_at();