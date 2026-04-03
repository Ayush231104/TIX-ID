'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IoTicketOutline, IoReceiptOutline } from 'react-icons/io5';
import type { Booking, Showtime, Movie, Theater, Screen, BookingSeat, Seat } from '@/types';
import TransactionDetail from './TransactionDetail';
import ActiveTickets from './ActiveTickets';
import TransactionHistory from './TransactionHistory';
import { LuTicket } from 'react-icons/lu';
import Typography from '@/components/ui/Typography';

export type TicketCategory = 'Film' | 'Event' | 'Voucher';

export type EnrichedBooking = Booking & {
  showtimes: Showtime & {
    movies: Movie & { duration?: number };
    theater: Theater;
    screen: Screen;
  };
  booking_seats: (BookingSeat & {
    seats: Seat;
  })[];
};

interface TicketsPageProps {
  initialBookings: EnrichedBooking[];
}

const parseDurationToMinutes = (durationString?: string | null): number => {
  if (!durationString) return 150;

  const timeOnly = durationString.split('+')[0].split('-')[0]; 
  const parts = timeOnly.split(':');

  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return (hours * 60) + minutes;
  }
  
  return 150;
};

export default function TicketsPage({ initialBookings }: TicketsPageProps) {
  const searchParams = useSearchParams();
  const ticketIdFromUrl = searchParams.get('ticketId');

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedTicket, setSelectedTicket] = useState<EnrichedBooking | null>(() => {
    if (ticketIdFromUrl) {
      return initialBookings.find((b) => b.id === ticketIdFromUrl) || null;
    }
    return null;
  });
  const [category, setCategory] = useState<TicketCategory>('Film');



  const now = new Date();

  const activeBookings = initialBookings.filter((b) => {
    if (b.booking_status !== 'paid') return false;
    if (!b.showtimes?.show_time) return false;
    
    const showTime = new Date(b.showtimes.show_time);
    const durationMins = parseDurationToMinutes(b.showtimes.movies?.duration as unknown as string); 
    const endTime = new Date(showTime.getTime() + durationMins * 60000);
    
    return now < endTime; 
  });

  const historyBookings = initialBookings;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      
      {!selectedTicket && (
        <div className="w-full md:w-75 bg-[#F5F6F8] border-r border-shade-200 shrink-0">
          <div className="py-4 sm:pt-8">
            <button
              onClick={() => { setActiveTab('active'); setSelectedTicket(null); }}
              className={`flex items-center gap-4 w-full px-8 py-4 text-left font-medium transition-colors
                ${activeTab === 'active' 
                  ? 'bg-white text-sky-blue shadow-sm' 
                  : 'text-shade-600 hover:bg-white/50'}`}
            >
              <LuTicket className="text-xl shrink-0" />
              <Typography variant='h4' color='shade-900'>MY TICKETS</Typography>
            </button>
            
            <button
              onClick={() => { setActiveTab('history'); setSelectedTicket(null); }}
              className={`shrink-0 flex items-center gap-4 w-full px-8 py-4 text-left font-medium transition-colors
                ${activeTab === 'history' 
                  ? 'bg-white text-sky-blue shadow-sm' 
                  : 'text-shade-600 hover:bg-white/50'}`}
            >
              <IoReceiptOutline className="text-xl shrink-0" />
              <Typography variant='h4' color='shade-900' className='shrink-0'>TRANSACTION HISTORY</Typography>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 md:p-12 lg:px-20">
        
        {selectedTicket ? (
          <TransactionDetail
            ticket={selectedTicket} 
            onBack={() => setSelectedTicket(null)} 
          />
        ) : (
          <>
            <Typography variant='h3' color='shade-900' className="mb-2">My Tickets</Typography>
            <Typography color='shade-600' className="mb-8">List of tickets and transactions you have made</Typography>

            {/* <div className="flex gap-4 mb-10">
              {(['Film', 'Event', 'Voucher'] as TicketCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${
                    category === cat 
                      ? 'border-royal-blue text-royal-blue bg-blue-50' 
                      : 'border-shade-300 text-shade-600 hover:border-shade-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div> */}

            {activeTab === 'active' ? (
              <ActiveTickets 
                bookings={activeBookings} 
                category={category} 
                onSelectTicket={setSelectedTicket} 
              />
            ) : (
              <TransactionHistory 
                bookings={historyBookings} 
                category={category} 
                onSelectTicket={setSelectedTicket} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}