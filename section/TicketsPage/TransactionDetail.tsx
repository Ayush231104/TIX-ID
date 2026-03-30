// components/section/TransactionDetail.tsx
'use client';

import { GoArrowLeft, GoDownload } from 'react-icons/go';
import type { EnrichedBooking } from './TicketsPage'; 
import { useState } from 'react';

interface TransactionDetailProps {
  ticket: EnrichedBooking;
  onBack: () => void;
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

const getSeatLabel = (row: number, col: number): string => {
  return `${String.fromCharCode(64 + row)}${col}`;
};

export default function TransactionDetail({ ticket, onBack }: TransactionDetailProps) {
  const [passwordKey] = useState(() => Math.floor(100000 + Math.random() * 900000));
  
  const showtime = ticket.showtimes;
  const movie = showtime.movies;
  const theater = showtime.theater;
  const screen = showtime.screen;
  
  const seats = ticket.booking_seats
    .map((bs) => getSeatLabel(bs.seats.seat_row, bs.seats.seat_col))
    .join(', ');

  const seatCount = ticket.booking_seats.length;
  const seatPrice = showtime.price;
  const serviceFee = 30;
  const discount = ticket.discount_id ? 50 : 0; 

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-shade-900 mb-8">Transaction Details</h1>

      <div className="max-w-xl mx-auto drop-shadow-xl mb-12 relative overflow-hidden rounded-t-xl">
        {/* Top Dark Blue Section */}
        <div className="bg-royal-blue-default text-white p-8 rounded-t-xl">
          <h2 className="text-2xl font-bold text-[#F2C96F] mb-6">{movie.name}</h2>
          
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-sm text-shade-300 mb-1">Location</p>
              <p className="font-semibold">{theater.name}</p>
            </div>
            <div>
              <p className="text-sm text-shade-300 mb-1">Class</p>
              <p className="font-semibold">{screen.type}</p>
            </div>
            <div>
              <p className="text-sm text-shade-300 mb-1">Date</p>
              <p className="font-semibold">{formatFullDate(showtime.show_time)}</p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm text-shade-300 mb-1">Time</p>
                <p className="font-semibold">{formatTime(showtime.show_time)}</p>
              </div>
              <div>
                <p className="text-sm text-shade-300 mb-1">Studio</p>
                <p className="font-semibold">{screen.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Yellow Section */}
        <div className="bg-[#F2C96F] p-8 pb-12 text-royal-blue-default relative">
          <div className="flex justify-between items-center">
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr]">
                <span className="text-sm font-medium opacity-80">Booking Code</span>
                <span className="font-bold">{ticket.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <span className="text-sm font-medium opacity-80">Password Key</span>
                <span className="font-bold">{passwordKey}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <span className="text-sm font-medium opacity-80">Seats</span>
                <span className="font-bold">{seats}</span>
              </div>
            </div>
            <div className="border border-royal-blue-default p-3 rounded-lg cursor-pointer hover:bg-black/5 transition">
              <GoDownload className="text-3xl" />
            </div>
          </div>

          <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-2 gap-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-white rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-shade-900 mb-6">Purchase Details</h3>
        
        <div className="space-y-4 text-shade-700 mb-6">
          <div className="flex justify-between">
            <span>REGULAR SEAT</span>
            <span>₹{seatPrice?.toLocaleString('en-IN')} <span className="font-bold ml-2">X{seatCount}</span></span>
          </div>
          <div className="flex justify-between">
            <span>SERVICE FEE</span>
            <span>₹{serviceFee.toLocaleString('en-IN')} <span className="font-bold ml-2">X{seatCount}</span></span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>PROMO TIX ID</span>
              <span>- ₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <hr className="border-shade-200 mb-4" />
        
        <div className="flex justify-between font-bold text-shade-900 mb-10">
          <span>TOTAL PAYMENT</span>
          <span>₹{ticket.total_amount?.toLocaleString('en-IN')}</span>
        </div>

        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-royal-blue font-bold text-lg hover:text-royal-blue-hover transition cursor-pointer"
        >
          <GoArrowLeft className="text-2xl" />
          Return
        </button>
      </div>
    </div>
  );
}