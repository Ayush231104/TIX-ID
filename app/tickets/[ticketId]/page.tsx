import { EnrichedBooking } from '@/section/TicketsPage/TicketsPage';
import TransactionDetail from '@/section/TicketsPage/TransactionDetail';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

type TransactionTicket = EnrichedBooking & {
  discount?: {
    code?: string;
  };
};

export default async function SingleTicketPage({
  params
}: {
  params: Promise<{ ticketId: string }> 
}) {
  const { ticketId } = await params;

  const supabase = await createClient();

  const { data: ticket, error } = await supabase
    .from('bookings')
    .select(`
      *,
      showtimes (
        *,
        movies ( name, movie_img ),
        theater ( name, address ),
        screen ( name, type )
      ),
      booking_seats ( *, seats ( seat_row, seat_col ) ),
      discount ( code )
    `)
    .eq('id', ticketId)
    .single();

  if (error || !ticket) {
    console.error("Ticket fetch error:", error); 
    notFound(); 
  }

  return (
    <main className="bg-white min-h-screen pt-10">
      <TransactionDetail ticket={ticket as unknown as TransactionTicket} />
    </main>
  );
}