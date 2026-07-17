import { NextRequest, NextResponse } from 'next/server';
import { buildAndSendWeeklyReport } from '@/lib/weeklyReport';

// Disparo manual del reporte semanal (para pruebas o envío on-demand).
// El envío automático de los lunes lo hace el cron review-request (Vercel
// Hobby limita a 2 crons, así que este endpoint no tiene cron propio).
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await buildAndSendWeeklyReport();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[cron/weekly-report]', err);
    return NextResponse.json({ error: 'Report failed' }, { status: 500 });
  }
}
