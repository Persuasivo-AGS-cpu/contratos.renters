import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLAN_PRICES, PLAN_NAMES, generateFolio } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Máx 5 sesiones de checkout por IP por 10 minutos
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit('checkout', ip, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en unos minutos.' }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { contract, plan } = body;

    if (!contract || !plan) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan];
    if (!amount) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // El folio va en la metadata de Stripe antes del insert, así que se verifica
    // disponibilidad aquí; la colisión de Math.random (5 dígitos) es rara pero
    // con volumen pasa, y sin esto el insert fallaría con UNIQUE ya cobrando.
    let folio = generateFolio(contract.state);
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: existing } = await supabaseAdmin
        .from('contratos')
        .select('id')
        .eq('folio', folio)
        .maybeSingle();
      if (!existing) break;
      folio = generateFolio(contract.state);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: PLAN_NAMES[plan],
              description: `Folio: ${folio} — ${contract.state?.toUpperCase()} — ${contract.landlord?.name || ''} / ${contract.tenant?.name || ''}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/contrato?cancelled=1`,
      customer_email: contract.landlord?.email || contract.tenant?.email || undefined,
      metadata: {
        folio,
        estado: contract.state,
        plan,
        arrendador_email: contract.landlord?.email || '',
        inquilino_email: contract.tenant?.email || '',
      },
    });

    // Guardar contrato pendiente en Supabase
    const { error: insertError } = await supabaseAdmin.from('contratos').insert({
      folio,
      estado: contract.state,
      tipo_propiedad: contract.property?.type || null,
      arrendador_nombre: contract.landlord?.name || null,
      arrendador_email: contract.landlord?.email || null,
      inquilino_nombre: contract.tenant?.name || null,
      inquilino_email: contract.tenant?.email || null,
      monto_renta: contract.terms?.monthly_rent || null,
      deposito: contract.terms?.deposit_amount || null,
      duracion_meses: contract.terms?.lease_duration_months || null,
      stripe_session_id: session.id,
      contract_data: contract,
      status: 'pending',
    });

    if (insertError) {
      console.error('[checkout] insert error:', insertError);
      return NextResponse.json({ error: 'Error al crear sesión de pago' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Error al crear sesión de pago' }, { status: 500 });
  }
}
