'use client';

import Image from 'next/image';
import { GoLocation } from 'react-icons/go';
import type { EnrichedBooking, TicketCategory } from './TicketsPage'; 

interface TransactionHistoryProps {
  bookings: EnrichedBooking[];
  category: TicketCategory;
  onSelectTicket: (ticket: EnrichedBooking) => void;
}

const formatFullDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

export default function TransactionHistory({ bookings, category, onSelectTicket }: TransactionHistoryProps) {
  if (category !== 'Film') {
    return <div className="text-center text-shade-500 py-20">No {category} history found.</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center text-shade-500 py-20">No transaction history found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {bookings.map((booking) => {
        const showtime = booking.showtimes;
        const isSuccess = booking.booking_status === 'paid';
        
        return (
          // 🚀 FIX: Removed opacity-85 here
          <div key={booking.id} className="border-b border-shade-200 pb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-44 shrink-0 relative rounded-lg overflow-hidden bg-shade-100">
                <Image 
                  src={showtime.movies.movie_img || '/placeholder-movie.png'} 
                  alt={showtime.movies.name}
                  fill
                  className="object-cover" 
                  loading="lazy"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-shade-900 mb-2">{showtime.movies.name}</h2>
                <p className="text-shade-600 text-sm mb-4">
                  {formatFullDate(showtime.show_time)}, {formatTime(showtime.show_time)}
                </p>
                <div className="flex items-center gap-2 text-shade-500 text-sm">
                  <GoLocation className="text-lg" />
                  <span>{showtime.theater.name}</span>
                  <span className="font-semibold text-shade-900 ml-1">({showtime.screen.type})</span>
                </div>
              </div>

              {/* 🚀 FIX: Kept the buttons exactly as requested */}
              <div className="flex items-center justify-start sm:justify-end mt-4 sm:mt-0">
                <button 
                  onClick={() => onSelectTicket(booking)}
                  className={`px-8 py-2.5 rounded-lg text-white font-medium transition-opacity hover:opacity-90 
                    ${isSuccess ? 'bg-[#008CF5]' : 'bg-[#FF5A5F]'}`}
                >
                  {isSuccess ? 'Success' : booking.booking_status === 'cancelled' ? 'Cancelled' : 'Failed'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}