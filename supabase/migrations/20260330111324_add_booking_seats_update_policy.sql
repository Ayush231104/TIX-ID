-- 1. Policy for Payments: Users can update payments that belong to them
CREATE POLICY "Users can update their own payments"
ON public.payments
FOR UPDATE
USING (auth.uid() = user_id);

-- 2. Policy for Bookings: Users can update bookings that belong to them
CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id);

-- 3. Policy for Booking Seats: Users can update seats if they own the parent booking
CREATE POLICY "Users can update seats linked to their bookings"
ON public.booking_seats
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM public.bookings 
    WHERE bookings.id = booking_seats.booking_id 
    AND bookings.user_id = auth.uid()
  )
);