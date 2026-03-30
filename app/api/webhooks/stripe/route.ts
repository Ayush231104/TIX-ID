import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia' 
});

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('[WEBHOOK] Missing stripe signature');
      return new NextResponse('Missing stripe signature', { status: 400 });
    }

    if (!body) {
      console.error('[WEBHOOK] Empty body received');
      return new NextResponse('Empty body', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[WEBHOOK] Signature verification failed:`, errorMessage);
      return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const userId = session.metadata?.userId;

    if (!bookingId || !userId) {
      return new NextResponse('Missing metadata, ignoring', { status: 200 });
    }

    // 🛠️ FIX: Create the clean Admin Client INSIDE the request
    const supabaseAdmin = createAdminClient();

    if (event.type === 'checkout.session.completed') {
      console.log(`[WEBHOOK] Processing successful payment for ${bookingId}`);

      await supabaseAdmin.from('payments').update({
        amount: session.amount_total ? session.amount_total / 100 : 0, 
        payment_status: 'succeeded',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: session.customer as string,
      }).eq('booking_id', bookingId);

      await supabaseAdmin.from('bookings').update({ booking_status: 'paid' }).eq('id', bookingId);
      await supabaseAdmin.from('booking_seats').update({ booking_seat_status: 'confirmed' }).eq('booking_id', bookingId);
      
    } else if (event.type === 'checkout.session.expired') {
      console.log(`[WEBHOOK] Session expired! Releasing seats for ${bookingId}`);

      await supabaseAdmin.from('payments').update({ payment_status: 'failed' }).eq('booking_id', bookingId);
      await supabaseAdmin.from('bookings').update({ booking_status: 'cancelled' }).eq('id', bookingId);
      await supabaseAdmin.from('booking_seats').update({ booking_seat_status: 'cancelled' }).eq('booking_id', bookingId);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });

  } catch (error: unknown) {
    console.error('[WEBHOOK] Critical error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}