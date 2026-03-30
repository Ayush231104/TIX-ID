'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { BookingInsert, BookingSeatInsert, ShowtimeForBooking } from '@/types/index';

export async function getShowtimes(movieId: string, date?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('showtimes')
    .select(`
      id,
      show_time,
      price,
      is_active,
      movie_id,
      theater_id,
      screen_id,
      created_at,
      updated_at,
      theater:theater_id(
        id, name, address, brand_id, city_id, latitude, longitude,
        brands:brand_id(id, name, logo_url),
        cities:city_id(id, name, latitude, longitude)
      ),
      screen:screen_id(id, name, type)
    `)
    .eq('movie_id', movieId)
    .eq('is_active', true)
    .order('show_time', { ascending: true });

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    query = query
      .gte('show_time', startOfDay.toISOString())
      .lte('show_time', endOfDay.toISOString());
  }

  const { data, error } = await query;
  if (error) return { success: false, error: error.message, data: null };

  // Return any to avoid strict TS conflicts with complex Supabase joins right now
  return { success: true, data: data as unknown as ShowtimeForBooking[], error: null };
}


// export async function getSeatsWithStatus(screenId: string, showtimeId: string) {
//   const supabase = await createClient()

//   const { data: seats, error: seatsError } = await supabase
//     .from('seats')
//     .select('*')
//     .eq('screen_id', screenId)
//     .order('seat_row', { ascending: true })

//   if (seatsError) return { success: false, error: seatsError.message }

//   const { data: lockedSeats } = await supabase
//     .from('seat_locked')
//     .select('seat_id, user_id')
//     .eq('showtime_id', showtimeId)
//     .eq('reservation_status', 'hold')
//     .gt('expires_at', new Date().toISOString())

//   const blockedStatuses: ("reserved" | "confirmed" | "cancelled")[] = ['confirmed', 'reserved'];
//   const { data: bookedSeats } = await supabase
//     .from('booking_seats')
//     .select('seat_id')
//     .eq('showtime_id', showtimeId)
//     .in('booking_seat_status', blockedStatuses) 
    
//   // map seat_id → user_id for locked seats
//   const lockedMap = new Map(lockedSeats?.map((s) => [s.seat_id, s.user_id]) ?? [])
//   const bookedIds = new Set(bookedSeats?.map((s) => s.seat_id) ?? [])

//   const seatsWithStatus = seats?.map((seat) => ({
//     ...seat,
//     is_locked: lockedMap.has(seat.id),
//     is_booked: bookedIds.has(seat.id),
//     locked_by_user_id: lockedMap.get(seat.id) ?? null,
//   }))

//   return { success: true, data: seatsWithStatus }
// }
export async function getSeatsWithStatus(screenId: string, showtimeId: string) {
  const supabase = await createClient()

  const { data: seats, error: seatsError } = await supabase
    .from('seats')
    .select('*')
    .eq('screen_id', screenId)
    .order('seat_row', { ascending: true })

  if (seatsError) return { success: false, error: seatsError.message }

  // 1. Get temporary UI locks (Yellow)
  const { data: lockedSeats } = await supabase
    .from('seat_locked')
    .select('seat_id, user_id')
    .eq('showtime_id', showtimeId)
    .eq('reservation_status', 'hold')
    .gt('expires_at', new Date().toISOString())

  // 2. Get actual bookings (Reserved & Confirmed)
  const { data: bookedSeats } = await supabase
    .from('booking_seats')
    .select(`
      seat_id,
      booking_seat_status,
      bookings ( user_id )
    `)
    .eq('showtime_id', showtimeId)
    .in('booking_seat_status', ['confirmed', 'reserved'])
    
  // 3. Map them intelligently
  const lockedMap = new Map<string, string>()
  const bookedIds = new Set<string>()

  // Add temporary UI locks to the lock map
  lockedSeats?.forEach((s) => {
    if (s.seat_id && s.user_id) {
      lockedMap.set(s.seat_id, s.user_id)
    }
  })

  // Route the booking seats to the correct color bucket
  bookedSeats?.forEach((s) => {
    if (!s.seat_id) return;

    if (s.booking_seat_status === 'confirmed') {
      bookedIds.add(s.seat_id) // Paid -> Royal Blue
    } else if (s.booking_seat_status === 'reserved') {
      // Pending Stripe -> Treat as Locked (Yellow)
      // Extract user_id from the joined bookings table safely
      const userId = Array.isArray(s.bookings) ? s.bookings[0]?.user_id : s.bookings?.user_id;
      if (userId) {
        lockedMap.set(s.seat_id, userId);
      }
    }
  })

  // 4. Build final seat array
  const seatsWithStatus = seats?.map((seat) => ({
    ...seat,
    is_locked: lockedMap.has(seat.id),
    is_booked: bookedIds.has(seat.id),
    locked_by_user_id: lockedMap.get(seat.id) ?? null,
  }))

  return { success: true, data: seatsWithStatus }
}

export async function lockSeats(
  showtimeId: string,
  seatIds: string[],
  userId: string
) {
  const supabase = await createClient();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  const lockData = seatIds.map((seatId) => ({
    showtime_id: showtimeId,
    seat_id: seatId,
    user_id: userId,
    expires_at: expiresAt,
    reservation_status: 'hold' as const,
  }));

  const { error } = await supabase
    .from('seat_locked')
    .insert(lockData);

  if (error) return { success: false, error: error.message };
  return { success: true, expiresAt };
}

// release locked seats
export async function releaseSeats(showtimeId: string, seatIds: string[]) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('seat_locked')
    .delete()
    .eq('showtime_id', showtimeId)
    .in('seat_id', seatIds);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// create booking
export async function createBooking(
  bookingData: BookingInsert,
  seatIds: string[],
  showtimeId: string
) {
  const supabase = await createClient();

  // create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (bookingError) return { success: false, error: bookingError.message };

  // create booking seats
  const bookingSeats: BookingSeatInsert[] = seatIds.map((seatId) => ({
    booking_id: booking.id,
    seat_id: seatId,
    showtime_id: showtimeId,
    booking_seat_status: 'reserved' as const,
  }));

  const { error: seatsError } = await supabase
    .from('booking_seats')
    .insert(bookingSeats);

  if (seatsError) return { success: false, error: seatsError.message };

  // release locks since booking is confirmed
  await releaseSeats(showtimeId, seatIds);

  revalidatePath(`/booking/${bookingData.showtime_id}`);

  return { success: true, data: booking };
}

// validate discount code
export async function validateDiscount(code: string, totalAmount: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('discount')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .gt('valid_until', new Date().toISOString())
    .single();

  if (error || !data) return { success: false, error: 'Invalid or expired discount code' };

  if (data.min_amount && totalAmount < data.min_amount) {
    return { success: false, error: `Minimum amount is ₹${data.min_amount}` };
  }

  if (data.usage_limit && data.usage_count && data.usage_count >= data.usage_limit) {
    return { success: false, error: 'Discount code has reached its usage limit' };
  }

  const discountAmount = data.discount_type === 'percent'
    ? (totalAmount * (data.discounted_amount ?? 0)) / 100
    : (data.discounted_amount ?? 0);

  return { success: true, data, discountAmount };
}

// get user bookings
export async function getUserBookings(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      showtimes (
        *,
        movies ( name, movie_img ),
        theater ( name, address ),
        screen ( name, type )
      ),
      booking_seats ( *, seats ( seat_row, seat_col ) )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}