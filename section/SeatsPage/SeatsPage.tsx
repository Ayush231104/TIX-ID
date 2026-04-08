'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSelectedShowtime, setSelectedMovie, setSelectedSeats } from '@/lib/features/slice/bookingSlice'
import SeatGrid from './SeatGrid'
import type { SeatWithStatus, ShowtimeForBooking } from '@/types'
import ShowtimeDropdown from './ShowtimeDropdown'
import { bookingApi, useGetSeatsWithStatusQuery, useSyncSeatsMutationMutation, useReleaseSeatsMutationMutation } from '@/lib/features/api/bookingApi'
import toast from 'react-hot-toast'
import Image from 'next/image'
import ConfirmModal from '@/components/ui/ConfirmModal'
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

function computeDiff(synced: string[], desired: string[]) {
  const syncedSet = new Set(synced)
  const desiredSet = new Set(desired)
  return {
  toAdd: (desired ?? []).filter(s => !syncedSet.has(s)),
  toDelete: (synced ?? []).filter(s => !desiredSet.has(s)),
  }
}

interface RealtimePayloadRecord {
  user_id?: string;
  [key: string]: unknown;
}

interface RealtimeChangePayload {
  new?: RealtimePayloadRecord | null;
  old?: RealtimePayloadRecord | null;
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
  const [isSyncing, setIsSyncing] = useState(false)
  const [showBackModal, setShowBackModal] = useState(false)

  const queryArgs = useMemo(() => ({
  screenId: selectedShowtime?.screen_id ?? '',
  showtimeId: selectedShowtime?.id ?? ''
  }), [selectedShowtime?.screen_id, selectedShowtime?.id])

  const lastSyncedRef = useRef<string[]>([])
  const pendingDesiredRef = useRef<string[]>([])
  const pendingLabelsRef = useRef<string[]>(selectedSeatLabels)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isPushingDataRef = useRef<boolean>(false);

  const {
  data: seats = [],
  isLoading,
  } = useGetSeatsWithStatusQuery(queryArgs, {
  skip: !selectedShowtime?.screen_id || !selectedShowtime?.id,
  refetchOnMountOrArgChange: false,
  });

  const [syncSeatsAction] = useSyncSeatsMutationMutation();
  const [releaseSeatsAction] = useReleaseSeatsMutationMutation();
  const currentUserId = useAppSelector((state) => state.auth.user?.id ?? null);

  const pathname = usePathname();

  const [loginHref, setLoginHref] = useState('/login')

  useEffect(() => {
  const currentQuery = window.location.search
  const currentPath = `${pathname}${currentQuery}`
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgotPassword')
  
  const nextLoginHref = isAuthPage || pathname === '/'
    ? '/login'
    : `/login?next=${encodeURIComponent(currentPath)}`
    
  setLoginHref(nextLoginHref)
  }, [pathname])

  useEffect(() => {
  window.history.pushState(null, '', window.location.href);
  const handlePopState = () => {
    setShowBackModal(true);
    window.history.pushState(null, '', window.location.href);
  };
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  dispatch(setSelectedSeats({ ids: backup.seatIds, labels: backup.seatLabels }))

  lastSyncedRef.current = backup.seatIds;
  pendingDesiredRef.current = backup.seatIds;
  pendingLabelsRef.current = backup.seatLabels;
  }, [dispatch, movieId, router, selectedMovie, selectedShowtime])

  useEffect(() => {
  if (!selectedShowtime || !selectedMovie) return
  sessionStorage.setItem('tix_seats_backup', JSON.stringify({
    showtime: selectedShowtime, movie: selectedMovie,
    seatIds: selectedSeatIds, seatLabels: selectedSeatLabels,
  }))
  }, [selectedShowtime, selectedMovie, selectedSeatIds, selectedSeatLabels])

  // 2. UPDATED REALTIME CHANNEL (No manual fetch, strictly typed)
  useEffect(() => {
  if (!selectedShowtime?.id) return
  let fallbackTimer: NodeJS.Timeout | null = null

  const handleChange = (payload: RealtimeChangePayload) => {
  if (isPushingDataRef.current) return;

  const getUserId = (record?: RealtimePayloadRecord | null): string | null => {
    return record && typeof record.user_id === 'string' ? record.user_id : null;
  };

  const newUserId = getUserId(payload.new);
  const oldUserId = getUserId(payload.old);
  const changedUserId = newUserId || oldUserId;

  if (changedUserId && changedUserId === currentUserId) return;
  
  if (fallbackTimer) clearTimeout(fallbackTimer)
  
  fallbackTimer = setTimeout(() => {
    dispatch(bookingApi.util.invalidateTags([{ type: 'Seats', id: selectedShowtime.id }]));
  }, 800)
  }

  const channel = supabase
    .channel(`seats-${selectedShowtime.id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'seat_locked', filter: `showtime_id=eq.${selectedShowtime.id}` }, handleChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_seats', filter: `showtime_id=eq.${selectedShowtime.id}` }, handleChange)
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
    if (fallbackTimer) clearTimeout(fallbackTimer)
  }
  }, [selectedShowtime?.id, currentUserId, dispatch])

  const handleShowtimeSwitch = useCallback(async (newShowtime: ShowtimeForBooking) => {
  if (selectedShowtime?.id && lastSyncedRef.current.length > 0) {
    await releaseSeatsAction({ showtimeId: selectedShowtime.id, seatIds: lastSyncedRef.current });
  }
  dispatch(setSelectedShowtime(newShowtime))
  lastSyncedRef.current = [];
  pendingDesiredRef.current = [];
  pendingLabelsRef.current = [];
  }, [dispatch, selectedShowtime, releaseSeatsAction])

  const flushNow = useCallback(async (): Promise<boolean> => {
  if (!selectedShowtime?.id || !currentUserId) return true;

  const desired = pendingDesiredRef.current;
  const synced = lastSyncedRef.current;
  const { toAdd, toDelete } = computeDiff(synced, desired);

  if (toAdd.length === 0 && toDelete.length === 0) return true;

  isPushingDataRef.current = true;

  setIsSyncing(true);
  try {
    const result = await syncSeatsAction({
    showtimeId: selectedShowtime.id,
    userId: currentUserId,
    seatsToAdd: toAdd,
    seatsToDel: toDelete
    }).unwrap();

    const confirmedSeats = result.held_seats || [];
    lastSyncedRef.current = confirmedSeats;

    return true;
  } catch (err: unknown) {
    const rtkError = err as { data?: { error?: string, seat_id?: string }; message?: string };

    const rollbackIds = lastSyncedRef.current.slice(-10);
    pendingDesiredRef.current = rollbackIds;

    const rollbackLabels = pendingLabelsRef.current.slice(0, rollbackIds.length);
    pendingLabelsRef.current = rollbackLabels;

    dispatch(setSelectedSeats({ ids: rollbackIds, labels: rollbackLabels }));

    if (rtkError?.data?.error === 'SEAT_CONFLICT') {
    toast.dismiss();
    toast.error(`Seat was just taken by someone else. Please choose another.`);
    } else {
    toast.dismiss();
    toast.error("Network error. Your selection has been reset.");
    }
    return false;
  } finally {
    setTimeout(() => {
    isPushingDataRef.current = false;
  }, 800);
  }
  }, [selectedShowtime?.id, currentUserId, syncSeatsAction, dispatch]);

  const scheduleFlush = useCallback(() => {
  if (debounceTimer.current) clearTimeout(debounceTimer.current);
  debounceTimer.current = setTimeout(flushNow, 800);
  }, [flushNow]);

  const handleSeatClick = useCallback((seat: SeatWithStatus) => {
  if (seat.is_booked) return
  if (seat.is_locked && seat.locked_by_user_id !== currentUserId) return
  if (!selectedShowtime?.id) return
  if (!currentUserId) {
    router.push(loginHref);
    return
  }

  const label = getSeatLabel(seat)

  const currentIds = pendingDesiredRef.current;
  const currentLabels = pendingLabelsRef.current;
  const isAlreadySelected = currentIds.includes(seat.id);

  let nextIds: string[];
  let nextLabels: string[];

  if (isAlreadySelected) {
    nextIds = currentIds.filter(id => id !== seat.id);
    nextLabels = currentLabels.filter(l => l !== label);
  } else if (currentIds.length >= 10) {
    toast.dismiss();
    toast.error("Max 10 seats. Oldest selection removed.");
    nextIds = [...currentIds.slice(-(10 - 1)), seat.id];
    nextLabels = [...currentLabels.slice(-(10 - 1)), label];
  } else {
    nextIds = [...currentIds, seat.id];
    nextLabels = [...currentLabels, label];
  }

  pendingDesiredRef.current = nextIds;
  pendingLabelsRef.current = nextLabels;
  dispatch(setSelectedSeats({ ids: nextIds, labels: nextLabels }));

  scheduleFlush();

  }, [dispatch, selectedShowtime?.id, currentUserId, router, loginHref, scheduleFlush])

  const handleConfirm = async () => {
  if (selectedSeatIds.length === 0) return
  if (!currentUserId) { router.push('/login'); return }

  setConfirming(true)

  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = null
    const flushed = await flushNow()
    if (!flushed) {
    setConfirming(false);
    return;
    }
  }

  // Save cart to sessionStorage before navigating
  sessionStorage.setItem('tix_cart', JSON.stringify({
    movie: selectedMovie,
    showtime: selectedShowtime,
    seats: selectedSeatIds,
    labels: selectedSeatLabels
  }));
  router.push(`/booking/${movieId}/seats/payment`)
  }

  const handleBackClick = () => {
  setShowBackModal(true);
  }

  const handleBackConfirm = async () => {
  if (selectedShowtime?.id && lastSyncedRef.current.length > 0) {
    await releaseSeatsAction({
    showtimeId: selectedShowtime.id,
    seatIds: lastSyncedRef.current
    });
  }
  sessionStorage.removeItem('tix_seats_backup');
  lastSyncedRef.current = [];
  setShowBackModal(false);
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
        {isSyncing && <span className="text-xs text-shade-400 animate-pulse hidden sm:block">Saving...</span>}
      </div>
      </div>
      
      {isLoading && seats.length === 0 ? (
      <div className='w-full flex flex-col items-center gap-1 sm:gap-2 overflow-x-auto'>
        {[...Array(8)].map((_, rowIndex) => (
        <div key={rowIndex} className='flex justify-center'>
          <div className='flex gap-1 sm:gap-2'>
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
        disabled={confirming}
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