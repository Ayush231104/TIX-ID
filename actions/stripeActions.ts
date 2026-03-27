'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    
})

interface CheckoutData {
    totalAmount: number
    movieName: string
    seatLabels: string
    bookingId: string
    showtimeId: string
    userId: string
}

// export async function createStripeCheckoutSession(data: CheckoutData) {
//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             mode: 'payment',
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'inr',
//                         product_data: {
//                             name: data.movieName,
//                             description: `Seats: ${data.seatLabels}`,
//                         },
//                         unit_amount: data.totalAmount * 100, // Convert to paise
//                     },
//                     quantity: 1,
//                 }
//             ],
//             metadata: {
//                 bookingId: data.bookingId,
//                 showtimeId: data.showtimeId,
//             },
//             success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?bookingId=${data.bookingId}`,
//             cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel?bookingId=${data.bookingId}`,
//         })
//         return { success: true, url: session.url }
//     } catch (error: unknown) {
//     console.error('Stripe session creation error:', error)
//         const errorMessage = error instanceof Error 
//       ? error.message 
//       : 'An unknown error occurred with Stripe'
      
//     return { success: false, error: errorMessage }
//   }
// }

export async function createStripeCheckoutSession(data: CheckoutData) {
  try {
    // Add a fallback so it ALWAYS has a valid scheme
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
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
      // Use the robust baseUrl here
      success_url: `${baseUrl}/booking/${data.bookingId}/seats/payment/success?bookingId=${data.bookingId}`,
      cancel_url: `${baseUrl}/booking/${data.bookingId}/seats/payment/cancel?bookingId=${data.bookingId}`,
    })

    return { success: true, url: session.url }
  } catch (error: unknown) {
    console.error('Stripe session creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown Stripe error'
    return { success: false, error: errorMessage }
  }
}

