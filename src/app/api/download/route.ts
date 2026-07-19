import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAppUrl } from '@/lib/appUrl';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('contratos')
    .select('id, folio, status, pdf_token, contract_data')
    .eq('pdf_token', token)
    .eq('status', 'paid')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Acceso denegado o contrato no encontrado' }, { status: 403 });
  }

  // Redirigir a página de impresión con token verificado
  const appUrl = getAppUrl();
  return NextResponse.redirect(`${appUrl}/imprimir?token=${token}&folio=${data.folio}`);
}

export async function POST(req: NextRequest) {
  const { session_id } = await req.json();

  if (!session_id) {
    return NextResponse.json({ error: 'session_id requerido' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('contratos')
    .select('id, folio, status, pdf_token, contract_data')
    .eq('stripe_session_id', session_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
  }

  if (data.status !== 'paid') {
    return NextResponse.json({ error: 'Pago pendiente' }, { status: 402 });
  }

  return NextResponse.json({
    folio: data.folio,
    pdf_token: data.pdf_token,
  });
}
