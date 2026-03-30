// types/ticket.ts

export interface Seat {
  seat_row: number;
  seat_col: number;
}

export interface BookingSeat {
  seats: Seat;
}

export interface Movie {
  id: string;
  name: string;
  movie_img: string;
}

export interface Theater {
  id: string;
  name: string;
  address?: string;
}

export interface Screen {
  id: string;
  name: string;
  type: string;
}

export interface Showtime {
  id: string;
  show_time: string;
  price: number;
  movies: Movie;
  theater: Theater;
  screen: Screen;
}

export interface Booking {
  id: string;
  total_amount: number;
  booking_status: 'paid' | 'pending' | 'cancelled' | 'failed';
  discount_id: string | null;
  created_at: string;
  showtimes: Showtime;
  booking_seats: BookingSeat[];
}

export type TicketCategory = 'Film' | 'Event' | 'Voucher';