import { Database } from './supabase'

// ─────────────────────────────────────────
// ROW TYPES
// ─────────────────────────────────────────

export type Profile             = Database['public']['Tables']['profile']['Row']
export type Movie               = Database['public']['Tables']['movies']['Row']
export type Theater             = Database['public']['Tables']['theater']['Row']
export type Screen              = Database['public']['Tables']['screen']['Row']
export type Seat                = Database['public']['Tables']['seats']['Row']
export type Showtime            = Database['public']['Tables']['showtimes']['Row']
export type SeatLocked          = Database['public']['Tables']['seat_locked']['Row']
export type Booking             = Database['public']['Tables']['bookings']['Row']
export type BookingSeat         = Database['public']['Tables']['booking_seats']['Row']
export type Payment             = Database['public']['Tables']['payments']['Row']
export type Discount            = Database['public']['Tables']['discount']['Row']
export type City                = Database['public']['Tables']['cities']['Row']
export type Brand               = Database['public']['Tables']['brands']['Row']
export type News                = Database['public']['Tables']['news']['Row']

// ─────────────────────────────────────────
// INSERT TYPES
// ─────────────────────────────────────────

export type ProfileInsert       = Database['public']['Tables']['profile']['Insert']
export type MovieInsert         = Database['public']['Tables']['movies']['Insert']
export type TheaterInsert       = Database['public']['Tables']['theater']['Insert']
export type ScreenInsert        = Database['public']['Tables']['screen']['Insert']
export type SeatInsert          = Database['public']['Tables']['seats']['Insert']
export type ShowtimeInsert      = Database['public']['Tables']['showtimes']['Insert']
export type SeatLockedInsert    = Database['public']['Tables']['seat_locked']['Insert']
export type BookingInsert       = Database['public']['Tables']['bookings']['Insert']
export type BookingSeatInsert   = Database['public']['Tables']['booking_seats']['Insert']
export type PaymentInsert       = Database['public']['Tables']['payments']['Insert']
export type DiscountInsert      = Database['public']['Tables']['discount']['Insert']
export type NewsInsert          = Database['public']['Tables']['news']['Insert']

// ─────────────────────────────────────────
// UPDATE TYPES
// ─────────────────────────────────────────

export type ProfileUpdate       = Database['public']['Tables']['profile']['Update']
export type MovieUpdate         = Database['public']['Tables']['movies']['Update']
export type TheaterUpdate       = Database['public']['Tables']['theater']['Update']
export type ScreenUpdate        = Database['public']['Tables']['screen']['Update']
export type SeatUpdate          = Database['public']['Tables']['seats']['Update']
export type ShowtimeUpdate      = Database['public']['Tables']['showtimes']['Update']
export type SeatLockedUpdate    = Database['public']['Tables']['seat_locked']['Update']
export type BookingUpdate       = Database['public']['Tables']['bookings']['Update']
export type BookingSeatUpdate   = Database['public']['Tables']['booking_seats']['Update']
export type PaymentUpdate       = Database['public']['Tables']['payments']['Update']
export type DiscountUpdate      = Database['public']['Tables']['discount']['Update']
export type NewsUpdate          = Database['public']['Tables']['news']['Update']

// ─────────────────────────────────────────
// ENUM TYPES
// ─────────────────────────────────────────

export type UserRole            = Database['public']['Enums']['role_enum']
export type MovieStatus         = Database['public']['Enums']['movie_status_enum']
export type GenreType           = Database['public']['Enums']['genre_enum']
export type AgeRating           = Database['public']['Enums']['age_rating_enum']
export type BookingStatus       = Database['public']['Enums']['booking_status_enum']
export type BookingSeatStatus   = Database['public']['Enums']['booking_seat_status_enum']
export type ReservationStatus   = Database['public']['Enums']['reservation_status_enum']
export type PaymentMethod       = Database['public']['Enums']['payment_method_enum']
export type PaymentStatus       = Database['public']['Enums']['payment_status_enum']
export type RefundStatus        = Database['public']['Enums']['refund_status_enum']
export type DiscountType        = Database['public']['Enums']['discount_type_enum']

// ─────────────────────────────────────────
// CUSTOM COMBINED TYPES
// ─────────────────────────────────────────

export type ShowtimeWithDetails = Showtime & {
  theater: Theater
  screen: Screen
  movies: Movie
}

export type BookingWithDetails = Booking & {
  showtime: ShowtimeWithDetails
  booking_seats: BookingSeat[]
  payments: Payment
}

export type TheaterWithScreens = Theater & {
  screen: Screen[]
  brands: Brand
  cities: City
}

export type SeatWithStatus = Seat & {
  is_locked: boolean
  is_booked: boolean
  locked_by_user_id: string | null
}

// ─────────────────────────────────────────
// STRICT CARD TYPES (no nulls for UI)
// ─────────────────────────────────────────

export type NewsCard = News & {
  title: string
  img: string
  category: string
  tag: string
  subtitle: string
  release_date: string
}

export type MovieCard = Movie & {
  name: string
  movie_img: string
  genre: GenreType
  movies_status: MovieStatus
}

export type ShowtimeCard = Showtime & {
  show_time: string
  price: number
}

export type TheaterCard = Theater & {
  name: string
}

export type CityCard = City & {
  name: string
}

export type BrandCard = Brand & {
  name: string
  logo_url: string
}

export type ShowtimeWithTheaterAndScreen = Showtime & {
  theater: Theater & {
    brands: Brand | null
  }
  screen: Screen
}

export type GroupedShowtime = {
  theater: Theater & { brands: Brand | null }
  showtimes: ShowtimeWithTheaterAndScreen[]
}
export type GroupedByTheater = {
  theater: Theater & { brands: Brand | null }
  screens: {
    screen: Screen
    showtimes: Showtime[]
  }[]
}

export type ShowtimeForBooking = {
  id: string
  show_time: string
  price: number | null
  is_active: boolean | null
  movie_id: string | null
  theater_id: string | null
  screen_id: string | null
  created_at: string | null
  updated_at: string | null
  theater: {
    id: string
    name: string
    address: string | null
    brand_id: string | null
    city_id: string | null
    latitude: number | null   // ← new
    longitude: number | null  // ← new
    brands: {
      id: string
      name: string
      logo_url: string | null
    } | null
    cities?: {
      id: string
      name: string
      latitude: number | null
      longitude: number | null
    } | null
  } | null
  screen: {
    id: string
    name: string
    type: string | null
  } | null
}