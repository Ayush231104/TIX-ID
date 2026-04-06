'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSeat, setSelectedShowtime, setSelectedMovie } from '@/lib/features/slice/bookingSlice'
import SeatGrid from './SeatGrid'
import type { SeatWithStatus, ShowtimeForBooking } from '@/types'
import ShowtimeDropdown from './ShowtimeDropdown'
import { bookingApi, useGetSeatsWithStatusQuery, useLockSeatsMutationMutation, useReleaseSeatsMutationMutation } from '@/lib/features/api/bookingApi'
import toast from 'react-hot-toast'
import Skeleton from '@/components/ui/Skeleton'
import Image from 'next/image'
import Typography from '@/components/ui/Typography'
import ConfirmModal from '@/components/ui/ConfirmModal'

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

// 🚀 THE DIFF ENGINE: Calculates exactly what needs to be added or removed from the DB
function computeDiff(synced: string[], desired: string[]) {
  const syncedSet = new Set(synced)
  const desiredSet = new Set(desired)
  return {
      toAdd: desired.filter(s => !syncedSet.has(s)),
      toDelete: synced.filter(s => !desiredSet.has(s)),
  }
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
  const [isSyncing, setIsSyncing] = useState(false) // 🚀 Visual indicator for background saves
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showBackModal, setShowBackModal] = useState(false)

  const queryArgs = useMemo(() => ({
    screenId: selectedShowtime?.screen_id ?? '',
    showtimeId: selectedShowtime?.id ?? ''
  }), [selectedShowtime?.screen_id, selectedShowtime?.id])

  // 🚀 THE SYNC REFS
  const isProceedingRef = useRef(false)
  const syncedSeatsRef = useRef<string[]>([])
  const pendingDesiredRef = useRef<string[]>([])
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Keep pendingDesired fresh on every UI change
  useEffect(() => {
      pendingDesiredRef.current = selectedSeatIds
  }, [selectedSeatIds])

  const {
    data: seats = [],
    isLoading,
    refetch: fetchSeats
  } = useGetSeatsWithStatusQuery(queryArgs,
    { skip: !selectedShowtime?.screen_id || !selectedShowtime?.id }
  );

  const [lockSeatsAction] = useLockSeatsMutationMutation();
  const [releaseSeatsAction] = useReleaseSeatsMutationMutation();

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

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ── HYDRATION ──
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
    
    syncedSeatsRef.current = backup.seatIds;
    pendingDesiredRef.current = backup.seatIds;
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


  const flushNow = useCallback(async (): Promise<boolean> => {
      if (!selectedShowtime?.id || !currentUserId) return true;

      const desired = pendingDesiredRef.current;
      const synced = syncedSeatsRef.current;
      const { toAdd, toDelete } = computeDiff(synced, desired);

      if (toAdd.length === 0 && toDelete.length === 0) return true;

      setIsSyncing(true);

      try {
          const promises = [];
          if (toAdd.length > 0) {
              promises.push(lockSeatsAction({ showtimeId: selectedShowtime.id, seatIds: toAdd, userId: currentUserId }));
          } else {
              promises.push(Promise.resolve({ data: null, error: undefined })); 
          }

          if (toDelete.length > 0) {
              promises.push(releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: toDelete }));
          } else {
              promises.push(Promise.resolve({ data: null, error: undefined })); 
          }

          const [lockResult] = await Promise.all(promises);

          if (lockResult?.error) {
              toAdd.forEach(id => dispatch(toggleSeat({ id, label: '' }))); 
              toast.error('Some seats were taken by others. Please reselect.');
              await fetchSeats();
              return false;
          }

          syncedSeatsRef.current = desired;
          return true;
      } catch (err) {
					console.error("Sync error:", err);
          toAdd.forEach(id => dispatch(toggleSeat({ id, label: '' })));
          toast.error("Network error. Your selection has been reset.");
          return false;
      } finally {
          setIsSyncing(false);
      }
  }, [selectedShowtime?.id, currentUserId, lockSeatsAction, releaseSeatsAction, dispatch, fetchSeats]);

  // 🚀 THE DEBOUNCE WRAPPER
  const scheduleFlush = useCallback(() => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(flushNow, 800);
  }, [flushNow]);

  // ── REALTIME HANDLER ──
  // 🚀 Greatly simplified! No more complex patching. Just a debounced refetch when ANY change happens in DB.
  useEffect(() => {
    if (!selectedShowtime?.id) return

    let fallbackTimer: NodeJS.Timeout | null = null

    const handleChange = () => {
        if (fallbackTimer) clearTimeout(fallbackTimer)
        fallbackTimer = setTimeout(() => fetchSeats(), 300)
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
      if (fallbackTimer) clearTimeout(fallbackTimer)
    }
  }, [selectedShowtime?.id, fetchSeats])


  const showtimeRef = useRef(selectedShowtime)
  const seatIdsRef = useRef(selectedSeatIds)
  useEffect(() => { showtimeRef.current = selectedShowtime }, [selectedShowtime])
  useEffect(() => { seatIdsRef.current = selectedSeatIds }, [selectedSeatIds])

  useEffect(() => {
    return () => {
      if (!isProceedingRef.current && showtimeRef.current?.id && seatIdsRef.current.length > 0) {
        releaseSeatsAction({
          showtimeId: showtimeRef.current.id,
          seatIds: seatIdsRef.current
        })
        sessionStorage.removeItem('tix_seats_backup');
      }
    }
  }, [releaseSeatsAction])

  const handleShowtimeSwitch = useCallback(async (newShowtime: ShowtimeForBooking) => {
    if (selectedShowtime?.id && selectedSeatIds.length > 0) {
      await releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: selectedSeatIds });
    }
    dispatch(setSelectedShowtime(newShowtime))
  }, [dispatch, selectedShowtime, selectedSeatIds, releaseSeatsAction])


  // 🚀 PURE UI SEAT CLICK - Zero DB calls, triggers the debouncer
  const handleSeatClick = useCallback((seat: SeatWithStatus) => {
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
      toast.error("You can only select up to 10 seats per transaction.", {
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

    // Tell the system to start the 800ms timer
    scheduleFlush();

  }, [dispatch, selectedShowtime, selectedSeatIds, selectedSeatLabels, currentUserId, router, scheduleFlush])


  const handleConfirm = async () => {
    if (selectedSeatIds.length === 0) return
    if (!currentUserId) { router.push('/login'); return }
    setConfirming(true)

    // 🚀 Force immediate sync if the user hit confirm before the 800ms timer ended
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const success = await flushNow();
    
    if (!success) {
        setConfirming(false);
        return; // flushNow already showed the error toast, so we just stop
    }

    isProceedingRef.current = true
    router.push(`/booking/${movieId}/seats/payment`)
    setConfirming(false)
  }

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
    syncedSeatsRef.current = []; // Clear the DB tracker
    setShowBackModal(false);
    isProceedingRef.current = true;
    router.replace(`/booking/${movieId}`);
  }

  if (!selectedShowtime) return null

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
              {/* Optional: Add a subtle loading indicator while DB saves in background */}
              {isSyncing && <span className="text-xs text-shade-400 animate-pulse hidden sm:block">Saving...</span>}
            </div>
          </div>
          {isLoading ? (
            <div className='w-full flex flex-col items-center gap-1 sm:gap-3'>
              {[...Array(8)].map((_, rowIndex) => (
                <div key={rowIndex} className='flex justify-center'>
                  <div className='flex gap-1 sm:gap-3'>
                    {[...Array(10)].map((_, colIndex) => (
                      <Skeleton key={colIndex} w='w-7 sm:w-10' h='h-6 sm:h-9' rounded='rounded-md' />
                    ))}
                  </div>
                  <div className='w-8 sm:w-20' />
                  <div className='flex gap-1 sm:gap-3'>
                    {[...Array(10)].map((_, colIndex) => (
                      <Skeleton key={colIndex} w='w-7 sm:w-10' h='h-6 sm:h-9' rounded='rounded-md' />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SeatGrid
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              currentUserId={currentUserId}
              onSeatClick={handleSeatClick}
            />
          )}
        </div>
      </div>

      {/* Screen */}
      <div className='w-full flex justify-center mt-6  sm:mt-12 mb-2 sm:mb-6'>
        <Image src="/images/booking/cinema-screen.avif" alt="Screen decoration" width={1200} height={200} className='w-[70%] h-auto' />
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

          <div className='w-full md:w-auto flex flex-row gap-3 pt-2 md:pt-0'>
            <button
              onClick={handleBackClick}
              className='flex-1 md:flex-none md:w-40 lg:w-50 h-12 flex items-center justify-center font-medium text-base sm:text-xl border border-shade-600 rounded-[5px] text-shade-600 hover:bg-royal-blue-hover hover:text-shade-200 active:bg-royal-blue-while-pressed transition-all cursor-pointer'
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming || isSyncing} // Disable confirm while flushing!
              className='flex-1 md:flex-none md:w-40 lg:w-54 h-12 flex items-center justify-center bg-royal-blue text-sunshine-yellow font-medium text-base sm:text-xl rounded-[5px] hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed transition-all disabled:opacity-50 uppercase tracking-wide cursor-pointer'
            >
              {confirming ? 'Wait...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showBackModal}
        onClose={() => setShowBackModal(false)}
        onConfirm={handleBackConfirm}
        title="Want to go back?"
        description="The seats you selected will be released and you will need to select again."
        confirmText="Go Back"
      />
    </div>
  )
}