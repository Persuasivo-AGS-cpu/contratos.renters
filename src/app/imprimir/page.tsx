import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import ImprimirClient from './ImprimirClient';

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
    .single();

  if (error || !data) {
    redirect('/contrato?error=acceso_denegado');
  }

  return <ImprimirClient contractData={data.contract_data} folio={data.folio} pdfMode={pdfMode} />;
}
