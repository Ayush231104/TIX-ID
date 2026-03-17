import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Showtime, Theater, Screen, Movie } from '@/types/index';

interface SelectedShowtime {
  showtime: Showtime;
  theater: Theater;
  screen: Screen;
}

interface BookingState {
  // step 1 - movie + showtime selection
  selectedMovie: Movie | null;
  selectedDate: string | null;
  selectedShowtime: SelectedShowtime | null;

  // step 2 - seat selection
  selectedSeatIds: string[];

  // step 3 - discount
  discountCode: string;
  discountId: string | null;
  discountAmount: number;

  // summary
  totalAmount: number;
  totalSeats: number;
}

const initialState: BookingState = {
  selectedMovie: null,
  selectedDate: null,
  selectedShowtime: null,
  selectedSeatIds: [],
  discountCode: '',
  discountId: null,
  discountAmount: 0,
  totalAmount: 0,
  totalSeats: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      // reset showtime and seats when date changes
      state.selectedShowtime = null;
      state.selectedSeatIds = [];
    },
    setSelectedShowtime: (state, action: PayloadAction<SelectedShowtime>) => {
      state.selectedShowtime = action.payload;
      // reset seats when showtime changes
      state.selectedSeatIds = [];
    },
    toggleSeat: (state, action: PayloadAction<string>) => {
      const seatId = action.payload;
      if (state.selectedSeatIds.includes(seatId)) {
        state.selectedSeatIds = state.selectedSeatIds.filter((id) => id !== seatId);
      } else {
        state.selectedSeatIds.push(seatId);
      }
      state.totalSeats = state.selectedSeatIds.length;
      // recalculate total
      const price = state.selectedShowtime?.showtime.price ?? 0;
      state.totalAmount = (state.totalSeats * price) - state.discountAmount;
    },
    setDiscount: (state, action: PayloadAction<{ id: string; amount: number; code: string }>) => {
      state.discountId = action.payload.id;
      state.discountAmount = action.payload.amount;
      state.discountCode = action.payload.code;
      // recalculate total
      const price = state.selectedShowtime?.showtime.price ?? 0;
      state.totalAmount = (state.totalSeats * price) - state.discountAmount;
    },
    clearDiscount: (state) => {
      state.discountId = null;
      state.discountAmount = 0;
      state.discountCode = '';
      // recalculate total
      const price = state.selectedShowtime?.showtime.price ?? 0;
      state.totalAmount = state.totalSeats * price;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setSelectedMovie,
  setSelectedDate,
  setSelectedShowtime,
  toggleSeat,
  setDiscount,
  clearDiscount,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;