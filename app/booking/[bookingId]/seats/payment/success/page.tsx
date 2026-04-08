'use client'

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyAndSavePayment } from '@/actions/paymentVerification';
import { useAppDispatch } from '@/lib/hooks';
import { resetBooking } from '@/lib/features/slice/bookingSlice';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Grab the IDs from the Stripe redirect URL
    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('bookingId');

    const isMissingParams = !sessionId || !bookingId;

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
        isMissingParams ? 'error' : 'loading'
    );
    const [errorMessage, setErrorMessage] = useState(
        isMissingParams ? 'Missing payment information in the URL.' : ''
    );
    
    const hasVerified = useRef(false); 

    useEffect(() => {
        if (isMissingParams || hasVerified.current) return;
        
        hasVerified.current = true;

        const verifyPayment = async () => {
            try {
                const result = await verifyAndSavePayment(sessionId, bookingId);
                if (result.success) {
                    setStatus('success');
                    dispatch(resetBooking());
                    sessionStorage.removeItem('tix_cart');
                } else {
                    setStatus('error');
                    setErrorMessage(result.error || 'Payment verification failed.');
                }
            } catch (error: unknown) {
                console.error('Payment verification error:', error);
                setStatus('error');
                setErrorMessage('An unexpected error occurred.');
            }
        };

        verifyPayment();
    }, [sessionId, bookingId, dispatch, isMissingParams]); // Added isMissingParams to deps

    // --- UI STATES ---

    if (status === 'loading') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold text-shade-900">Verifying your payment...</h2>
                <p className="text-shade-600 mt-2">Please do not close or refresh this page.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-2xl font-bold text-shade-900 mb-2">Something went wrong</h2>
                <p className="text-shade-600 mb-6">{errorMessage}</p>
                <button 
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-royal-blue text-white rounded-xl font-medium hover:bg-royal-blue-hover transition"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 mt-10'>
            {status === 'success' && (
                <>
                    <h1 className='text-4xl md:text-5xl font-bold text-shade-900 mb-8 text-center'>
                        Payment Successful!
                    </h1>
                    <div className='text-8xl mb-8'>🎬🍿</div>
                    <p className='text-shade-600 text-center max-w-md text-sm md:text-base mb-10'>
                        Transaction details have been sent to your email, you can also check the ticket details in my tickets on the website or your smartphone.
                    </p>
                    <Link
                        href={`/tickets/${bookingId}`} 
                        className='px-10 py-3 border-2 border-shade-300 text-shade-900 font-bold rounded-lg hover:bg-shade-100 transition-all cursor-pointer'
                    >
                        Check Transaction Details
                    </Link>
                </>
            )}
        </div>
    );
}