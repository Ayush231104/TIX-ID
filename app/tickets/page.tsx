// app/tickets/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserBookings } from '@/actions/bookingActions';
import TicketsPage from '@/section/TicketsPage/TicketsPage';

export default async function MyTicketsRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's bookings using your existing action
  const res = await getUserBookings(user.id);
  const bookings = res.success && res.data ? res.data : [];

  return (
    <main className="min-h-screen bg-white">
      <TicketsPage initialBookings={bookings} />
    </main>
  );
}