'use server'

import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export async function verifyAndSavePayment(sessionId: string, bookingId: string) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { success: false, error: 'Payment was not completed.' };
    }

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('payment_status')
      .eq('booking_id', bookingId)
      .single();

    if (existingPayment?.payment_status === 'succeeded') {
      return { success: true, message: 'Payment already processed.' };
    }
    
    const { data: bookingData, error: fetchError } = await supabase
      .from('bookings')
      .select('discount_id')
      .eq('id', bookingId)
      .single();

    if (fetchError) throw new Error(`Booking Fetch Error: ${fetchError.message}`);

    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        payment_status: 'succeeded',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: session.customer as string,
      })
      .eq('booking_id', bookingId);

    if (paymentError) throw new Error(`Payment Update Error: ${paymentError.message}`);

    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ booking_status: 'paid' })
      .eq('id', bookingId);

    if (bookingError) throw new Error(`Booking Update Error: ${bookingError.message}`);

    const { error: seatsError } = await supabase
      .from('booking_seats')
      .update({ booking_seat_status: 'confirmed' })
      .eq('booking_id', bookingId);

    if (seatsError) throw new Error(`Seats Update Error: ${seatsError.message}`);

    if (bookingData.discount_id) {
      const { error: rpcError } = await supabase.rpc('increment_discount_usage', {
        d_id: bookingData.discount_id
      });
      if (rpcError) {
        console.error("Failed to increment discount count:", rpcError);
      }
    }

    revalidatePath('/tickets');
    revalidatePath(`/tickets/${bookingId}`);

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