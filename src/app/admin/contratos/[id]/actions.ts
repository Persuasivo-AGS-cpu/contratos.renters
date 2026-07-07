'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthorized } from '@/lib/adminAuth';

function num(fd: FormData, key: string): number {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : 0;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

export async function updateContract(id: string, formData: FormData) {
  const hdrs = await headers();
  if (!isAdminAuthorized(hdrs.get('authorization'))) {
    throw new Error('No autorizado');
  }

  const { data: row, error: fetchError } = await supabaseAdmin
    .from('contratos')
    .select('contract_data')
    .eq('id', id)
    .single();

  if (fetchError || !row) {
    throw new Error('Contrato no encontrado');
  }

  const cd = row.contract_data ?? {};

  const landlord = {
    ...cd.landlord,
    name: str(formData, 'landlord_name'),
    id_number: str(formData, 'landlord_id_number'),
    email: str(formData, 'landlord_email'),
    phone: str(formData, 'landlord_phone'),
    address: str(formData, 'landlord_address'),
  };
  const tenant = {
    ...cd.tenant,
    name: str(formData, 'tenant_name'),
    id_number: str(formData, 'tenant_id_number'),
    email: str(formData, 'tenant_email'),
    phone: str(formData, 'tenant_phone'),
    address: str(formData, 'tenant_address'),
  };
  const address = {
    ...cd.property?.address,
    street: str(formData, 'street'),
    ext_num: str(formData, 'ext_num'),
    int_num: str(formData, 'int_num'),
    neighborhood: str(formData, 'neighborhood'),
    municipality: str(formData, 'municipality'),
    zip_code: str(formData, 'zip_code'),
    state: str(formData, 'address_state'),
  };
  const terms = {
    ...cd.terms,
    monthly_rent: num(formData, 'monthly_rent'),
    deposit_amount: num(formData, 'deposit_amount'),
    lease_duration_months: num(formData, 'lease_duration_months'),
    lease_start_date: str(formData, 'lease_start_date'),
    payment_day: num(formData, 'payment_day'),
    late_penalty_percent: num(formData, 'late_penalty_percent'),
    early_termination_penalty_months: num(formData, 'early_termination_penalty_months'),
    bank_name: str(formData, 'bank_name'),
    bank_account: str(formData, 'bank_account'),
    bank_clabe: str(formData, 'bank_clabe'),
  };
  const guarantor = {
    ...cd.guarantor,
    includes: formData.get('guarantor_includes') === 'on',
    name: str(formData, 'guarantor_name'),
    id_number: str(formData, 'guarantor_id_number'),
    address: str(formData, 'guarantor_address'),
    phone: str(formData, 'guarantor_phone'),
    email: str(formData, 'guarantor_email'),
  };

  const contract_data = {
    ...cd,
    landlord,
    tenant,
    property: { ...cd.property, address },
    terms,
    guarantor,
    additional_clauses: str(formData, 'additional_clauses'),
  };

  // contract_data manda (el PDF se genera de aquí); las columnas planas se
  // sincronizan para que las tablas del admin no queden desfasadas.
  const { error: updateError } = await supabaseAdmin
    .from('contratos')
    .update({
      contract_data,
      arrendador_nombre: landlord.name || null,
      arrendador_email: landlord.email || null,
      inquilino_nombre: tenant.name || null,
      inquilino_email: tenant.email || null,
      monto_renta: terms.monthly_rent || null,
      deposito: terms.deposit_amount || null,
      duracion_meses: terms.lease_duration_months || null,
    })
    .eq('id', id);

  if (updateError) {
    console.error('[admin/contratos] update error:', updateError);
    throw new Error('Error al guardar');
  }

  revalidatePath('/admin/contratos');
  redirect(`/admin/contratos/${id}?saved=1`);
}
