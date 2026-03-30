'use client';

import Image from 'next/image';
import { GoLocation } from 'react-icons/go';
import type { EnrichedBooking, TicketCategory } from './TicketsPage';

interface ActiveTicketsProps {
  bookings: EnrichedBooking[];
  category: TicketCategory;
  onSelectTicket: (ticket: EnrichedBooking) => void;
}

const formatFullDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

const parseDurationToMinutes = (durationString?: string | null): number => {
  if (!durationString) return 150; // Fallback to 150 minutes

  const timeOnly = durationString.split('+')[0].split('-')[0]; 
  const parts = timeOnly.split(':');

  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return (hours * 60) + minutes;
  }
  
  return 150;
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

export default function ActiveTickets({ bookings, category, onSelectTicket }: ActiveTicketsProps) {
  if (category !== 'Film') {
    return <div className="text-center text-shade-500 py-20">No active {category} tickets found.</div>;
  }

  const now = new Date();
  const activeBookings = bookings.filter((booking) => {
      const showtime = booking.showtimes;
      if (!showtime?.show_time) return false;

      const startTime = new Date(showtime.show_time);
      // 🚀 USE PARSER HERE
      const durationInMinutes = parseDurationToMinutes(showtime.movies.duration as unknown as string);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

      return now < endTime; 
  });

  if (activeBookings.length === 0) {
    return <div className="text-center text-shade-500 py-20">No active tickets found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {activeBookings.map((booking) => {
        const showtime = booking.showtimes;
        
        return (
          <div 
            key={booking.id} 
            onClick={() => onSelectTicket(booking)}
            className="border-b border-shade-200 pb-6 cursor-pointer hover:bg-shade-50 transition-colors rounded-lg p-2 -mx-2"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-44 shrink-0 relative rounded-lg overflow-hidden bg-shade-100">
                <Image 
                  src={showtime.movies.movie_img || '/placeholder-movie.png'} 
                  alt={showtime.movies.name}
                  fill
                  className="object-cover"
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
          </div>
        );
      })}
    </div>
  );
}