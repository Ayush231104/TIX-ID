import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Movie, ShowtimeForBooking } from '@/types/index'

const SERVICE_FEE = 30

interface BookingState {
  selectedMovie: Movie | null
  selectedDate: string | null
  selectedShowtime: ShowtimeForBooking | null
  selectedSeatIds: string[]
  selectedSeatLabels: string[]
  discountCode: string
  discountId: string | null
  discountAmount: number
  serviceFee: number
  totalAmount: number
  totalSeats: number
}

const initialState: BookingState = {
  selectedMovie: null,
  selectedDate: null,
  selectedShowtime: null,
  selectedSeatIds: [],
  selectedSeatLabels: [],
  discountCode: '',
  discountId: null,
  discountAmount: 0,
  serviceFee: SERVICE_FEE,
  totalAmount: 0,
  totalSeats: 0,
}

const recalculate = (state: BookingState) => {
  const price = state.selectedShowtime?.price ?? 0
  state.totalSeats = state.selectedSeatIds.length
  state.totalAmount = (state.totalSeats * (price + SERVICE_FEE)) - state.discountAmount
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
      state.selectedShowtime = null
      state.selectedSeatIds = []
      state.selectedSeatLabels = []
    },
    setSelectedShowtime: (state, action: PayloadAction<ShowtimeForBooking>) => {
      state.selectedShowtime = action.payload
      state.selectedSeatIds = []
      state.selectedSeatLabels = []
      recalculate(state)
    },
    toggleSeat: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const { id, label } = action.payload
      if (state.selectedSeatIds.includes(id)) {
        state.selectedSeatIds = state.selectedSeatIds.filter((s) => s !== id)
        state.selectedSeatLabels = state.selectedSeatLabels.filter((l) => l !== label)
      } else {
        state.selectedSeatIds.push(id)
        state.selectedSeatLabels.push(label)
      }
      recalculate(state)
    },
    setSelectedSeats: (state, action: PayloadAction<{ ids: string[]; labels: string[] }>) => {
      state.selectedSeatIds = action.payload.ids
      state.selectedSeatLabels = action.payload.labels
      recalculate(state)
    },
    setDiscount: (state, action: PayloadAction<{ id: string; amount: number; code: string }>) => {
      state.discountId = action.payload.id
      state.discountAmount = action.payload.amount
      state.discountCode = action.payload.code
      recalculate(state)
    },
    clearDiscount: (state) => {
      state.discountId = null
      state.discountAmount = 0
      state.discountCode = ''
      recalculate(state)
    },
    resetBooking: () => initialState,
  },
})

export const {
  setSelectedMovie,
  setSelectedDate,
  setSelectedShowtime,
  toggleSeat,
  setSelectedSeats,
  setDiscount,
  clearDiscount,
  resetBooking,
} = bookingSlice.actions

export default bookingSlice.reducer