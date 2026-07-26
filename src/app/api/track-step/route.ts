import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Registro anónimo del avance en el generador para medir drop-off por paso.
// Fire-and-forget desde el cliente; nunca debe romper el flujo del generador.
const RATE_LIMIT = 60; // holgado: cada avance de paso dispara uno
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit('track-step', ip, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const { session_id, step, estado, variant } = await req.json();

    if (
      typeof session_id !== 'string' ||
      session_id.length < 8 || session_id.length > 64 ||
      typeof step !== 'number' || !Number.isInteger(step) || step < 1 || step > 7
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // ignoreDuplicates: una fila por (session_id, step) — reentrar un paso no duplica
    await supabaseAdmin
      .from('funnel_events')
      .upsert(
        {
          session_id,
          step,
          estado: typeof estado === 'string' ? estado : null,
          variant: variant === 'a' || variant === 'b' ? variant : null,
        },
        { onConflict: 'session_id,step', ignoreDuplicates: true }
      );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
