'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSeat, setSelectedShowtime, setSelectedMovie } from '@/lib/features/slice/bookingSlice'
import SeatGrid from './SeatGrid'
import type { SeatWithStatus, ShowtimeForBooking } from '@/types'
import ShowtimeDropdown from './ShowtimeDropdown'
import { useGetSeatsWithStatusQuery, useLockSeatsMutationMutation, useReleaseSeatsMutationMutation } from '@/lib/features/api/bookingApi'
import toast from 'react-hot-toast'
import Skeleton from '@/components/ui/Skeleton'

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

    const selectedMovie = useAppSelector((s) => s.booking.selectedMovie)
    const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime)
    const selectedSeatIds = useAppSelector((s) => s.booking.selectedSeatIds)
    const selectedSeatLabels = useAppSelector((s) => s.booking.selectedSeatLabels)
    const totalAmount = useAppSelector((s) => s.booking.totalAmount)

    const [confirming, setConfirming] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [showBackModal, setShowBackModal] = useState(false)

    const queryArgs = useMemo(() => ({
        screenId: selectedShowtime?.screen_id ?? '',
        showtimeId: selectedShowtime?.id ?? ''
    }), [selectedShowtime?.screen_id, selectedShowtime?.id])

    const pendingRef = useRef<Set<string>>(new Set())
    const isProceedingRef = useRef(false)

    // ── RTK Query Hooks ──
    const {
        data: seats = [],
        isLoading,
        refetch: fetchSeats
    } = useGetSeatsWithStatusQuery(queryArgs,
        { skip: !selectedShowtime?.screen_id || !selectedShowtime?.id }
    );

    const [lockSeatsAction] = useLockSeatsMutationMutation();
    const [releaseSeatsAction] = useReleaseSeatsMutationMutation();

    // Get current user once on mount
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setCurrentUserId(user.id)
        })
    }, [])

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            setShowBackModal(true);
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // GUARD & HYDRATION
    // Only runs once on mount, not on every click
    useEffect(() => {
        if (selectedShowtime && selectedMovie) return

        const backupRow = sessionStorage.getItem('tix_seats_backup')
        if (!backupRow) {
            router.replace(`/booking/${movieId}`)
            return
        }

        const backup = JSON.parse(backupRow)
        dispatch(setSelectedMovie(backup.movie))
        dispatch(setSelectedShowtime(backup.showtime))
        backup.seatIds.forEach((id: string, index: number) => {
            dispatch(toggleSeat({ id, label: backup.seatLabels[index] }))
        })
    }, [])

    useEffect(() => {
        if (!selectedShowtime || !selectedMovie) return
        sessionStorage.setItem('tix_seats_backup', JSON.stringify({
            showtime: selectedShowtime,
            movie: selectedMovie,
            seatIds: selectedSeatIds,
            seatLabels: selectedSeatLabels,
        }))
    }, [selectedShowtime, selectedMovie, selectedSeatIds, selectedSeatLabels])

    useEffect(() => {
        if (!selectedShowtime?.id) return

        let debounceTimer: NodeJS.Timeout | null = null

        const handleChange = () => {
            if (pendingRef.current.size > 0) return

            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                fetchSeats()
            }, 150) 
        }

        const channel = supabase
            .channel(`seats-${selectedShowtime.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'seat_locked',
                filter: `showtime_id=eq.${selectedShowtime.id}`,
            }, handleChange)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'booking_seats',
                filter: `showtime_id=eq.${selectedShowtime.id}`,
            }, handleChange)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
            if (debounceTimer) clearTimeout(debounceTimer)
        }
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

    // Showtime switch — release locks first
    const handleShowtimeSwitch = useCallback(async (newShowtime: ShowtimeForBooking) => {
        if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeatsAction({
                showtimeId: selectedShowtime.id,
                seatIds: selectedSeatIds
            });
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
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
            })
            oldestSeatId = selectedSeatIds[0];
            oldestSeatLabel = selectedSeatLabels[0];
        }

        // ── Optimistic — instant UI update ──
        dispatch(toggleSeat({ id: seat.id, label }));
        if (oldestSeatId && oldestSeatLabel) {
            dispatch(toggleSeat({ id: oldestSeatId, label: oldestSeatLabel }));
        }

        pendingRef.current.add(seat.id)

        try {
            if (alreadySelected) {
                await releaseSeatsAction({
                    showtimeId: selectedShowtime.id,
                    seatIds: [seat.id]
                })
            } else {
                const [lockResult] = await Promise.all([
                    lockSeatsAction({
                        showtimeId: selectedShowtime.id,
                        seatIds: [seat.id],
                        userId: currentUserId
                    }),
                    oldestSeatId
                        ? releaseSeatsAction({
                            showtimeId: selectedShowtime.id,
                            seatIds: [oldestSeatId]
                        })
                        : Promise.resolve({ error: undefined })
                ])

                if (lockResult.error) {
                    dispatch(toggleSeat({ id: seat.id, label }))
                    if (oldestSeatId && oldestSeatLabel) {
                        dispatch(toggleSeat({ id: oldestSeatId, label: oldestSeatLabel }))
                    }
                    await fetchSeats()
                    toast.error('Seat was just taken. Please choose another.')
                }
            }
        } finally {
            pendingRef.current.delete(seat.id)
        }
    }, [dispatch, selectedShowtime, selectedSeatIds, selectedSeatLabels, currentUserId, router, fetchSeats, lockSeatsAction, releaseSeatsAction])


    // Confirm → go to payment
    const handleConfirm = async () => {
        if (selectedSeatIds.length === 0) return
        if (!currentUserId) { router.push('/login'); return }
        setConfirming(true)
        isProceedingRef.current = true
        router.push(`/booking/${movieId}/seats/payment`)
        setConfirming(false)
    }

    // 🚀 3. UPDATE BACK BUTTON HANDLERS
    const handleBackClick = () => {
        setShowBackModal(true);
    }

    const handleBackConfirm = async () => {
        if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeatsAction({
                showtimeId: selectedShowtime.id,
                seatIds: selectedSeatIds
            });
        }
        sessionStorage.removeItem('tix_seats_backup');
        setShowBackModal(false);
        isProceedingRef.current = true; // Stops the unmount useEffect from firing twice
        router.replace(`/booking/${movieId}`);
    }

    // Handle back button
    const handleBack = useCallback(async () => {
        if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeatsAction({
                showtimeId: selectedShowtime.id,
                seatIds: selectedSeatIds
            });
        }
        router.replace(`/booking/${movieId}`)
    }, [selectedShowtime, selectedSeatIds, releaseSeatsAction, router, movieId]);

    // Guards
    if (!selectedShowtime) return null

    if (isLoading) return <SeatsPageSkeleton />

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
                            onClick={handleBackClick}
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

            {showBackModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-xl font-bold text-shade-900'>Want to go back?</h2>
                            <button onClick={() => setShowBackModal(false)} className='text-shade-400 hover:text-shade-900 text-2xl cursor-pointer'>x</button>
                        </div>
                        <p className='text-shade-600 text-sm mb-6'>The seats you selected will be released and you will need to select again.</p>
                        <div className='flex gap-3 justify-end'>
                            <button onClick={() => setShowBackModal(false)} className='px-6 py-2.5 border border-shade-300 rounded-xl text-shade-900 hover:bg-shade-100 transition-all cursor-pointer'>
                                Cancel
                            </button>
                            <button onClick={handleBackConfirm} className='px-6 py-2.5 bg-royal-blue text-white font-bold rounded-xl hover:bg-royal-blue-hover transition-all cursor-pointer'>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function SeatsPageSkeleton() {
    return (
        <div className='w-full min-h-screen pb-11'>
            <div className='px-6 md:px-16 pt-11'>

                {/* Header */}
                <Skeleton w='w-48' h='h-10' rounded='rounded-lg' />
                <div className='mt-2'>
                    <Skeleton w='w-72' h='h-5' rounded='rounded-md' />
                </div>

                <div className='mt-8'>
                    {/* Showtime dropdown + Legend row */}
                    <div className='flex flex-col gap-4 sm:flex-row items-center justify-between mb-8'>
                        <Skeleton w='w-32' h='h-8' rounded='rounded-lg' />
                        <div className='flex items-center gap-6'>
                            <Skeleton w='w-20' h='h-5' rounded='rounded-md' />
                            <Skeleton w='w-20' h='h-5' rounded='rounded-md' />
                            <Skeleton w='w-20' h='h-5' rounded='rounded-md' />
                            <Skeleton w='w-20' h='h-5' rounded='rounded-md' />
                        </div>
                    </div>

                    {/* Seat grid — 8 rows × 20 cols split by aisle */}
                    <div className='w-full flex flex-col items-center gap-1 sm:gap-3'>
                        {[...Array(8)].map((_, rowIndex) => (
                            <div key={rowIndex} className='flex justify-center'>
                                {/* Left half — 10 seats */}
                                <div className='flex gap-1 sm:gap-3'>
                                    {[...Array(10)].map((_, colIndex) => (
                                        <Skeleton
                                            key={colIndex}
                                            w='w-7 sm:w-10'
                                            h='h-6 sm:h-9'
                                            rounded='rounded-md'
                                        />
                                    ))}
                                </div>

                                {/* Aisle */}
                                <div className='w-8 sm:w-20' />

                                {/* Right half — 10 seats */}
                                <div className='flex gap-1 sm:gap-3'>
                                    {[...Array(10)].map((_, colIndex) => (
                                        <Skeleton
                                            key={colIndex}
                                            w='w-7 sm:w-10'
                                            h='h-6 sm:h-9'
                                            rounded='rounded-md'
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Screen bar */}
            <div className='w-full mt-12'>
                <Skeleton w='w-full' h='h-10 sm:h-15' rounded='rounded-none' />
            </div>
        </div>
    )
}