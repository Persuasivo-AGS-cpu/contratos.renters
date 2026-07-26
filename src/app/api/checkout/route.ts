import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLAN_PRICES, PLAN_NAMES, generateFolio, getFolioPrefix } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getAppUrl } from '@/lib/appUrl';

// Máx 5 sesiones de checkout por IP por 10 minutos
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {};
}

function valueAt(value: unknown, ...path: string[]) {
  return path.reduce<unknown>((current, key) => asRecord(current)[key], value);
}

function isNonEmpty(value: unknown, minLength = 1) {
  return typeof value === 'string' && value.trim().length >= minLength;
}

function hasCompleteAddress(contract: unknown) {
  return (
    isNonEmpty(valueAt(contract, 'property', 'address', 'street'), 2) &&
    isNonEmpty(valueAt(contract, 'property', 'address', 'ext_num'), 1) &&
    isNonEmpty(valueAt(contract, 'property', 'address', 'neighborhood'), 2) &&
    isNonEmpty(valueAt(contract, 'property', 'address', 'municipality'), 2) &&
    isNonEmpty(valueAt(contract, 'property', 'address', 'zip_code'), 5) &&
    isNonEmpty(valueAt(contract, 'property', 'address', 'state'), 2)
  );
}

function validateContractForCheckout(contract: unknown) {
  const missing: string[] = [];

  // Arrendador sin inquilino todavía: el contrato se genera con el bloque del
  // inquilino en blanco (ya lo resuelven las plantillas con "___" cuando el
  // valor viene vacío) para llenarse a mano al momento de la firma.
  const tenantPending = !!valueAt(contract, 'tenant', 'pending');

  if (!isNonEmpty(valueAt(contract, 'state'))) missing.push('estado');
  if (!isNonEmpty(valueAt(contract, 'property', 'type'))) missing.push('tipo de propiedad');
  if (!hasCompleteAddress(contract)) missing.push('dirección completa del inmueble');
  if (!isNonEmpty(valueAt(contract, 'landlord', 'name'), 4)) missing.push('nombre del arrendador');
  if (!tenantPending && !isNonEmpty(valueAt(contract, 'tenant', 'name'), 4)) missing.push('nombre del inquilino');
  if (!isNonEmpty(valueAt(contract, 'landlord', 'email')) || !String(valueAt(contract, 'landlord', 'email')).includes('@')) missing.push('correo del arrendador');
  if (!tenantPending && (!isNonEmpty(valueAt(contract, 'tenant', 'email')) || !String(valueAt(contract, 'tenant', 'email')).includes('@'))) missing.push('correo del inquilino');
  if (!isNonEmpty(valueAt(contract, 'landlord', 'phone'), 10)) missing.push('teléfono del arrendador');
  if (!tenantPending && !isNonEmpty(valueAt(contract, 'tenant', 'phone'), 10)) missing.push('teléfono del inquilino');
  if (!isNonEmpty(valueAt(contract, 'landlord', 'address'), 6)) missing.push('domicilio del arrendador');
  if (!valueAt(contract, 'landlord', 'id_number_pending') && !isNonEmpty(valueAt(contract, 'landlord', 'id_number'), 18)) missing.push('INE del arrendador');
  if (!tenantPending && !valueAt(contract, 'tenant', 'id_number_pending') && !isNonEmpty(valueAt(contract, 'tenant', 'id_number'), 18)) missing.push('INE del inquilino');
  if (!Number.isFinite(Number(valueAt(contract, 'terms', 'monthly_rent'))) || Number(valueAt(contract, 'terms', 'monthly_rent')) <= 0) missing.push('monto de renta');
  if (!Number.isFinite(Number(valueAt(contract, 'terms', 'deposit_amount'))) || Number(valueAt(contract, 'terms', 'deposit_amount')) < 0) missing.push('depósito');
  if (!Number.isFinite(Number(valueAt(contract, 'terms', 'lease_duration_months'))) || Number(valueAt(contract, 'terms', 'lease_duration_months')) <= 0) missing.push('duración');
  if (!isNonEmpty(valueAt(contract, 'terms', 'lease_start_date'))) missing.push('fecha de inicio');
  if (!Number.isFinite(Number(valueAt(contract, 'terms', 'payment_day'))) || Number(valueAt(contract, 'terms', 'payment_day')) <= 0) missing.push('día de pago');
  if (!valueAt(contract, 'terms', 'bank_details_pending') && !isNonEmpty(valueAt(contract, 'terms', 'bank_clabe'), 18)) missing.push('CLABE');

  return missing;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit('checkout', ip, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en unos minutos.' }, { status: 429 });
  }
  try {
    const body = await req.json() as { contract?: JsonRecord; plan?: keyof typeof PLAN_PRICES; variant?: unknown };
    const { contract, plan, variant } = body;

    if (!contract || !plan) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const missingFields = validateContractForCheckout(contract);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan datos obligatorios: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[plan];
    if (!amount) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const contractState = String(valueAt(contract, 'state'));
    const landlordEmail = String(valueAt(contract, 'landlord', 'email') || '');
    const tenantEmail = String(valueAt(contract, 'tenant', 'email') || '');

    // Folio legible: CÓDIGO-AÑO-DDMM-secuencia (ej. COAH-2026-1807-1 = primer
    // contrato de Coahuila ese día). La secuencia parte del conteo de folios
    // existentes con ese mismo prefijo; el retry cubre la carrera entre el
    // conteo y el insert (dos checkouts del mismo estado el mismo día casi
    // simultáneos) — sin esto el insert fallaría con UNIQUE ya cobrando.
    const folioPrefix = getFolioPrefix(contractState);
    const { count: existingCount } = await supabaseAdmin
      .from('contratos')
      .select('id', { count: 'exact', head: true })
      .like('folio', `${folioPrefix}-%`);
    let seq = (existingCount ?? 0) + 1;
    let folio = generateFolio(contractState, seq);
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: existing } = await supabaseAdmin
        .from('contratos')
        .select('id')
        .eq('folio', folio)
        .maybeSingle();
      if (!existing) break;
      seq++;
      folio = generateFolio(contractState, seq);
    }

    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: PLAN_NAMES[plan],
              description: `Folio: ${folio} — ${contractState.toUpperCase()} — ${String(valueAt(contract, 'landlord', 'name') || '')} / ${String(valueAt(contract, 'tenant', 'name') || '')}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/contrato?cancelled=1`,
      customer_email: landlordEmail || tenantEmail || undefined,
      metadata: {
        folio,
        estado: contractState,
        plan,
        arrendador_email: landlordEmail,
        inquilino_email: tenantEmail,
      },
    });

    // Guardar contrato pendiente en Supabase
    const { error: insertError } = await supabaseAdmin.from('contratos').insert({
      folio,
      estado: contractState,
      variant: variant === 'a' || variant === 'b' ? variant : null,
      tipo_propiedad: valueAt(contract, 'property', 'type') || null,
      arrendador_nombre: valueAt(contract, 'landlord', 'name') || null,
      arrendador_email: valueAt(contract, 'landlord', 'email') || null,
      inquilino_nombre: valueAt(contract, 'tenant', 'name') || null,
      inquilino_email: valueAt(contract, 'tenant', 'email') || null,
      monto_renta: valueAt(contract, 'terms', 'monthly_rent') || null,
      deposito: valueAt(contract, 'terms', 'deposit_amount') || null,
      duracion_meses: valueAt(contract, 'terms', 'lease_duration_months') || null,
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
