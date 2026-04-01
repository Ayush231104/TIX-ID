'use server'

import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
})

interface CheckoutData {
    totalAmount: number
    movieName: string
    seatLabels: string
    bookingId: string
    showtimeId: string
    userId: string
    urlMovieId: string
}

export async function createStripeCheckoutSession(data: CheckoutData) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: data.movieName,
                            description: `Seats: ${data.seatLabels}`,
                        },
                        unit_amount: Math.round(data.totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: data.bookingId,
                showtimeId: data.showtimeId,
                userId: data.userId,
            },
            // Use urlMovieId for the folder path, and bookingId for the query parameter!
            success_url: `${baseUrl}/booking/${data.urlMovieId}/seats/payment/success?bookingId=${data.bookingId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/booking/${data.urlMovieId}/seats/payment/cancel?bookingId=${data.bookingId}`,
        })

        const supabase = await createClient()
        const { data: existingPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('booking_id', data.bookingId)
            .maybeSingle();

        if (!existingPayment) {
            const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                booking_id: data.bookingId,
                user_id: data.userId,
                amount: data.totalAmount,
                currency: 'INR',
                payment_method: 'card',
                payment_status: 'pending',
            })

            if (paymentError) {
                console.error('Failed to insert pending payment:', paymentError)
                return { success: false, error: 'Database error creating payment' }
            }
        }

        return { success: true, url: session.url }

    } catch (error: unknown) {
        console.error('Stripe session creation error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown Stripe error'
        return { success: false, error: errorMessage }
    }
}