'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSeat, setSelectedShowtime, setSelectedMovie } from '@/lib/features/slice/bookingSlice'
import SeatGrid from './SeatGrid'
import type { SeatWithStatus, ShowtimeForBooking } from '@/types'
import ShowtimeDropdown from './ShowtimeDropdown'
import { useGetSeatsWithStatusQuery, useLockSeatsMutationMutation, useReleaseSeatsMutationMutation } from '@/lib/features/api/bookingApi'
import toast from 'react-hot-toast'

const supabase = createClient()

const rowToLetter = (row: number) => String.fromCharCode(64 + row)
const getSeatLabel = (seat: SeatWithStatus) => `${rowToLetter(seat.seat_row)}${seat.seat_col}`


function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className='flex items-center gap-2'>
            <div className={`w-4 h-4 ${color}`} />
            <span className='text-sm text-shade-600'>{label}</span>
        </div>
    )
}

export default function SeatsPage() {
    const router = useRouter()
    const params = useParams()
    const movieId = params.bookingId as string
    const dispatch = useAppDispatch()

    // ── Redux ──
    const selectedMovie = useAppSelector((s) => s.booking.selectedMovie)
    const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime)
    const selectedSeatIds = useAppSelector((s) => s.booking.selectedSeatIds)
    const selectedSeatLabels = useAppSelector((s) => s.booking.selectedSeatLabels)
    const totalAmount = useAppSelector((s) => s.booking.totalAmount)

    // ── Local state ──
    const [confirming, setConfirming] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const pendingRef = useRef<Set<string>>(new Set())

    const isProceedingRef = useRef(false)

    // ── RTK Query Hooks ──
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

    // GUARD & HYDRATION (Handles Page Refresh)
    useEffect(() => {
        if (selectedShowtime && selectedMovie) {
            sessionStorage.setItem('tix_seats_backup', JSON.stringify({
                showtime: selectedShowtime,
                movie: selectedMovie,
                seatIds: selectedSeatIds,
                seatLabels: selectedSeatLabels
            }))
            return
        }

        // 2. If Redux is empty (because of a refresh), check for the backup
        const backupRaw = sessionStorage.getItem('tix_seats_backup')
        if (backupRaw) {
            const backup = JSON.parse(backupRaw)

            dispatch(setSelectedMovie(backup.movie))
            dispatch(setSelectedShowtime(backup.showtime))

            backup.seatIds.forEach((id: string, index: number) => {
                dispatch(toggleSeat({ id, label: backup.seatLabels[index] }))
            })
        } else {
            router.replace(`/booking/${movieId}`)
        }
    }, [selectedShowtime, selectedMovie, selectedSeatIds, selectedSeatLabels, dispatch, router, movieId])

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
            if (!isProceedingRef.current && showtimeRef.current?.id && seatIdsRef.current.length > 0) {
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
    }, [dispatch, selectedShowtime, selectedSeatIds, releaseSeatsAction])

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
        dispatch(toggleSeat({ id: seat.id, label }));

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
    }, [dispatch, selectedShowtime, selectedSeatIds, selectedSeatLabels, currentUserId, router, fetchSeats, lockSeatsAction, releaseSeatsAction])


    // Handle Confirm
    const handleConfirm = async () => {
        if (selectedSeatIds.length === 0) return
        if (!currentUserId) {
            router.push('/login')
            return
        }
        setConfirming(true)
        isProceedingRef.current = true
        router.push(`/booking/${movieId}/seats/payment`)
        setConfirming(false)
    }

    // Handle back button
    const handleBack = useCallback(async () => {
        if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: selectedSeatIds });
        }
        router.replace(`/booking/${movieId}`)
    }, [selectedShowtime, selectedSeatIds, releaseSeatsAction, router, movieId]);

    // Guards
    if (!selectedShowtime) return null

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

            {/* {selectedSeatIds.length > 0 && (
                <div className='bg-white border-t border-shade-200 px-6 sm:px-16 lg:px-42 py-10 flex flex-col md:flex-row gap-4 justify-between z-50'>
                    <div className='sm:w-1/2 flex flex-wrap gap-6  sm:gap-16 justify-start'>
                        <div>
                            <div className='text-shade-600 text-[18px]'>Total</div>
                            <div className='font-bold text-2xl sm:text-4xl text-shade-900'>
                                ₹{totalAmount.toLocaleString('en-IN')}
                            </div>
                        </div>

                        <div className='max-w-72 sm:w-72'>
                            <div className='text-shade-600 text-[18px]'>Seats ({selectedSeatIds.length})</div>
                            <div className='font-bold text-4xl leading-11.5 text-shade-900'>
                                {selectedSeatLabels.join(', ')}
                            </div>
                        </div>
                    </div>

                    <div className='sm:w-1/2 flex gap-3 sm:justify-center pt-4'>
                        <button
                            onClick={handleBack}
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
            )} */}
            {selectedSeatIds.length > 0 && (
                <div className='max-w-[80%] bg-white border-t border-shade-200 mx-auto py-6 md:py-10 flex flex-col md:flex-row justify-between gap-6 md:gap-4 z-50'>

                    <div className='w-full md:w-auto flex flex-row justify-between md:justify-start gap-4 sm:gap-16'>

                        <div className='flex flex-col'>
                            <div className='text-shade-600 text-[14px] md:text-[18px] mb-1'>Total</div>
                            <div className='font-bold text-xl sm:text-3xl lg:text-4xl text-shade-900'>
                                ₹{totalAmount.toLocaleString('en-IN')}
                            </div>
                        </div>

                        <div className='flex flex-col max-w-[55%] lg:min-w-72 text-right md:text-left'>
                            <div className='text-shade-600 text-[14px] md:text-[18px] mb-1'>
                                Seats ({selectedSeatIds.length})
                            </div>
                            <div className='font-bold text-lg sm:text-2xl lg:text-4xl leading-tight text-shade-900'>
                                {selectedSeatLabels.join(', ')}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Buttons */}
                    <div className='w-full md:w-auto flex flex-row gap-3 pt-2 md:pt-0'>
                        <button
                            onClick={handleBack}
                            className='flex-1 md:flex-none md:w-40 lg:w-50 h-12 flex items-center justify-center font-medium text-base sm:text-xl border border-shade-600 rounded-[5px] text-shade-600 hover:bg-royal-blue-hover hover:text-shade-200 active:bg-royal-blue-while-pressed transition-all cursor-pointer'
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={confirming}
                            className='flex-1 md:flex-none md:w-40 lg:w-54 h-12 flex items-center justify-center bg-royal-blue text-sunshine-yellow font-medium text-base sm:text-xl rounded-[5px] hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed transition-all disabled:opacity-50 uppercase tracking-wide cursor-pointer'
                        >
                            {confirming ? 'Wait...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}