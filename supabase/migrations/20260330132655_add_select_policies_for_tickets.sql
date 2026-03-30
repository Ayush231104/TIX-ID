-- 1. Policy for Bookings: Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Policy for Booking Seats: Users can view seats linked to their bookings
CREATE POLICY "Users can view their own booking seats"
ON public.booking_seats
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.bookings 
    WHERE bookings.id = booking_seats.booking_id 
    AND bookings.user_id = auth.uid()
  )
);

-- 3. Policy for Payments: Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);