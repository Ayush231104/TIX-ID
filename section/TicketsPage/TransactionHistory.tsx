'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GoLocation } from 'react-icons/go';
import type { EnrichedBooking, TicketCategory } from './TicketsPage'; 
import Typography from '@/components/ui/Typography';

interface TransactionHistoryProps {
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

export default function TransactionHistory({ bookings, category }: TransactionHistoryProps) {
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
          <div key={booking.id} className="border-b border-shade-200 pb-6">
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
                <Typography variant='h3' color='shade-900' className="sm:mb-2">{showtime.movies.name}</Typography>
                <Typography color='shade-700' className="mb-3 sm:mb-6">
                  {formatFullDate(showtime.show_time)}, {formatTime(showtime.show_time)}
                </Typography>
                <div className="flex items-center gap-2 text-shade-500 text-sm">
                  <GoLocation className="text-lg text-shade-600" />
                  <Typography color='shade-600'>{showtime.theater.name}</Typography>
                  <span className="font-semibold text-shade-900 ml-1">({showtime.screen.type})</span>
                </div>
              </div>

              <div className="flex items-center justify-start sm:justify-end mt-4 sm:mt-0">
                {isSuccess ? (
                  <Link 
                    href={`/tickets/${booking.id}`}
                    className="px-8 py-2.5 rounded-lg text-white font-medium transition-opacity bg-[#008CF5] hover:opacity-90 flex items-center justify-center"
                  >
                    Success
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="px-8 py-2.5 rounded-lg text-white font-medium transition-opacity bg-[#FF5A5F] cursor-not-allowed"
                  >
                    {booking.booking_status === 'cancelled' ? 'Cancelled' : 'Failed'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}