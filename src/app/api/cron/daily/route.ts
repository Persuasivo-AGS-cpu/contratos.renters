import { NextRequest, NextResponse } from 'next/server';
import { runRecoverPending, runReviewRequest } from '@/lib/cronTasks';
import { buildAndSendWeeklyReport } from '@/lib/weeklyReport';

// Único cron diario (vercel.json). Consolida las tareas diarias para no exceder
// el límite de 2 crons de Vercel Hobby. Cada tarea va aislada: si una falla,
// las demás igual corren. El reporte semanal se envía solo los lunes.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  try {
    results.recoverPending = await runRecoverPending();
  } catch (err) {
    console.error('[cron/daily] recover-pending failed:', err);
    results.recoverPending = { error: true };
  }

  try {
    results.reviewRequest = await runReviewRequest();
  } catch (err) {
    console.error('[cron/daily] review-request failed:', err);
    results.reviewRequest = { error: true };
  }

  // Reporte semanal: solo los lunes (UTC). El cron corre 16:00 UTC = 10:00 CDMX,
  // mismo día de la semana en ambas zonas.
  if (new Date().getUTCDay() === 1) {
    try {
      results.weeklyReport = await buildAndSendWeeklyReport();
    } catch (err) {
      console.error('[cron/daily] weekly-report failed:', err);
      results.weeklyReport = { error: true };
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
