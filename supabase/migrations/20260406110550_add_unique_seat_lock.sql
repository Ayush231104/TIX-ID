BEGIN;

-- 1. Drop the overly permissive public policy
DROP POLICY IF EXISTS "Users can delete own locked seats" ON public.seat_locked;

-- 2. Create the secure policy targeting ONLY authenticated users
CREATE POLICY "Users can delete own locked seats"
ON public.seat_locked
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Add the Unique Constraint to prevent race conditions
-- (This ensures the DB rejects double-bookings if users click at the exact same millisecond)
ALTER TABLE public.seat_locked 
DROP CONSTRAINT IF EXISTS unique_seat_per_showtime;

ALTER TABLE public.seat_locked 
ADD CONSTRAINT unique_seat_per_showtime UNIQUE (showtime_id, seat_id);

COMMIT;