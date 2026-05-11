import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

// Next.js 13+ App Router: deshabilitar body parsing para Stripe webhook
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === 'paid') {
      const { error } = await supabaseAdmin
        .from('contratos')
        .update({
          status: 'paid',
          stripe_payment_id: session.payment_intent as string,
          paid_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', session.id);

      if (error) {
        console.error('[webhook] Supabase update error:', error);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      console.log(`[webhook] Contrato pagado: session=${session.id} folio=${session.metadata?.folio}`);
    }
  }

  return NextResponse.json({ received: true });
}
