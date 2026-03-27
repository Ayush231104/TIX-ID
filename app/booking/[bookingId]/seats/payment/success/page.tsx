'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { resetBooking } from '@/lib/features/slice/bookingSlice'
import Link from 'next/link'

export default function BookingSuccessPage() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(resetBooking())
    }, [dispatch])

    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 mt-10'>
            <h1 className='text-[56px] md:text-5xl font-bold text-shade-900 mb-8 text-center'>
                Payment Successful! 
            </h1>

            <div className='text-8xl mb-8'>
                🎬🍿
            </div>
            <p className='text-shade-600 text-center max-w-md text-sm md:text-base mb-10'>
                Transaction details have been sent to your email, you can also check the ticket details in My Tickets on the website or your smartphone.
            </p>

            <Link 
                href="/tickets"
                className='px-10 py-3 border-2 border-shade-300 text-shade-600 font-bold rounded-lg hover:bg-shade-100 transition-all cursor-pointer'
            >
                My Tickets
            </Link>
        </div>
    )
}