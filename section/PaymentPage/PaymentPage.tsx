'use client'

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { GoArrowLeft } from 'react-icons/go';

// Server Actions
import { createBooking, releaseSeats, validateDiscount } from '@/actions/bookingActions';
import { createStripeCheckoutSession } from '@/actions/stripeActions';

// Redux Actions
import {
    clearDiscount,
    resetBooking,
    setDiscount,
    setSelectedMovie,
    setSelectedShowtime,
    toggleSeat
} from '@/lib/features/slice/bookingSlice';
import { cancelPaymentAndBooking } from '@/actions/paymentVerification';
import Typography from '@/components/ui/Typography';
import ConfirmModal from '@/components/ui/ConfirmModal';

const supabase = createClient();

function formatShowDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

function formatShowtime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}

export default function PaymentPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useParams()
    const movieId = params.bookingId as string

    // ── Redux State ──
    const selectedMovie = useAppSelector((state) => state.booking.selectedMovie);
    const selectedShowtime = useAppSelector((state) => state.booking.selectedShowtime);
    const selectedSeatIds = useAppSelector((state) => state.booking.selectedSeatIds);
    const selectedSeatLabels = useAppSelector((state) => state.booking.selectedSeatLabels);
    const serviceFee = useAppSelector((state) => state.booking.serviceFee);
    const discountCode = useAppSelector((s) => s.booking.discountCode)
    const discountAmount = useAppSelector((s) => s.booking.discountAmount)
    const discountId = useAppSelector((s) => s.booking.discountId)
    const totalAmount = useAppSelector((s) => s.booking.totalAmount)

    const seatPrice = selectedShowtime?.price ?? 0
    const seatCount = selectedSeatIds.length

    const totalPrice = (seatPrice * seatCount) + (serviceFee * seatCount)

    const [showBackModal, setShowBackModal] = useState(false)
    const [discountInput, setDiscountInput] = useState('')
    const [discountError, setDiscountError] = useState('')
    const [discountLoading, setDiscountLoading] = useState(false)
    const [buying, setBuying] = useState(false)
    const [buyError, setBuyError] = useState('')

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isRedirectingRef = useRef(false);

    useEffect(() => {
        if (!selectedMovie && !selectedShowtime && selectedSeatIds.length > 0) {
            const savedCartRaw = sessionStorage.getItem('tix_cart');
            if (savedCartRaw) {
                const savedCart = JSON.parse(savedCartRaw);
                dispatch(setSelectedMovie(savedCart.movie));
                dispatch(setSelectedShowtime(savedCart.showtime));
                savedCart.seats.forEach((seatId: string, index: number) => {
                    dispatch(toggleSeat({ id: seatId, label: savedCart.labels[index] }));
                });
            } else {
                router.replace(`/booking/${movieId}`);
                return;
            }
        }
        const currentTimer = timerRef.current;

        return () => {
            if (currentTimer) clearInterval(currentTimer);
        };
    }, [selectedMovie, selectedShowtime, selectedSeatIds.length, movieId, router, dispatch,]);

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

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isRedirectingRef.current) return;
            e.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleBackConfirm = async () => {
        setBuying(true);
        const currentBookingId = sessionStorage.getItem('tix_pending_booking_id');

        if (currentBookingId) {
            await cancelPaymentAndBooking(currentBookingId);
        } else if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeats(selectedShowtime.id, selectedSeatIds)
        }

        dispatch(resetBooking())
        sessionStorage.removeItem('tix_cart');
        sessionStorage.removeItem('tix_pending_booking_id');

        setShowBackModal(false)
        router.push(`/booking/${movieId}`)
    }

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

    const handleBuy = async () => {
        setBuyError('')
        setBuying(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            let currentBookingId = sessionStorage.getItem('tix_pending_booking_id');
            const savedCartRaw = sessionStorage.getItem('tix_cart');

            let needsNewBooking = true;

            if (currentBookingId && currentBookingId !== 'null' && currentBookingId !== 'undefined' && savedCartRaw) {
                const savedCart = JSON.parse(savedCartRaw);

                const isSameShowtime = savedCart.showtime?.id === selectedShowtime!.id;
                const isSameSeats = savedCart.seats?.join(',') === selectedSeatIds.join(',');

                if (isSameShowtime && isSameSeats) {
                    needsNewBooking = false;
                }
            }

            if (needsNewBooking) {
                console.log("Creating fresh booking in database...");
                const bookingResult = await createBooking(
                    {
                        showtime_id: selectedShowtime!.id,
                        user_id: user.id,
                        total_amount: totalAmount,
                        total_seats: selectedSeatIds.length,
                        discount_id: discountId || undefined,
                    },
                    selectedSeatIds,
                    selectedShowtime!.id
                )

                if (!bookingResult.success || !bookingResult.data) {
                    setBuyError(bookingResult.error ?? 'Failed to create booking')
                    setBuying(false)
                    return
                }

                currentBookingId = bookingResult.data.id;

                if (!currentBookingId) {
                    setBuyError('Database did not return a valid Booking ID.');
                    setBuying(false);
                    return;
                }

                sessionStorage.setItem('tix_pending_booking_id', currentBookingId as string);
                sessionStorage.setItem('tix_cart', JSON.stringify({
                    movie: selectedMovie, showtime: selectedShowtime,
                    seats: selectedSeatIds, labels: selectedSeatLabels
                }));
            }

            const stripeResult = await createStripeCheckoutSession({
                totalAmount,
                movieName: selectedMovie!.name,
                seatLabels: selectedSeatLabels.join(', '),
                bookingId: currentBookingId as string,
                showtimeId: selectedShowtime!.id,
                urlMovieId: movieId,
                userId: user.id,
            })

            if (!stripeResult.success || !stripeResult.url) {
                setBuyError(stripeResult.error ?? 'Failed to create payment session')
                setBuying(false)
                return
            }

            isRedirectingRef.current = true;

            window.location.href = stripeResult.url

        } catch (err) {
            console.error("Payment error:", err);
            setBuyError('Something went wrong. Please try again.')
            setBuying(false)
        }
    }
    if (!selectedMovie || !selectedShowtime || selectedSeatIds.length === 0) {
        router.replace('/');
    }

    return (
        <div className='mb-30'>
            <div className="px-6 md:px-16 pt-11">
                <div>
                    <Typography variant='h2' color='shade-900'>PAYMENT CONFIRMATION</Typography>
                    <Typography color='shade-600' className='mt-2'>
                        Confirm payment for the seat you ordered
                    </Typography>
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between px-6 md:px-16 gap-8 sm:gap-20 mt-4 sm:mt-20'>
                <div className='max-w-106 sm:w-106'>
                    <Typography variant='h3' color='shade-900'>Schedule Details</Typography>

                    <Typography color='shade-700' className='mb-2 mt-4'>Movie Title</Typography>
                    <Typography variant='h3' color='shade-900' className='sm:mb-4'>
                        {selectedMovie?.name}
                    </Typography>
                    <hr className='w-full h-px text-shade-200' />

                    <Typography color='shade-700' className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Date</Typography>
                    <Typography variant='h3' color='shade-900' className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                        {selectedShowtime?.show_time ? formatShowDate(selectedShowtime.show_time) : 'N/A'}
                    </Typography>
                    <hr className='w-full h-px text-shade-200' />

                    <div className='flex gap-19'>
                        <div>
                            <Typography color='shade-700' className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Screen</Typography>
                            <Typography variant='h3' color='shade-900' className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                                {selectedShowtime?.screen?.name ?? 'N/A'}
                            </Typography>
                        </div>

                        <div>
                            <Typography color='shade-700' className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Time</Typography>
                            <Typography variant='h3' color='shade-900' className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                                {selectedShowtime?.show_time ? formatShowtime(selectedShowtime.show_time) : 'N/A'}
                            </Typography>
                        </div>
                    </div>
                    <hr className='w-full h-px text-shade-200' />

                    <Typography color='shade-700' className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Seats ({selectedSeatIds.length})</Typography>
                    <Typography variant='h3' color='shade-900' className='max-w-60 text-shade-900 font-medium text-lg sm:text-2xl mb-4'>
                        {selectedSeatLabels.join(', ')}
                    </Typography>
                    <hr className='w-full h-px text-shade-200' />

                    <button
                        onClick={() => setShowBackModal(true)}
                        className="flex items-center gap-4 text-white cursor-pointer mt-4 sm:mt-15"
                    >
                        <GoArrowLeft className="text-xl sm:text-[24px] text-shade-600" />
                        <span className="font-bold text-xl sm:text-[24px] text-shade-600">Return</span>
                    </button>
                </div>


                <div className='sm:w-125 pt-6.5 pr-12 pb-12 pl-8 border rounded-[13px] border-[#c4c4c4] shadow-md'>
                    <Typography variant='h3' color='shade-900'>Order Summary</Typography>

                    <div className='text-shade-900 font-bold text-[12px] sm:text-[16px] mt-8 mb-4 sm:mb-4'>Transaction Details</div>

                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            {selectedShowtime?.screen?.name?.toUpperCase() ?? 'SEAT'}
                        </span>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            ₹{seatPrice.toLocaleString('en-IN')}
                            <span className='text-shade-700 font-bold text-[16px] ml-1'>x{seatCount}</span>
                        </span>
                    </div>

                    <div className='flex justify-between items-center mb-4'>
                        <span className='text-shade-900 text-[16px]'>Service Fee</span>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            ₹{serviceFee.toLocaleString('en-IN')}
                            <span className='text-shade-700 font-bold text-[16px] ml-1'>x{seatCount}</span>
                        </span>
                    </div>

                    <hr className='w-full h-px text-shade-200' />

                    <div className='flex justify-between items-center my-4'>
                        <span className='text-shade-900 text-[16px]'>Subtotal</span>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            ₹{totalPrice.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className='text-shade-900 font-bold text-[12px] sm:text-[16px] mt-8 '>Promo & Voucher</div>
                    {discountId ? (
                        <div className='mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4'>
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
                                    x
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='mb-4 mt-4'>
                            <div className='flex flex-wrap gap-2'>
                                <input
                                    type='text'
                                    value={discountInput}
                                    onChange={(e) => {
                                        setDiscountInput(e.target.value.toUpperCase())
                                        setDiscountError('')
                                    }}
                                    placeholder='Enter promo code'
                                    className='min-w-20 flex-1 border border-shade-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-royal-blue'
                                />
                                <button
                                    onClick={handleApplyDiscount}
                                    disabled={discountLoading || !discountInput.trim()}
                                    className='px-4 py-2 bg-royal-blue text-white text-sm font-medium rounded-lg hover:bg-royal-blue-hover disabled:opacity-50 cursor-pointer transition-all'
                                >
                                    {discountLoading ? 'Loading...' : 'Apply'}
                                </button>
                            </div>
                            {discountError && (
                                <div className='text-red-500 text-xs mt-1'>{discountError}</div>
                            )}
                        </div>
                    )}
                    <hr className='w-full h-px text-shade-200 mt-7' />

                    <div className='flex justify-between font-bold text-shade-900 text-base my-4.5'>
                        <span>Total Payment</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <hr className='w-full h-px text-shade-200' />

                    <div className='text-sky-blue font-bold text-[12px] sm:text-[16px] mt-8 mb-4'>Pay With Stripe</div>


                    <div className='text-xs text-red-400 mb-4'>
                        * Ticket purchases cannot be cancelled
                    </div>

                    {buyError && (
                        <div className='text-red-500 text-sm font-medium mb-4 bg-red-50 p-3 rounded-lg border border-red-200'>
                            {buyError}
                        </div>
                    )}

                    <button
                        onClick={handleBuy}
                        disabled={buying}
                        className='w-full bg-royal-blue text-sunshine-yellow font-medium text-xl sm:text-2xl py-2 sm:py-4 rounded-xl hover:bg-royal-blue-hover transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wide'
                    >
                        {buying ? 'PROCESSING...' : 'BUY TICKET'}
                    </button>
                </div>
            </div>

            {showBackModal && (
                <ConfirmModal
                    isOpen={showBackModal}
                    onClose={() => setShowBackModal(false)}
                    onConfirm={handleBackConfirm}
                    title="Want to go back?"
                    description="The seats you selected will be released and you will need to select again."
                    confirmText={buying ? 'Cancelling...' : 'Go Back'}
                    isLoading={buying}
                />
            )}
        </div>
    )
}