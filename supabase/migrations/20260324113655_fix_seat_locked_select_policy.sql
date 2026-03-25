-- ─────────────────────────────────────────
-- 1. Fix SELECT policy — everyone can see locked seats
--    (needed for other users to see holds + realtime to work)
-- ─────────────────────────────────────────
drop policy if exists "Users can view own locked seats" on public.seat_locked;

create policy "Locked seats viewable by everyone"
  on public.seat_locked for select
  using (true);

-- ─────────────────────────────────────────
-- 2. Add missing DELETE policy
--    (without this releaseSeats silently fails)
-- ─────────────────────────────────────────
create policy "Users can delete own locked seats"
  on public.seat_locked for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 3. Unique constraint — prevents race condition
--    where two users lock the same seat simultaneously
-- ─────────────────────────────────────────
-- Note: Using IF NOT EXISTS or dropping it first prevents errors if you run this twice
alter table public.seat_locked drop constraint if exists unique_showtime_seat;
alter table public.seat_locked add constraint unique_showtime_seat unique (showtime_id, seat_id);

-- ─────────────────────────────────────────
-- 4. Replica Identity — Fixes the "Phantom Delete" bug in Realtime
-- ─────────────────────────────────────────
ALTER TABLE public.seat_locked REPLICA IDENTITY FULL;
ALTER TABLE public.booking_seats REPLICA IDENTITY FULL;