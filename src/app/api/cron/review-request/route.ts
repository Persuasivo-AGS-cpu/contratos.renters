import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendReviewRequestEmail } from '@/lib/email';
import { buildAndSendWeeklyReport } from '@/lib/weeklyReport';

// Corre 1 vez al día (vercel.json). Ventana 72-96h post-pago: cada contrato
// pagado cae en exactamente una corrida — un solo email de reseña por cliente.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  if (error) {
    console.error('[cron/review-request]', error);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

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
      console.error(`[cron/review-request] email failed for ${c.folio}:`, err);
    }
  }

  console.log(`[cron/review-request] window=${from}..${to} candidates=${paid?.length ?? 0} sent=${sent}`);

  // Los lunes, además de las reseñas, enviar el reporte semanal por correo.
  // (Vercel Hobby limita a 2 crons; se engancha aquí en vez de tener uno propio.)
  // El cron corre 16:30 UTC = 10:30 CDMX, mismo día de la semana en ambas zonas.
  let weeklyReport = false;
  if (new Date().getUTCDay() === 1) {
    try {
      await buildAndSendWeeklyReport();
      weeklyReport = true;
    } catch (err) {
      console.error('[cron/review-request] weekly report failed:', err);
    }
  }

  return NextResponse.json({ candidates: paid?.length ?? 0, sent, weeklyReport });
}
