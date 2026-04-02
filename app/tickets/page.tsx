import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserBookings } from '@/actions/bookingActions';
import TicketsPage, { EnrichedBooking } from '@/section/TicketsPage/TicketsPage';

export default async function MyTicketsRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const res = await getUserBookings(user.id);
  
  const bookings = (res.success && res.data ? res.data : []) as unknown as EnrichedBooking[];

  return (
    <main className=" bg-white">
      <TicketsPage initialBookings={bookings} />
    </main>
  );
}