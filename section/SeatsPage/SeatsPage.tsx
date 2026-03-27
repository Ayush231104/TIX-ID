'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSeat, setSelectedShowtime } from '@/lib/features/slice/bookingSlice'
import SeatGrid from './SeatGrid'
import type { SeatWithStatus, ShowtimeForBooking } from '@/types'
import ShowtimeDropdown from './ShowtimeDropdown'
import { useGetSeatsWithStatusQuery, useLockSeatsMutationMutation, useReleaseSeatsMutationMutation } from '@/lib/features/api/bookingApi'
import toast from 'react-hot-toast'

const supabase = createClient()

// Legend item
function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className='flex items-center gap-2'>
            <div className={`w-4 h-4 ${color}`} />
            <span className='text-sm text-shade-600'>{label}</span>
        </div>
    )
}

// SeatsPage
export default function SeatsPage() {
    const router = useRouter()
    const params = useParams()
    const movieId = params.bookingId as string
    const dispatch = useAppDispatch()

    // ── Redux ──
    const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime)
    const selectedSeatIds = useAppSelector((s) => s.booking.selectedSeatIds)
    const selectedSeatLabels = useAppSelector((s) => s.booking.selectedSeatLabels)
    const totalAmount = useAppSelector((s) => s.booking.totalAmount)

    // ── Local state ──
    const [confirming, setConfirming] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const pendingRef = useRef<Set<string>>(new Set())

    // ── RTK Query Hooks ──
    // FIX: Safely fallback to empty strings to satisfy strict TypeScript
    const {
        data: seats = [],
        isLoading,
        refetch: fetchSeats
    } = useGetSeatsWithStatusQuery(
        {
            screenId: selectedShowtime?.screen_id ?? '',
            showtimeId: selectedShowtime?.id ?? ''
        },
        { skip: !selectedShowtime?.screen_id || !selectedShowtime?.id }
    );

    const [lockSeatsAction] = useLockSeatsMutationMutation();
    const [releaseSeatsAction] = useReleaseSeatsMutationMutation();

    // Get current user on mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setCurrentUserId(user.id)
        }
        getUser()
    }, [])

    // Guard — no showtime → go back
    useEffect(() => {
        if (!selectedShowtime) {
            router.replace(`/booking/${movieId}`)
        }
    }, [selectedShowtime, router, movieId])

    // Realtime subscription
    useEffect(() => {
        if (!selectedShowtime?.id) return

        const handleChange = () => {
            fetchSeats()
        }

        const channel = supabase
            .channel(`seats-${selectedShowtime.id}`)
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'seat_locked',
                filter: `showtime_id=eq.${selectedShowtime.id}`,
            }, handleChange)
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'booking_seats',
                filter: `showtime_id=eq.${selectedShowtime.id}`,
            }, handleChange)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [selectedShowtime?.id, fetchSeats])

    // Release locks on unmount
    const showtimeRef = useRef(selectedShowtime)
    const seatIdsRef = useRef(selectedSeatIds)
    useEffect(() => { showtimeRef.current = selectedShowtime }, [selectedShowtime])
    useEffect(() => { seatIdsRef.current = selectedSeatIds }, [selectedSeatIds])

    useEffect(() => {
        return () => {
            if (showtimeRef.current?.id && seatIdsRef.current.length > 0) {
                releaseSeatsAction({ showtimeId: showtimeRef.current.id, seatIds: seatIdsRef.current })
            }
        }
    }, [releaseSeatsAction])

    // Handle showtime switch from dropdown
    const handleShowtimeSwitch = useCallback(async (newShowtime: ShowtimeForBooking) => {
        if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: selectedSeatIds });
        }
        dispatch(setSelectedShowtime(newShowtime))
        // FIX: Added releaseSeatsAction to dependencies to satisfy React Compiler
    }, [dispatch, selectedShowtime, selectedSeatIds, releaseSeatsAction])

    // Handle seat click — optimistic update
    const rowToLetter = (row: number) => String.fromCharCode(64 + row)
    const getSeatLabel = (seat: SeatWithStatus) => `${rowToLetter(seat.seat_row)}${seat.seat_col}`

    const handleSeatClick = useCallback(async (seat: SeatWithStatus) => {
        if (seat.is_booked) return 
        if (seat.is_locked && seat.locked_by_user_id !== currentUserId) return
        if (!selectedShowtime?.id) return
        if (!currentUserId) {
            router.push('/login')
            return
        }

        const label = getSeatLabel(seat)
        const alreadySelected = selectedSeatIds.includes(seat.id)

        // 🚀 NEW: FIFO (First-In, First-Out) Queue Logic
        let oldestSeatId: string | null = null;
        let oldestSeatLabel: string | null = null;

        if (!alreadySelected && selectedSeatIds.length >= 10) {
            toast("You can only select up to 10 seats per transaction.", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
            oldestSeatId = selectedSeatIds[0];
            oldestSeatLabel = selectedSeatLabels[0];
        }

        // ── Optimistic — instant UI update ──
        dispatch(toggleSeat({ id: seat.id, label })); // Add the newly clicked seat
        
        if (oldestSeatId && oldestSeatLabel) {
            dispatch(toggleSeat({ id: oldestSeatId, label: oldestSeatLabel })); // Remove the oldest seat
        }
        
        pendingRef.current.add(seat.id)

        if (alreadySelected) {
            await releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: [seat.id] });
        } else {
            // We use Promise.all to run the lock and the release at the EXACT same time for speed
            const lockPromise = lockSeatsAction({ showtimeId: selectedShowtime.id, seatIds: [seat.id], userId: currentUserId });
            const releasePromise = oldestSeatId 
                ? releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: [oldestSeatId] }) 
                : Promise.resolve({ error: undefined });

            const [lockResult] = await Promise.all([lockPromise, releasePromise]);

            if (lockResult.error) {
                // Rollback both actions if someone else snatched the new seat right as we clicked
                dispatch(toggleSeat({ id: seat.id, label })); 
                if (oldestSeatId && oldestSeatLabel) {
                    dispatch(toggleSeat({ id: oldestSeatId, label: oldestSeatLabel })); 
                }
                await fetchSeats();
            }
        }

        pendingRef.current.delete(seat.id)
    }, [dispatch, selectedShowtime, selectedSeatIds, selectedSeatLabels, currentUserId, router, fetchSeats, lockSeatsAction, releaseSeatsAction, getSeatLabel])

    // const handleSeatClick = useCallback(async (seat: SeatWithStatus) => {
    //     if (seat.is_booked) return
    //     if (seat.is_locked && seat.locked_by_user_id !== currentUserId) return
    //     if (!selectedShowtime?.id) return
    //     if (!currentUserId) {
    //         router.push('/login')
    //         return
    //     }

    //     const label = getSeatLabel(seat)
    //     const alreadySelected = selectedSeatIds.includes(seat.id)

    //     if (!alreadySelected && selectedSeatIds.length >= 10) {
    //         alert("You can only select up to 10 seats per transaction.");
    //         return;
    //     }

    //     // ── Optimistic — instant UI update ──
    //     dispatch(toggleSeat({ id: seat.id, label }))
    //     pendingRef.current.add(seat.id)

    //     if (alreadySelected) {
    //         await releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: [seat.id] });
    //     } else {
    //         const result = await lockSeatsAction({ showtimeId: selectedShowtime.id, seatIds: [seat.id], userId: currentUserId });
    //         // RTK Query mutations return { data } on success, or { error } on failure
    //         if (result.error) {
    //             dispatch(toggleSeat({ id: seat.id, label }))
    //             await fetchSeats()
    //         }
    //     }

    //     pendingRef.current.delete(seat.id)
    //     // FIX: Added lock/release actions to dependencies
    // }, [dispatch, selectedShowtime, selectedSeatIds, currentUserId, router, fetchSeats, lockSeatsAction, releaseSeatsAction])

    // Handle Confirm
    const handleConfirm = async () => {
        if (selectedSeatIds.length === 0) return
        if (!currentUserId) {
            router.push('/login')
            return
        }
        setConfirming(true)
        router.push(`/booking/${movieId}/seats/payment`)
        setConfirming(false)
    }

    // Guards
    if (!selectedShowtime) return null

    // FIX: Changed from 'loading' to 'isLoading' (from RTK Query)
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='w-8 h-8 bg-royal-blue rounded-full animate-bounce' />
            </div>
        )
    }

    // Render
    return (
        <div className='w-full min-h-screen pb-11'>
            <div className='px-6 md:px-16 pt-11'>
                <h1 className='text-4xl font-bold text-shade-900'>CHOOSE SEAT</h1>
                <p className='text-shade-600 text-[16px] mt-2'>
                    Choose the seat you want to occupy during the screening
                </p>

                <div className='mt-8 '>
                    <div className='flex flex-col gap-4 sm:flex-row items-center justify-between mb-8'>
                        <ShowtimeDropdown
                            selectedShowtime={selectedShowtime}
                            movieId={movieId}
                            onSelect={handleShowtimeSwitch}
                        />

                        <div className='flex flex-wrap items-center gap-2 sm:gap-6'>
                            <LegendItem color='bg-royal-blue' label='Booked' />
                            <LegendItem color='bg-white border border-shade-300' label='Available' />
                            <LegendItem color='bg-sky-blue' label='Selected' />
                            <LegendItem color='bg-white border-2 border-yellow-400' label='On hold' />
                        </div>
                    </div>

                    <SeatGrid
                        seats={seats}
                        selectedSeatIds={selectedSeatIds}
                        currentUserId={currentUserId}
                        onSeatClick={handleSeatClick}
                    />
                </div>
            </div>

            {/* Screen */}
            <div className='w-full mt-12'>
                <div className='w-full h-10 sm:h-15 bg-sky-blue flex items-center justify-center'>
                    <span className='text-shade-200 text-2xl'>SCREEN THIS WAY</span>
                </div>
            </div>

            {selectedSeatIds.length > 0 && (
                <div className='bg-white border-t border-shade-200 px-6 sm:px-16 lg:px-42 py-20 flex flex-col md:flex-row gap-4 justify-between z-50'>
                    <div className='w-1/2 flex flex-col sm:flex-row justify-between'>
                        <div>
                            <div className='text-shade-600 text-[18px]'>Total</div>
                            <div className='font-bold text-2xl sm:text-4xl text-shade-900'>
                                ₹{totalAmount.toLocaleString('en-IN')}
                            </div>
                        </div>

                        <div className='w-72'>
                            <div className='text-shade-600 text-[18px]'>Seats ({selectedSeatIds.length})</div>
                            <div className='font-bold text-4xl leading-11.5 text-shade-900'>
                                {selectedSeatLabels.join(', ')}
                            </div>
                        </div>
                    </div>

                    <div className='w-1/2 flex flex-col lg:flex-row gap-3 justify-center pt-4'>
                        <button
                            onClick={() => router.back()}
                            className='w-40 sm:w-50 h-12 px-2 py-3 font-medium text-lg sm:text-xl border border-shade-600 rounded-[5px] text-shade-600 hover:bg-royal-blue-hover hover:text-shade-200 active:bg-royal-blue-while-pressed  transition-all cursor-pointer'
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={confirming}
                            className='w-40 sm:w-54 h-12 px-2 py-3 bg-royal-blue text-sunshine-yellow font-medium text-lg sm:text-xl rounded-[5px] hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed transition-all disabled:opacity-50 uppercase tracking-wide cursor-pointer'
                        >
                            {confirming ? 'Please wait...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}