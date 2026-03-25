-- Enable realtime for seat_locked and booking_seats
alter publication supabase_realtime add table public.seat_locked;
alter publication supabase_realtime add table public.booking_seats;