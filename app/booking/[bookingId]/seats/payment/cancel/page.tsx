'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/lib/hooks'
import { resetBooking } from '@/lib/features/slice/bookingSlice'
import { cancelPaymentAndBooking } from '@/actions/paymentVerification'

export default function BookingCancelPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    
    const bookingId = searchParams.get('bookingId')
    const [status, setStatus] = useState<'loading' | 'cancelled' | 'error'>(
        bookingId ? 'loading' : 'error'
    )

    useEffect(() => {
        dispatch(resetBooking())

        if (bookingId) {
            cancelPaymentAndBooking(bookingId).then((result) => {
                if (result.success) {
                    setStatus('cancelled')
                } else {
                    setStatus('error')
                }
            })
        }
    }, [dispatch, bookingId])

    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 mt-10'>
            {status === 'loading' && (
                <div className="text-xl text-shade-600 font-medium animate-pulse">
                    Cancelling your order...
                </div>
            )}

            {status === 'cancelled' && (
                <>
                    <h1 className='text-3xl md:text-4xl font-bold text-shade-900 mb-4 text-center'>
                        Payment Cancelled
                    </h1>
                    <p className='text-shade-600 text-center max-w-md mb-10'>
                        You have cancelled the payment process. Your seats have been released and can be booked by others.
                    </p>
                    <button 
                        onClick={() => router.back()} 
                        className='px-10 py-3 bg-royal-blue text-white font-bold rounded-lg hover:bg-royal-blue-hover transition-all cursor-pointer'
                    >
                        Try Again
                    </button>
                </>
            )}

            {status === 'error' && (
                <>
                    <h1 className='text-3xl font-bold text-red-600 mb-4 text-center'>
                        An Error Occurred
                    </h1>
                    <p className='text-shade-600 text-center max-w-md mb-10'>
                        We could not cancel the order automatically. Please contact support.
                    </p>
                </>
            )}
        </div>
    )
}