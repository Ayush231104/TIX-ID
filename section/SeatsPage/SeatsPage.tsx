'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSeat, setSelectedShowtime } from '@/lib/features/booking/bookingSlice'
import { getSeatsWithStatus, lockSeats, releaseSeats } from '@/actions/bookingActions'
import SeatGrid from './SeatGrid'
import type { SeatWithStatus, ShowtimeForBooking } from '@/types'
import ShowtimeDropdown from './ShowtimeDropdown'

const supabase = createClient()

// ─────────────────────────────────────────
// Legend item
// ─────────────────────────────────────────
function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className='flex items-center gap-2'>
            <div className={`w-4 h-4 ${color}`} />
            <span className='text-sm text-shade-600'>{label}</span>
        </div>
    )
}

// ─────────────────────────────────────────
// SeatsPage
// ─────────────────────────────────────────
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
    const [seats, setSeats] = useState<SeatWithStatus[]>([])
    const [loading, setLoading] = useState(true)
    const [confirming, setConfirming] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    // ── Prevents our own realtime events from triggering refetch ──
    const pendingRef = useRef<Set<string>>(new Set())

    // ─────────────────────────────────────────
    // Get current user on mount
    // ─────────────────────────────────────────
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setCurrentUserId(user.id)
        }
        getUser()
    }, [])

    // ─────────────────────────────────────────
    // Guard — no showtime → go back
    // ─────────────────────────────────────────
    useEffect(() => {
        if (!selectedShowtime) {
            router.replace(`/booking/${movieId}`)
        }
    }, [selectedShowtime, router, movieId])

    // ─────────────────────────────────────────
    // fetchSeats — used by realtime + rollback
    // ─────────────────────────────────────────
    const fetchSeats = useCallback(async () => {
        if (!selectedShowtime?.screen_id || !selectedShowtime?.id) return
        const result = await getSeatsWithStatus(
            selectedShowtime.screen_id!,
            selectedShowtime.id
        )
        if (result.success && result.data) {
            setSeats(result.data as SeatWithStatus[])
        }
    }, [selectedShowtime])

    // ─────────────────────────────────────────
    // Initial fetch
    // ─────────────────────────────────────────
    useEffect(() => {
        if (!selectedShowtime?.screen_id || !selectedShowtime?.id) return

        let cancelled = false

        const load = async () => {
            setLoading(true)
            const result = await getSeatsWithStatus(
                selectedShowtime.screen_id!,
                selectedShowtime.id
            )
            if (!cancelled && result.success && result.data) {
                setSeats(result.data as SeatWithStatus[])
            }
            if (!cancelled) setLoading(false)
        }

        load()
        return () => { cancelled = true }
    }, [selectedShowtime?.screen_id, selectedShowtime?.id])

    // ─────────────────────────────────────────
    // Realtime subscription
    // ─────────────────────────────────────────
    useEffect(() => {
        if (!selectedShowtime?.id) return

        // ALWAYS fetch fresh seats when the database changes
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

    // ─────────────────────────────────────────
    // Release locks on unmount — use refs to
    // avoid stale closure capturing old values
    // ─────────────────────────────────────────
    const showtimeRef = useRef(selectedShowtime)
    const seatIdsRef = useRef(selectedSeatIds)
    useEffect(() => { showtimeRef.current = selectedShowtime }, [selectedShowtime])
    useEffect(() => { seatIdsRef.current = selectedSeatIds }, [selectedSeatIds])

    useEffect(() => {
        return () => {
            if (showtimeRef.current?.id && seatIdsRef.current.length > 0) {
                releaseSeats(showtimeRef.current.id, seatIdsRef.current)
            }
        }
    }, [])

    // ─────────────────────────────────────────
    // Handle showtime switch from dropdown
    // Release current locks, dispatch new showtime
    // ─────────────────────────────────────────
    const handleShowtimeSwitch = useCallback(async (newShowtime: ShowtimeForBooking) => {
        // release any currently locked seats before switching
        if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeats(selectedShowtime.id, selectedSeatIds)
        }
        dispatch(setSelectedShowtime(newShowtime))
    }, [dispatch, selectedShowtime, selectedSeatIds])

    // ─────────────────────────────────────────
    // Handle seat click — optimistic update
    // ─────────────────────────────────────────
    const rowToLetter = (row: number) => String.fromCharCode(64 + row)
    const getSeatLabel = (seat: SeatWithStatus) =>
        `${rowToLetter(seat.seat_row)}${seat.seat_col}`

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

        // ── Optimistic — instant UI update ──
        dispatch(toggleSeat({ id: seat.id, label }))
        pendingRef.current.add(seat.id)

        if (alreadySelected) {
            await releaseSeats(selectedShowtime.id, [seat.id])
        } else {
            const result = await lockSeats(selectedShowtime.id, [seat.id], currentUserId)
            if (!result.success) {
                // roll back — seat was taken by someone else
                dispatch(toggleSeat({ id: seat.id, label }))
                await fetchSeats()
            }
        }

        pendingRef.current.delete(seat.id)
    }, [dispatch, selectedShowtime, selectedSeatIds, currentUserId, router, fetchSeats])

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

    // ─────────────────────────────────────────
    // Guards
    // ─────────────────────────────────────────
    if (!selectedShowtime) return null

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='w-8 h-8 bg-royal-blue rounded-full animate-bounce' />
            </div>
        )
    }

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────
    return (
        <div className='min-h-screen pb-40'>
            <div className='px-6 md:px-16 pt-10'>

                {/* ── Header ── */}
                <h1 className='text-4xl font-bold text-shade-900'>CHOOSE SEAT</h1>
                <p className='text-shade-600 text-[16px] mt-2'>
                    Choose the seat you want to occupy during the screening
                </p>

                <div className='mt-8'>

                    {/* ── Showtime dropdown + Legend row ── */}
                    <div className='flex items-center justify-between mb-8'>

                        <ShowtimeDropdown
                            selectedShowtime={selectedShowtime}
                            movieId={movieId}
                            onSelect={handleShowtimeSwitch}
                        />

                        {/* Legend */}
                        <div className='flex items-center gap-6'>
                            <LegendItem color='bg-royal-blue' label='Booked' />
                            <LegendItem color='bg-white border border-shade-300' label='Available' />
                            <LegendItem color='bg-sky-blue' label='Selected' />
                            <LegendItem color='bg-white border-2 border-yellow-400' label='On hold' />
                        </div>
                    </div>

                    {/* ── Seat Grid ── */}
                    <SeatGrid
                        seats={seats}
                        selectedSeatIds={selectedSeatIds}
                        currentUserId={currentUserId}
                        onSeatClick={handleSeatClick}
                    />

                </div>
            </div>

            {selectedSeatIds.length > 0 && (
                <div className='bg-white border-t border-shade-200 px-6 md:px-16 py-4 flex items-center justify-between z-50'>

                    <div>
                        <div className='text-shade-600 text-sm'>Total</div>
                        <div className='font-bold text-2xl text-shade-900'>
                            ₹{totalAmount.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div>
                        <div className='text-shade-600 text-sm'>Seats ({selectedSeatIds.length})</div>
                        <div className='font-medium text-shade-900'>
                            {selectedSeatLabels.join(', ')}
                        </div>
                    </div>

                    <div className='flex gap-3'>
                        <button
                            onClick={() => router.back()}
                            className='px-6 py-3 border border-shade-300 rounded-xl text-shade-900 hover:bg-shade-100 transition-all cursor-pointer'
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={confirming}
                            className='px-8 py-3 bg-royal-blue text-white font-bold rounded-xl hover:bg-royal-blue-hover transition-all disabled:opacity-50 uppercase tracking-wide cursor-pointer'
                        >
                            {confirming ? 'Please wait...' : 'Confirm'}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}