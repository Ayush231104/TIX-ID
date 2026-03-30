'use server'

import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe (ensure API version matches your needs if required)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export async function verifyAndSavePayment(sessionId: string, bookingId: string) {
  try {
    const supabase = await createClient();
    
    // 1. Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // 2. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return { success: false, error: 'Payment was not completed.' };
    }

    // 3. Check the current status of the payment to prevent double-processing
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('payment_status')
      .eq('booking_id', bookingId)
      .single();

    // If it's already succeeded, we don't need to do anything else
    if (existingPayment?.payment_status === 'succeeded') {
      return { success: true, message: 'Payment already processed.' };
    }

    // 4. UPDATE the existing pending payment to 'succeeded'
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        payment_status: 'succeeded',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: session.customer as string,
      })
      .eq('booking_id', bookingId);

    if (paymentError) throw new Error(`Payment Update Error: ${paymentError.message}`);

    // 5. Update bookings to 'paid'
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ booking_status: 'paid' })
      .eq('id', bookingId);

    if (bookingError) throw new Error(`Booking Update Error: ${bookingError.message}`);

    // 6. Update seats to 'confirmed'
    const { error: seatsError } = await supabase
      .from('booking_seats')
      .update({ booking_seat_status: 'confirmed' })
      .eq('booking_id', bookingId);

    if (seatsError) throw new Error(`Seats Update Error: ${seatsError.message}`);

    return { success: true };

  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment.';
    return { success: false, error: errorMessage };
  }
}

export async function cancelPaymentAndBooking(bookingId: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // 1. Mark payment as failed
    const { error: paymentError } = await supabase
      .from('payments')
      .update({ payment_status: 'failed' })
      .eq('booking_id', bookingId)
      .eq('user_id', user.id); // Security check

    if (paymentError) throw new Error(paymentError.message);

    // 2. Mark booking as cancelled
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ booking_status: 'cancelled' })
      .eq('id', bookingId);
      
    if (bookingError) throw new Error(bookingError.message);

    // 3. Mark seats as cancelled (This frees them up in your UI)
    const { error: seatsError } = await supabase
      .from('booking_seats')
      .update({ booking_seat_status: 'cancelled' })
      .eq('booking_id', bookingId);

    if (seatsError) throw new Error(seatsError.message);

    return { success: true };

  } catch (error: unknown) {
    console.error('Cancellation error:', error);
    return { success: false, error: 'Failed to cancel booking.' };
  }
}