import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendRecoveryEmail } from '@/lib/email';

// Corre 1 vez al día (vercel.json). Ventana 24-48h: cada pending cae en
// exactamente una corrida, así no se necesita columna de "ya avisado".
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  if (error) {
    console.error('[cron/recover-pending]', error);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

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
      console.error(`[cron/recover-pending] email failed for ${p.folio}:`, err);
    }
  }

  console.log(`[cron/recover-pending] window=${from}..${to} candidates=${pendings?.length ?? 0} sent=${sent}`);
  return NextResponse.json({ candidates: pendings?.length ?? 0, sent });
}
