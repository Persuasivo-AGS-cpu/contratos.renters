import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { tokenCutoff, tokenFreshFilter } from '@/lib/token';
import ImprimirClient from './ImprimirClient';

// El token viaja en la URL: la página no se indexa ni se cachea.
export const metadata: Metadata = { robots: { index: false, follow: false } };

interface PageProps {
  searchParams: Promise<{ token?: string; folio?: string; pdf?: string }>;
}

export default async function ImprimirPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;
  const pdfMode = params.pdf === '1';

  if (!token) {
    redirect('/contrato');
  }

  const { data, error } = await supabaseAdmin
    .from('contratos')
    .select('id, folio, status, contract_data')
    .eq('pdf_token', token)
    .eq('status', 'paid')
    .or(tokenFreshFilter(tokenCutoff()))
    .single();

  if (error || !data) {
    redirect('/reenviar-enlace?motivo=acceso');
  }

  return <ImprimirClient contractData={data.contract_data} folio={data.folio} pdfMode={pdfMode} />;
}
