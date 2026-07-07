import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit('lead', ip, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 });
  }

  try {
    const { email, estado } = await req.json();

    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .upsert(
        { email: email.toLowerCase().trim(), estado: typeof estado === 'string' ? estado : null },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('[lead]', error);
      return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}
