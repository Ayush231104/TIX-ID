'use client'

import { useRouter } from 'next/navigation'

export default function BookingCancelPage() {
    const router = useRouter()

    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 mt-10'>
            <div className='text-8xl mb-8'>
                😕
            </div>
            
            <h1 className='text-3xl md:text-4xl font-bold text-shade-900 mb-4 text-center'>
                Pembayaran Dibatalkan
            </h1>
            
            <p className='text-shade-600 text-center max-w-md mb-10'>
                Anda membatalkan proses pembayaran. Kursi Anda masih terkunci selama beberapa menit, Anda dapat mencoba lagi.
            </p>

            <button 
                onClick={() => router.back()} // Sends them right back to the payment page
                className='px-10 py-3 bg-royal-blue text-white font-bold rounded-lg hover:bg-royal-blue-hover transition-all cursor-pointer'
            >
                Coba Lagi
            </button>
        </div>
    )
}