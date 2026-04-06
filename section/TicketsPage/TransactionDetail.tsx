'use client';

import { GoArrowLeft, GoDownload } from 'react-icons/go';
import type { EnrichedBooking } from './TicketsPage'; 
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from '@/components/pdf/TicketPDF';

type TransactionTicket = EnrichedBooking & {
  discount?: {
    code?: string;
  };
};

interface TransactionDetailProps {
  ticket: TransactionTicket;
  onBack: () => void;
}

const formatFullDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

const getSeatLabel = (row: number, col: number): string => {
  return `${String.fromCharCode(64 + row)}${col}`;
};

export default function TransactionDetail({ ticket, onBack }: TransactionDetailProps) {
  const [passwordKey] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const isClient = typeof window !== 'undefined';

  if (!ticket || !ticket.showtimes) {
    return (
      <div className="w-full pb-10 flex flex-col items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-shade-600">Loading ticket details...</p>
      </div>
    );
  }

  const showtime = ticket.showtimes;
  const movie = showtime.movies;
  const theater = showtime.theater;
  const screen = showtime.screen;
  
  const seats = (ticket.booking_seats || [])
    .map((bs) => {
      if (!bs?.seats) return '';
      return getSeatLabel(bs.seats.seat_row, bs.seats.seat_col);
    })
    .filter(Boolean)
    .join(', ');

  const seatCount = ticket.booking_seats?.length || 0;
  const seatPrice = showtime.price || 0;
  const serviceFee = 30;
  
  const subtotal = (seatPrice * seatCount) + (serviceFee * seatCount);
  const discountAmount = subtotal - (ticket.total_amount ?? subtotal); 

  return (
    <div className="w-full pb-10">
      <h1 className="text-2xl md:text-3xl flex justify-center font-bold text-shade-900 mb-6 md:mb-8">
        Transaction Details
      </h1>

      <div className="max-w-xl mx-4 sm:mx-auto mb-10 relative overflow-hidden rounded-t-xl">
        
        <div className="bg-royal-blue-default text-white p-6 sm:p-8 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F2C96F] mb-6">{movie?.name || 'Movie'}</h2>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs sm:text-sm text-shade-300 mb-1">Location</p>
              <p className="text-sm sm:text-base font-semibold">{theater?.name || 'Theater'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-shade-300 mb-1">Class</p>
              <p className="text-sm sm:text-base font-semibold">{screen?.type || 'Standard'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-shade-300 mb-1">Date</p>
              <p className="text-sm sm:text-base font-semibold">{showtime.show_time ? formatFullDate(showtime.show_time) : 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs sm:text-sm text-shade-300 mb-1">Time</p>
                <p className="text-sm sm:text-base font-semibold">{showtime.show_time ? formatTime(showtime.show_time) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-shade-300 mb-1">Studio</p>
                <p className="text-sm sm:text-base font-semibold">{screen?.name || '1'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#F2C96F] p-6 sm:p-8 pb-10 sm:pb-12 text-royal-blue-default relative">
          
          <div className="sm:flex justify-between items-start sm:items-center gap-4">
            
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr]">
                <span className="text-xs sm:text-sm font-medium opacity-80">Booking Code</span>
                <span className="text-sm sm:text-base font-bold break-all">
                  {ticket.id?.split('-')[0].toUpperCase() || 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr]">
                <span className="text-xs sm:text-sm font-medium opacity-80">Password Key</span>
                <span className="text-sm sm:text-base font-bold">{passwordKey}</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr]">
                <span className="text-xs sm:text-sm font-medium opacity-80">Seats</span>
                <span className="text-sm sm:text-base font-bold">{seats || 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-center max-w-15 shrink-0 border border-royal-blue-default rounded-lg transition mt-1 sm:mt-0 cursor-pointer hover:bg-black/5">
              {isClient ? (
                <PDFDownloadLink
                  document={<TicketPDF ticket={ticket} passwordKey={passwordKey} seats={seats} />}
                  fileName={`TIX-ID-Ticket-${ticket.id?.split('-')[0].toUpperCase() || 'CODE'}.pdf`}
                  className="p-2 sm:p-3 flex items-center justify-center w-full h-full"
                >
                  {({ loading }) => (
                    loading ? (
                       <div className="w-6 h-6 border-2 border-royal-blue-default border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                       <GoDownload className="text-2xl sm:text-3xl text-royal-blue-default" />
                    )
                  )}
                </PDFDownloadLink>
              ) : (
                <div className="p-2 sm:p-3">
                  <GoDownload className="text-2xl sm:text-3xl text-royal-blue-default opacity-50" />
                </div>
              )}
            </div>
          </div>

          <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 flex justify-around px-1 w-full overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-3 sm:w-5 sm:h-5 bg-white rounded-full shrink-0" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-0">
        <h3 className="text-lg sm:text-xl font-bold text-shade-900 mb-6">Purchase Details</h3>
        
        <div className="space-y-4 text-sm sm:text-base text-shade-700 mb-6">
          <div className="flex justify-between">
            <span>REGULAR SEAT</span>
            <span>₹{seatPrice?.toLocaleString('en-IN')} <span className="font-bold ml-2">X{seatCount}</span></span>
          </div>
          <div className="flex justify-between">
            <span>SERVICE FEE</span>
            <span>₹{serviceFee.toLocaleString('en-IN')} <span className="font-bold ml-2">X{seatCount}</span></span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="uppercase">Discount</span>
              <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <hr className="border-shade-200 mb-4" />
        
        <div className="flex justify-between font-bold text-base sm:text-lg text-shade-900 mb-8">
          <span>TOTAL PAYMENT</span>
          <span>₹{(ticket.total_amount ?? subtotal).toLocaleString('en-IN')}</span>
        </div>

        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-royal-blue font-bold text-base sm:text-lg hover:text-royal-blue-hover transition cursor-pointer"
        >
          <GoArrowLeft className="text-xl sm:text-2xl" />
          Return
        </button>
      </div>
    </div>
  );
}