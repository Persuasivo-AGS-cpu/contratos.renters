import { NextRequest, NextResponse } from 'next/server';
import { runRecoverPending } from '@/lib/cronTasks';

// Disparo manual (para pruebas). El envío automático diario lo hace
// /api/cron/daily — Vercel Hobby limita a 2 crons, así que esta tarea ya no
// tiene cron propio.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json(await runRecoverPending());
  } catch (err) {
    console.error('[cron/recover-pending]', err);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }
}
