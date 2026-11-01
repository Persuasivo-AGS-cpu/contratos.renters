import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendContractEmail } from '@/lib/email';
import { matchedEmail, canReissue } from '@/lib/reenvio';

// Máx 5 solicitudes por IP cada 15 minutos.
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Misma respuesta exista o no el contrato: no se puede usar para descubrir folios
// ni correos.
const OK = () => NextResponse.json({ ok: true });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit('reenviar-enlace', ip, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en unos minutos.' }, { status: 429 });
  }

  let body: { folio?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const folio = typeof body.folio === 'string' ? body.folio.trim().toUpperCase() : '';
  if (!folio || folio.length > 40 || typeof body.email !== 'string' || body.email.length > 200) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const { data: row } = await supabaseAdmin
    .from('contratos')
    .select('id, folio, estado, arrendador_nombre, arrendador_email, inquilino_email, pdf_token_issued_at')
    .eq('folio', folio)
    .eq('status', 'paid')
    .maybeSingle();

  const to = row ? matchedEmail(row, body.email) : null;
  if (!row || !to || !canReissue(row.pdf_token_issued_at)) return OK();

  // Token nuevo: el enlace anterior (posiblemente filtrado) deja de servir.
  const newToken = randomUUID();
  const { error: updateError } = await supabaseAdmin
    .from('contratos')
    .update({ pdf_token: newToken, pdf_token_issued_at: new Date().toISOString() })
    .eq('id', row.id);
  if (updateError) {
    console.error('[reenviar-enlace] update falló:', updateError);
    return NextResponse.json({ error: 'No se pudo procesar. Intenta más tarde.' }, { status: 500 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contratos.renters.mx';
    await sendContractEmail({
      toEmail: to,
      toName: row.arrendador_nombre || 'cliente',
      folio: row.folio,
      estado: row.estado,
      downloadUrl: `${appUrl}/api/pdf?token=${newToken}`,
    });
  } catch (err) {
    console.error('[reenviar-enlace] correo falló:', err);
  }
  return OK();
}
