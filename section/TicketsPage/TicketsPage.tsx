'use client';

import { useState } from 'react';
import { IoReceiptOutline } from 'react-icons/io5';
import type { Booking, Showtime, Movie, Theater, Screen, BookingSeat, Seat } from '@/types';
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
  if (!durationString) return 150; // Default to 2.5 hours if missing

  // Postgres intervals usually come back like "02:30:00"
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
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [category, setCategory] = useState<TicketCategory>('Film');

  const now = new Date();

  // ONLY filter here in the parent component
  const activeBookings = initialBookings.filter((b) => {
    if (b.booking_status !== 'paid') return false;
    if (!b.showtimes?.show_time) return false;
    
    // Parse the showtime as a proper Date object
    const showTime = new Date(b.showtimes.show_time);
    
    // Safety check: if the date is invalid, don't show it as active
    if (isNaN(showTime.getTime())) return false;

    const durationMins = parseDurationToMinutes(b.showtimes.movies?.duration as unknown as string); 
    
    // Add duration to the start time to get the exact end time
    const endTime = new Date(showTime.getTime() + (durationMins * 60 * 1000));
    
    // For debugging: If you still don't see it, uncomment the line below to check your browser console
    // console.log(`Movie: ${b.showtimes.movies.name} | Ends: ${endTime.toLocaleString()} | Now: ${now.toLocaleString()} | Is Active: ${now < endTime}`);

    // If 'now' is less than the end time, the movie hasn't finished yet. It is active.
    return now < endTime; 
  });

  const historyBookings = initialBookings;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">

      <div className="w-full md:w-[320px] shrink-0 bg-[#F5F6F8] border-b md:border-b-0 md:border-r border-shade-200">
        
        <div className="flex flex-row md:flex-col md:sticky md:top-[80px] md:py-4 z-10">
          
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center justify-center md:justify-start gap-2 sm:gap-4 flex-1 md:w-full px-2 sm:px-6 md:px-8 py-4 transition-colors
              ${activeTab === 'active'
                ? 'bg-white text-sky-blue shadow-sm'
                : 'text-shade-600 hover:bg-white/50'}`}
          >
            <LuTicket className="text-[18px] sm:text-xl shrink-0" />
            <div className="truncate">
              <Typography variant='h4' color='shade-900'>Active Ticket</Typography>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center md:justify-start gap-2 sm:gap-4 flex-1 md:w-full px-2 sm:px-6 md:px-8 py-4 transition-colors
              ${activeTab === 'history'
                ? 'bg-white text-sky-blue shadow-sm'
                : 'text-shade-600 hover:bg-white/50'}`}
          >
            <IoReceiptOutline className="text-[18px] sm:text-xl shrink-0" />
            <div className="truncate">
              <Typography variant='h4' color='shade-900'>TRANSACTION HISTORY</Typography>
            </div>
          </button>

        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 lg:px-20 bg-white min-w-0">
        <Typography variant='h3' color='shade-900' className="mb-2">My Tickets</Typography>
        <Typography color='shade-600' className="mb-8">
          List of tickets and transactions you have made
        </Typography>

        {activeTab === 'active' ? (
          <ActiveTickets bookings={activeBookings} category={category} />
        ) : (
          <TransactionHistory bookings={historyBookings} category={category} />
        )}
      </div>

    </div>
  );
}