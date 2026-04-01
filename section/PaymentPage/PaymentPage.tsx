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
import toast from 'react-hot-toast';
import { cancelPaymentAndBooking } from '@/actions/paymentVerification';

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

    // ── Local State ──
    const [showBackModal, setShowBackModal] = useState(false)
    const [discountInput, setDiscountInput] = useState('')
    const [discountError, setDiscountError] = useState('')
    const [discountLoading, setDiscountLoading] = useState(false)
    const [buying, setBuying] = useState(false)
    const [buyError, setBuyError] = useState('')

    const [timeLeft, setTimeLeft] = useState(600);
    const timerRef = useRef<NodeJS.Timeout | null>(null);


    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleTimeout = async () => {
        toast.error("Time expired! Your seats have been released.");
        const currentBookingId = sessionStorage.getItem('tix_pending_booking_id');

        if (currentBookingId) {
            await cancelPaymentAndBooking(currentBookingId);
        } else if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            await releaseSeats(selectedShowtime.id, selectedSeatIds);
        }

        dispatch(resetBooking());
        sessionStorage.removeItem('tix_cart');
        sessionStorage.removeItem('tix_pending_booking_id');
        router.push(`/booking/${movieId}`);
    }

        // HYDRATION GUARD: Survives Refresh & Stripe "Back" Button
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

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [selectedMovie, selectedShowtime, selectedSeatIds.length, movieId, router, dispatch, ]);

    // BUTTON HANDLERS
    const handleBackConfirm = async () => {
        setBuying(true); // Disable buttons while cancelling
        const currentBookingId = sessionStorage.getItem('tix_pending_booking_id');

        if (currentBookingId) {
            // IF THEY ALREADY CLICKED "BUY TICKET", WE MUST CANCEL THE REAL BOOKING!
            await cancelPaymentAndBooking(currentBookingId);
        } else if (selectedShowtime?.id && selectedSeatIds.length > 0) {
            // IF THEY NEVER CLICKED "BUY TICKET", JUST RELEASE THE TEMPORARY LOCK
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

                // Save the NEW valid booking ID and Cart to session storage
                sessionStorage.setItem('tix_pending_booking_id', currentBookingId as string);
                sessionStorage.setItem('tix_cart', JSON.stringify({
                    movie: selectedMovie, showtime: selectedShowtime,
                    seats: selectedSeatIds, labels: selectedSeatLabels
                }));
            }

            // ── Proceed to Stripe as normal ──
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
                // Do NOT wipe the pending ID here, they might just want to try clicking Buy again
                return 
            }

            window.location.href = stripeResult.url

        } catch (err) {
            console.error("Payment error:", err);
            setBuyError('Something went wrong. Please try again.')
            setBuying(false)
        }
    }
    if (!selectedMovie || !selectedShowtime) return null;

    return (
        <div className='mb-30'>
            <div className="px-6 md:px-16 pt-11">
                <div>
                    <h1 className='text-xl md:text-2xl lg:text-4xl font-bold text-shade-900'>PAYMENT CONFIRMATION</h1>
                    <p className='text-shade-600 text-[12px] md:text-[16px] mt-2'>
                        Confirm payment for the seat you ordered
                    </p>
                </div>
                <div>
                    <span className="text-sm text-shade-600">Complete payment in:</span>
                    <span className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-royal-blue'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className='flex flex-col md:flex-row px-6 md:px-16 gap-8 sm:gap-20 mt-4 sm:mt-20'>
                <div className='max-w-106 sm:w-106'>
                    <div className='text-shade-900 font-medium text-lg sm:text-2xl leading-8'>Schedule Details</div>

                    <div className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Movie Title</div>
                    <div className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                        {selectedMovie?.name}
                    </div>
                    <hr className='w-full h-px text-shade-200' />

                    <div className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Date</div>
                    <div className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                        {selectedShowtime?.show_time ? formatShowDate(selectedShowtime.show_time) : 'N/A'}
                    </div>
                    <hr className='w-full h-px text-shade-200' />

                    <div className='flex gap-19'>
                        <div>
                            <div className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Screen</div>
                            <div className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                                {selectedShowtime?.screen?.name ?? 'N/A'}
                            </div>
                        </div>

                        <div>
                            <div className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Time</div>
                            <div className='text-shade-900 font-medium text-lg sm:text-2xl sm:mb-4'>
                                {selectedShowtime?.show_time ? formatShowtime(selectedShowtime.show_time) : 'N/A'}
                            </div>
                        </div>
                    </div>
                    <hr className='w-full h-px text-shade-200' />

                    <div className='text-shade-700 font-normal text-xs sm:text-[16px] mb-2 mt-4'>Seats ({selectedSeatIds.length})</div>
                    <div className='text-shade-900 font-medium text-lg sm:text-2xl mb-4'>
                        {selectedSeatLabels.join(', ')}
                    </div>
                    <hr className='w-full h-px text-shade-200' />

                    <button
                        onClick={() => setShowBackModal(true)}
                        className="flex gap-4 text-white cursor-pointer mt-4 sm:mt-15"
                    >
                        <GoArrowLeft className="text-xl sm:text-[24px] text-shade-600" />
                        <span className="font-bold text-xl sm:text-[24px] text-shade-600">Return</span>
                    </button>
                </div>


                <div className='sm:w-125 pt-6.5 pr-12 pb-12 pl-8 border rounded-[13px] border-[#c4c4c4] shadow-md'>
                    <div className='text-shade-900 font-medium text-lg sm:text-2xl leading-8'>Order Summary</div>

                    <div className='text-shade-900 font-bold text-[12px] sm:text-[16px] mt-8 mb-4 sm:mb-16'>Transaction Details</div>

                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            {selectedShowtime?.screen?.name?.toUpperCase() ?? 'SEAT'}
                        </span>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            ₹{seatPrice.toLocaleString('en-IN')}
                            <span className='text-shade-700 font-bold text-[16px] ml-1'>x{seatCount}</span>
                        </span>
                    </div>

                    <div className='flex justify-between items-center mb-7'>
                        <span className='text-shade-900 text-[16px]'>Service Fee</span>
                        <span className='text-shade-900 text-[16px] font-normal'>
                            ₹{serviceFee.toLocaleString('en-IN')}
                            <span className='text-shade-700 font-bold text-[16px] ml-1'>x{seatCount}</span>
                        </span>
                    </div>

                    <hr className='w-full h-px text-shade-200' />

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
                                    {discountLoading ? '...' : 'Apply'}
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
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-xl font-bold text-shade-900'>Want to go back?</h2>
                            <button onClick={() => setShowBackModal(false)} className='text-shade-400 hover:text-shade-900 text-2xl cursor-pointer'>x</button>
                        </div>
                        <p className='text-shade-600 text-sm mb-6'>The seats you selected will be released and you will need to select again.</p>
                        <div className='flex gap-3 justify-end'>
                            <button onClick={() => setShowBackModal(false)} className='px-6 py-2.5 border border-shade-300 rounded-xl text-shade-900 hover:bg-shade-100 transition-all cursor-pointer'>Cancel</button>
                            <button onClick={handleBackConfirm} disabled={buying} className='px-6 py-2.5 bg-royal-blue text-white font-bold rounded-xl hover:bg-royal-blue-hover transition-all cursor-pointer'>
                                {buying ? 'Cancelling...' : 'Go Back'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}