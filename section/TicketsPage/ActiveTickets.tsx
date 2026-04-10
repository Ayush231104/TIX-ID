'use client';

import Image from 'next/image';
import Link from 'next/link'; 
import { GoLocation } from 'react-icons/go';
import type { EnrichedBooking, TicketCategory } from './TicketsPage';

interface ActiveTicketsProps {
  // We expect this array to ALREADY be filtered by the parent
  bookings: EnrichedBooking[]; 
  category: TicketCategory;
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

export default function ActiveTickets({ bookings, category }: ActiveTicketsProps) {
  if (category !== 'Film') {
    return <div className="text-center text-shade-500 py-20">No active {category} tickets found.</div>;
  }

  // If the parent component gave us an empty array, it means no active tickets exist
  if (bookings.length === 0) {
    return <div className="text-center text-shade-500 py-20">No active tickets found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {bookings.map((booking) => {
        const showtime = booking.showtimes;
        
        return (
          <Link 
            key={booking.id} 
            href={`/tickets/${booking.id}`}
            className="block border-b border-shade-200 pb-6 cursor-pointer hover:bg-shade-50 transition-colors rounded-lg p-2 -mx-2"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
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
            </div>
          </Link>
        );
      })}
    </div>
  );
}