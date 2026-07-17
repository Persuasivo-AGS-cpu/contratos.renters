import { supabaseAdmin } from '@/lib/supabase';
import { sendRecoveryEmail, sendReviewRequestEmail } from '@/lib/email';

// Tareas diarias, extraídas para poder correrlas juntas desde un solo cron
// (Vercel Hobby limita a 2 crons; consolidamos en /api/cron/daily).

// Recuperación de checkout abandonado. Ventana 24-48h: cada pending cae en
// exactamente una corrida, así no se necesita columna de "ya avisado".
export async function runRecoverPending() {
  const now = Date.now();
  const from = new Date(now - 48 * 60 * 60 * 1000).toISOString();
  const to = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  const { data: pendings, error } = await supabaseAdmin
    .from('contratos')
    .select('folio, estado, arrendador_nombre, arrendador_email')
    .eq('status', 'pending')
    .gte('created_at', from)
    .lt('created_at', to)
    .not('arrendador_email', 'is', null)
    .limit(50);

  if (error) throw error;

  let sent = 0;
  for (const p of pendings ?? []) {
    try {
      await sendRecoveryEmail({
        toEmail: p.arrendador_email!,
        toName: p.arrendador_nombre || 'Hola',
        folio: p.folio,
        estado: p.estado,
      });
      sent++;
    } catch (err) {
      console.error(`[recover-pending] email failed for ${p.folio}:`, err);
    }
  }

  console.log(`[recover-pending] window=${from}..${to} candidates=${pendings?.length ?? 0} sent=${sent}`);
  return { candidates: pendings?.length ?? 0, sent };
}

// Pedir reseña 72-96h post-pago: cada contrato pagado cae en exactamente una
// corrida — un solo email de reseña por cliente.
export async function runReviewRequest() {
  const now = Date.now();
  const from = new Date(now - 96 * 60 * 60 * 1000).toISOString();
  const to = new Date(now - 72 * 60 * 60 * 1000).toISOString();

  const { data: paid, error } = await supabaseAdmin
    .from('contratos')
    .select('folio, arrendador_nombre, arrendador_email')
    .eq('status', 'paid')
    .gte('paid_at', from)
    .lt('paid_at', to)
    .not('arrendador_email', 'is', null)
    .limit(50);

  if (error) throw error;

  let sent = 0;
  for (const c of paid ?? []) {
    try {
      await sendReviewRequestEmail({
        toEmail: c.arrendador_email!,
        toName: c.arrendador_nombre || 'Hola',
        folio: c.folio,
      });
      sent++;
    } catch (err) {
      console.error(`[review-request] email failed for ${c.folio}:`, err);
    }
  }

  console.log(`[review-request] window=${from}..${to} candidates=${paid?.length ?? 0} sent=${sent}`);
  return { candidates: paid?.length ?? 0, sent };
}
