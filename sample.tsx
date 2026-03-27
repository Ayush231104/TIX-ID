'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setDiscount, clearDiscount, resetBooking } from '@/lib/features/booking/bookingSlice'
import { validateDiscount, createBooking } from '@/actions/bookingActions'
import { releaseSeats } from '@/actions/bookingActions'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase()
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const movieId = params.bookingId as string
  const dispatch = useAppDispatch()

  // ── Read from Redux ──
  const selectedMovie    = useAppSelector((s) => s.booking.selectedMovie)
  const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime)
  const selectedSeatIds  = useAppSelector((s) => s.booking.selectedSeatIds)
  const selectedSeatLabels = useAppSelector((s) => s.booking.selectedSeatLabels)
  const discountCode     = useAppSelector((s) => s.booking.discountCode)
  const discountId       = useAppSelector((s) => s.booking.discountId)
  const discountAmount   = useAppSelector((s) => s.booking.discountAmount)
  const serviceFee       = useAppSelector((s) => s.booking.serviceFee)
  const totalAmount      = useAppSelector((s) => s.booking.totalAmount)
  const totalSeats       = useAppSelector((s) => s.booking.totalSeats)

  const [showBackModal, setShowBackModal]     = useState(false)
  const [discountInput, setDiscountInput]     = useState('')
  const [discountError, setDiscountError]     = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [buyLoading, setBuyLoading]           = useState(false)
  const [buyError, setBuyError]               = useState('')

  const price = selectedShowtime?.price ?? 0

  // ─────────────────────────────────────────
  // Back — show modal first
  // If confirmed → release locks → go back
  // ─────────────────────────────────────────
  const handleBackConfirm = async () => {
    if (selectedShowtime?.id && selectedSeatIds.length > 0) {
      await releaseSeats(selectedShowtime.id, selectedSeatIds)
    }
    dispatch(resetBooking())
    setShowBackModal(false)
    router.push(`/booking/${movieId}`)
  }

  // ─────────────────────────────────────────
  // Validate discount code
  // ─────────────────────────────────────────
  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return
    setDiscountLoading(true)
    setDiscountError('')

    const result = await validateDiscount(discountInput.trim(), totalAmount)

    if (result.success && result.data && result.discountAmount !== undefined) {
      dispatch(setDiscount({
        id: result.data.id,
        amount: result.discountAmount,
        code: discountInput.trim(),
      }))
      setDiscountInput('')
    } else {
      setDiscountError(result.error ?? 'Invalid code')
    }

    setDiscountLoading(false)
  }

  const handleRemoveDiscount = () => {
    dispatch(clearDiscount())
    setDiscountInput('')
    setDiscountError('')
  }

  // ─────────────────────────────────────────
  // Buy ticket → createBooking → resetBooking
  // ─────────────────────────────────────────
  const handleBuy = async () => {
    if (!selectedShowtime?.id || selectedSeatIds.length === 0) return
    setBuyLoading(true)
    setBuyError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const result = await createBooking(
      {
        showtime_id: selectedShowtime.id,
        user_id: user.id,
        discount_id: discountId ?? undefined,
        total_amount: totalAmount,
        total_seats: totalSeats,
        booking_status: 'confirmed',
      },
      selectedSeatIds,
      selectedShowtime.id
    )

    if (result.success) {
      dispatch(resetBooking())
      router.push(`/booking/${movieId}/seats/payment/success`)
    } else {
      setBuyError(result.error ?? 'Something went wrong')
    }

    setBuyLoading(false)
  }
  const handleBuy = async () => {
    setBuyError('')
    setBuying(true)

    try {
        // 1. Get the current user
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            router.push('/login')
            return
        }

        // Safety check
        if (!selectedShowtime || !selectedMovie) {
            setBuyError('Missing showtime or movie details.')
            setBuying(false)
            return
        }

        // 2. Create the booking in your Supabase DB
        const bookingResult = await createBooking(
            {
                showtime_id: selectedShowtime.id,
                user_id: user.id,
                total_amount: totalAmount,
                total_seats: selectedSeatIds.length,
                discount_id: discountId || undefined,
            },
            selectedSeatIds,
            selectedShowtime.id
        )

        if (!bookingResult.success || !bookingResult.data) {
            setBuyError(bookingResult.error ?? 'Failed to create booking')
            setBuying(false)
            return
        }

        // 3. Call our Server Action to get the Stripe URL
        const stripeResult = await createStripeCheckoutSession({
            totalAmount,
            movieName: selectedMovie.name,
            seatLabels: selectedSeatLabels.join(', '),
            bookingId: bookingResult.data.id,
            showtimeId: selectedShowtime.id,
        })

        if (!stripeResult.success || !stripeResult.url) {
            setBuyError(stripeResult.error ?? 'Failed to create payment session')
            setBuying(false)
            return
        }

        // 4. Redirect the user to Stripe!
        window.location.href = stripeResult.url

    } catch (err) {
        setBuyError('Something went wrong. Please try again.')
        setBuying(false)
    }
}

  if (!selectedShowtime || !selectedMovie) return null

  return (
    <div className='min-h-screen'>
      <div className='px-6 md:px-16 pt-11'>
        <h1 className='text-4xl font-bold text-shade-900'>PAYMENT CONFIRMATION</h1>
        <p className='text-shade-600 text-[16px] mt-2'>
          Confirm payment for the seat you ordered
        </p>
      </div>

      <div className='px-6 md:px-16 mt-10 flex flex-col lg:flex-row gap-12'>

        {/* ── Left — Schedule Details ── */}
        <div className='flex-1 max-w-sm'>
          <div className='text-2xl font-medium text-shade-900 mb-6'>
            Schedule Details
          </div>

          {/* Movie title */}
          <div className='mb-5 pb-5 border-b border-shade-200'>
            <div className='text-shade-400 text-xs mb-1'>Movie Title</div>
            <div className='text-shade-900 font-bold text-xl uppercase'>
              {selectedMovie.name}
            </div>
          </div>

          {/* Date */}
          <div className='mb-5 pb-5 border-b border-shade-200'>
            <div className='text-shade-400 text-xs mb-1'>Date</div>
            <div className='text-shade-900 font-bold text-base'>
              {formatDate(selectedShowtime.show_time)}
            </div>
          </div>

          {/* Class + Time */}
          <div className='mb-5 pb-5 border-b border-shade-200 flex gap-12'>
            <div>
              <div className='text-shade-400 text-xs mb-1'>Class</div>
              <div className='text-shade-900 font-bold text-base uppercase'>
                {selectedShowtime.screen?.name ?? '—'}
              </div>
            </div>
            <div>
              <div className='text-shade-400 text-xs mb-1'>Time</div>
              <div className='text-shade-900 font-bold text-base'>
                {formatTime(selectedShowtime.show_time)}
              </div>
            </div>
          </div>

          {/* Seats */}
          <div className='mb-8 pb-5 border-b border-shade-200'>
            <div className='text-shade-400 text-xs mb-1'>
              Seats ({totalSeats})
            </div>
            <div className='text-shade-900 font-bold text-base'>
              {selectedSeatLabels.join(', ')}
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => setShowBackModal(true)}
            className='flex items-center gap-2 text-shade-600 hover:text-shade-900 transition cursor-pointer'
          >
            <span className='text-lg'>←</span>
            <span className='font-medium'>Go Back</span>
          </button>
        </div>

        {/* ── Right — Order Summary ── */}
        <div className='w-full lg:max-w-md'>
          <div className='border border-shade-200 rounded-2xl p-6'>

            <div className='text-xl font-bold text-shade-900 mb-5'>
              Order Summary
            </div>

            {/* Transaction detail */}
            <div className='text-sm font-semibold text-shade-900 mb-3'>
              Transaction Detail
            </div>

            <div className='flex justify-between text-sm text-shade-700 mb-2'>
              <span className='uppercase'>{selectedShowtime.screen?.name ?? 'Seat'}</span>
              <span>₹{price.toLocaleString('en-IN')} × {totalSeats}</span>
            </div>

            <div className='flex justify-between text-sm text-shade-700 mb-4'>
              <span>Service Fee</span>
              <span>₹{serviceFee.toLocaleString('en-IN')} × {totalSeats}</span>
            </div>

            <hr className='border-shade-200 mb-4' />

            {/* Discount input */}
            <div className='text-sm font-semibold text-shade-900 mb-3'>
              Promo & Voucher
            </div>

            {discountId ? (
              // Discount applied
              <div className='flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4'>
                <div>
                  <div className='text-xs text-shade-400'>Applied</div>
                  <div className='font-semibold text-green-700'>{discountCode}</div>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-green-700 font-medium'>
                    - ₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={handleRemoveDiscount}
                    className='text-shade-400 hover:text-shade-900 text-lg cursor-pointer'
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              // Discount input field
              <div className='mb-4'>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value.toUpperCase())
                      setDiscountError('')
                    }}
                    placeholder='Enter promo code'
                    className='flex-1 border border-shade-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-royal-blue'
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={discountLoading || !discountInput.trim()}
                    className='px-4 py-2 bg-royal-blue text-white text-sm font-medium rounded-lg hover:bg-royal-blue-hover disabled:opacity-50 cursor-pointer transition-all'
                  >
                    {discountLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {discountError && (
                  <div className='text-red-500 text-xs mt-1'>{discountError}</div>
                )}
              </div>
            )}

            <hr className='border-shade-200 mb-4' />

            {/* Total */}
            <div className='flex justify-between font-bold text-shade-900 text-base mb-6'>
              <span>Total Payment</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Error */}
            {buyError && (
              <div className='text-red-500 text-sm mb-3'>{buyError}</div>
            )}

            {/* Note */}
            <div className='text-xs text-red-400 mb-4'>
              * Ticket purchases cannot be cancelled
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              disabled={buyLoading}
              className='w-full bg-royal-blue text-sunshine-yellow font-bold text-lg py-4 rounded-xl hover:bg-royal-blue-hover transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wide'
            >
              {buyLoading ? 'Processing...' : 'Buy Ticket'}
            </button>

          </div>
        </div>

      </div>

      {/* ── Back Confirmation Modal ── */}
      {showBackModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl'>

            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-shade-900'>Want to go back?</h2>
              <button
                onClick={() => setShowBackModal(false)}
                className='text-shade-400 hover:text-shade-900 text-2xl cursor-pointer'
              >
                ×
              </button>
            </div>

            <p className='text-shade-600 text-sm mb-6'>
              The seats you selected will be released and you will need to select again.
            </p>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowBackModal(false)}
                className='px-6 py-2.5 border border-shade-300 rounded-xl text-shade-900 hover:bg-shade-100 transition-all cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={handleBackConfirm}
                className='px-6 py-2.5 bg-royal-blue text-white font-bold rounded-xl hover:bg-royal-blue-hover transition-all cursor-pointer'
              >
                Go Back
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

