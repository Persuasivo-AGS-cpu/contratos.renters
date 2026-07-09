import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendContractEmail, sendSaleNotification } from '@/lib/email';
import Stripe from 'stripe';

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
      // Update condicional pending→paid: si Stripe reintenta el webhook, la fila
      // ya está en 'paid', el update no matchea y no se reenvían los emails.
      const { data: updated, error } = await supabaseAdmin
        .from('contratos')
        .update({
          status: 'paid',
          stripe_payment_id: session.payment_intent as string,
          paid_at: new Date().toISOString(),
          monto_pagado: session.amount_total, // centavos MXN
        })
        .eq('stripe_session_id', session.id)
        .eq('status', 'pending')
        .select('pdf_token, arrendador_nombre, arrendador_email, inquilino_email, estado');

      if (error) {
        console.error('[webhook] Supabase update error:', error);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      const contrato = updated?.[0];

      if (contrato) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contratos.renters.mx';
        const downloadUrl = `${appUrl}/api/pdf?token=${contrato.pdf_token}`;
        const folio = session.metadata?.folio || '';

        // Notificación de venta al dueño (una vez por venta, gracias al update condicional)
        try {
          await sendSaleNotification({
            folio,
            estado: contrato.estado,
            montoCentavos: session.amount_total,
            arrendadorNombre: contrato.arrendador_nombre,
            arrendadorEmail: contrato.arrendador_email,
          });
        } catch (notifErr) {
          console.error('[webhook] Sale notification failed:', notifErr);
        }

        const recipients = [
          { email: contrato.arrendador_email, name: contrato.arrendador_nombre || 'Arrendador' },
          { email: contrato.inquilino_email, name: 'Inquilino' },
        ].filter((r) => r.email);

        for (const recipient of recipients) {
          try {
            await sendContractEmail({
              toEmail: recipient.email!,
              toName: recipient.name,
              folio,
              estado: contrato.estado,
              downloadUrl,
            });
          } catch (emailErr) {
            console.error(`[webhook] Email failed for ${recipient.email}:`, emailErr);
          }
        }
      }

      console.log(`[webhook] Contrato pagado: session=${session.id} folio=${session.metadata?.folio}`);
    }
  }

  return NextResponse.json({ received: true });
}
