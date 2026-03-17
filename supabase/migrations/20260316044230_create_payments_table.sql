create table if not exists public.payments (
  id                       uuid primary key default gen_random_uuid(),
  booking_id               uuid references public.bookings(id) on delete cascade,
  user_id                  uuid references auth.users(id) on delete cascade,
  amount                   float8,
  currency                 text default 'INR',
  payment_method           public.payment_method_enum,
  payment_status           public.payment_status_enum default 'pending',
  gateway_response         jsonb,
  stripe_payment_intent_id text,
  stripe_customer_id       text,
  stripe_charge_id         text,
  refund_id                text,
  refund_status            public.refund_status_enum,
  refunded_at              timestamptz,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

alter table public.payments enable row level security;

create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own payments"
  on public.payments for update
  using (auth.uid() = user_id);

create trigger payments_updated_at
  before update on public.payments
  for each row execute procedure public.handle_updated_at();