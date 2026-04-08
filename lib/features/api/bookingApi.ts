import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSeatsWithStatus, getShowtimes, lockSeats, releaseSeats, syncSeatsWithRPC } from '@/actions/bookingActions';
import type { Movie, SeatWithStatus, ShowtimeForBooking } from '@/types/index';
import { getMovie } from '@/actions/movieActions';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Seats'],
    endpoints: (builder) => ({
        getShowtimes: builder.query<ShowtimeForBooking[], { movieId: string; date?: string }>({
            queryFn: async ({ movieId, date }) => {
                try {
                    const result = await getShowtimes(movieId, date);
                    if (!result.success) return { error: { message: result.error } };
                    return { data: result.data as ShowtimeForBooking[] };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'An unexpected error occurred' } };
                }
            },
        }),

        getMovieById: builder.query<Movie, string>({
            queryFn: async (id) => {
                try {
                    const result = await getMovie(id);
                    if (!result.success || !result.data) return { error: { message: result.error || 'Not found' } };
                    return { data: result.data as Movie };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            }
        }),

        getSeatsWithStatus: builder.query<SeatWithStatus[], { screenId: string; showtimeId: string }>({
            queryFn: async ({ screenId, showtimeId }) => {
                try {
                    const result = await getSeatsWithStatus(screenId, showtimeId);
                    if (!result.success || !result.data) return { error: { message: result.error || 'Error' } };
                    return { data: result.data };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            },
            providesTags: (result, error, arg) => [{ type: 'Seats', id: arg.showtimeId }],
        }),

        syncSeatsMutation: builder.mutation<{ success: boolean; held_seats: string[] }, { showtimeId: string; userId: string; seatsToAdd: string[]; seatsToDel: string[] }>({
            queryFn: async ({ showtimeId, userId, seatsToAdd, seatsToDel }) => {
                try {
                    const result = await syncSeatsWithRPC(showtimeId, userId, seatsToAdd, seatsToDel);
                    
                    if (!result.success) {
                        return { error: { message: result.error || 'Seat update failed', data: result } };
                    }
                    
                    return { data: { success: true, held_seats: result.held_seats || [] } };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error during seat sync' } };
                }
            }
        }),

        lockSeatsMutation: builder.mutation<null, { showtimeId: string; seatIds: string[]; userId: string }>({
            queryFn: async ({ showtimeId, seatIds, userId }) => {
                try {
                    const result = await lockSeats(showtimeId, seatIds, userId);
                    if (!result.success) return { error: { message: result.error || 'Error' } };
                    return { data: null };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            },
        }),

        releaseSeatsMutation: builder.mutation<null, { showtimeId: string; seatIds: string[] }>({
            queryFn: async ({ showtimeId, seatIds }) => {
                try {
                    const result = await releaseSeats(showtimeId, seatIds);
                    if (!result.success) return { error: { message: result.error || 'Error' } };
                    return { data: null };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            }
        }),
    }),
});

export const {
    useGetShowtimesQuery,
    useGetMovieByIdQuery,
    useGetSeatsWithStatusQuery,
    useLockSeatsMutationMutation,
    useReleaseSeatsMutationMutation,
    useSyncSeatsMutationMutation
} = bookingApi;