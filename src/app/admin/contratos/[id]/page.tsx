import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Download, User, UserCheck, Home, DollarSign, Users, Scale } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';
import { getStateName } from '@/lib/states';
import { updateContract } from './actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

function Field({
  label, name, defaultValue, type = 'text', span = false,
}: {
  label: string; name: string; defaultValue: string | number; type?: string; span?: boolean;
}) {
  return (
    <div className={span ? 'md:col-span-2' : ''}>
      <label className="block text-[12px] font-bold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="w-full h-10 px-3 border border-gray-200 rounded-md text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  );
}

function CheckboxField({
  label, name, defaultChecked, span = false,
}: {
  label: string; name: string; defaultChecked: boolean; span?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${span ? 'md:col-span-2' : ''}`}>
      <input type="checkbox" name={name} id={name} defaultChecked={defaultChecked} className="w-4 h-4" />
      <label htmlFor={name} className="text-[13px] font-medium text-gray-700">{label}</label>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
        {icon}
        <h2 className="text-[14px] font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export default async function EditContratoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;

  const { data: row, error } = await supabaseAdmin
    .from('contratos')
    .select('id, folio, estado, status, pdf_token, contract_data')
    .eq('id', id)
    .single();

  if (error || !row) notFound();

  const cd = row.contract_data ?? {};
  const l = cd.landlord ?? {};
  const t = cd.tenant ?? {};
  const a = cd.property?.address ?? {};
  const tm = cd.terms ?? {};
  const g = cd.guarantor ?? {};

  const action = updateContract.bind(null, row.id);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/contratos" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 font-medium mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Contratos
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Editar <span className="font-mono text-blue-600">{row.folio}</span>
          </h1>
          <p className="text-[13px] text-gray-500 font-medium mt-1">
            {getStateName(row.estado)} · {row.status === 'paid' ? 'Pagado' : 'Pendiente'} · Al guardar, el PDF se regenera con los datos corregidos (mismo link del cliente).
          </p>
        </div>
        {row.status === 'paid' && row.pdf_token && (
          <a
            href={`/api/pdf?token=${row.pdf_token}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 h-10 bg-gray-900 hover:bg-black text-white text-[13px] font-bold rounded-lg transition-colors shrink-0"
          >
            <Download className="w-4 h-4" /> Ver PDF actual
          </a>
        )}
      </div>

      {saved === '1' && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[13px] text-emerald-800 font-medium">
          <Check className="w-4 h-4 shrink-0" />
          Cambios guardados. La próxima descarga del PDF ya incluye la corrección.
        </div>
      )}

      <form action={action} className="space-y-6">
        <Section icon={<User className="w-4 h-4 text-gray-400" />} title="Arrendador">
          <Field label="Nombre completo" name="landlord_name" defaultValue={l.name ?? ''} span />
          <Field label="Clave de elector (INE)" name="landlord_id_number" defaultValue={l.id_number ?? ''} />
          <CheckboxField label="INE pendiente para completar antes de firma" name="landlord_id_number_pending" defaultChecked={!!l.id_number_pending} />
          <Field label="Teléfono" name="landlord_phone" defaultValue={l.phone ?? ''} />
          <Field label="Correo" name="landlord_email" defaultValue={l.email ?? ''} type="email" />
          <Field label="Domicilio" name="landlord_address" defaultValue={l.address ?? ''} />
        </Section>

        <Section icon={<UserCheck className="w-4 h-4 text-gray-400" />} title="Inquilino">
          <Field label="Nombre completo" name="tenant_name" defaultValue={t.name ?? ''} span />
          <Field label="Clave de elector (INE)" name="tenant_id_number" defaultValue={t.id_number ?? ''} />
          <CheckboxField label="INE pendiente para completar antes de firma" name="tenant_id_number_pending" defaultChecked={!!t.id_number_pending} />
          <Field label="Teléfono" name="tenant_phone" defaultValue={t.phone ?? ''} />
          <Field label="Correo" name="tenant_email" defaultValue={t.email ?? ''} type="email" />
          <Field label="Domicilio" name="tenant_address" defaultValue={t.address ?? ''} />
        </Section>

        <Section icon={<Home className="w-4 h-4 text-gray-400" />} title="Propiedad">
          <Field label="Calle" name="street" defaultValue={a.street ?? ''} />
          <Field label="Núm. exterior" name="ext_num" defaultValue={a.ext_num ?? ''} />
          <Field label="Núm. interior" name="int_num" defaultValue={a.int_num ?? ''} />
          <Field label="Colonia" name="neighborhood" defaultValue={a.neighborhood ?? ''} />
          <Field label="Municipio" name="municipality" defaultValue={a.municipality ?? ''} />
          <Field label="C.P." name="zip_code" defaultValue={a.zip_code ?? ''} />
          <Field label="Estado (dirección)" name="address_state" defaultValue={a.state ?? ''} />
        </Section>

        <Section icon={<DollarSign className="w-4 h-4 text-gray-400" />} title="Términos económicos">
          <Field label="Renta mensual (MXN)" name="monthly_rent" defaultValue={tm.monthly_rent ?? 0} type="number" />
          <Field label="Depósito (MXN)" name="deposit_amount" defaultValue={tm.deposit_amount ?? 0} type="number" />
          <Field label="Duración (meses)" name="lease_duration_months" defaultValue={tm.lease_duration_months ?? 12} type="number" />
          <Field label="Fecha de inicio" name="lease_start_date" defaultValue={tm.lease_start_date ?? ''} type="date" />
          <Field label="Día de pago" name="payment_day" defaultValue={tm.payment_day ?? 5} type="number" />
          <Field label="Penalidad por atraso (%)" name="late_penalty_percent" defaultValue={tm.late_penalty_percent ?? 10} type="number" />
          <Field label="Penalidad terminación anticipada (meses)" name="early_termination_penalty_months" defaultValue={tm.early_termination_penalty_months ?? 2} type="number" />
          <Field label="Banco" name="bank_name" defaultValue={tm.bank_name ?? ''} />
          <Field label="Cuenta" name="bank_account" defaultValue={tm.bank_account ?? ''} />
          <Field label="CLABE" name="bank_clabe" defaultValue={tm.bank_clabe ?? ''} />
          <CheckboxField label="Datos bancarios pendientes para completar antes de firma" name="bank_details_pending" defaultChecked={!!tm.bank_details_pending} span />
        </Section>

        <Section icon={<Users className="w-4 h-4 text-gray-400" />} title="Fiador">
          <div className="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" name="guarantor_includes" id="guarantor_includes" defaultChecked={!!g.includes} className="w-4 h-4" />
            <label htmlFor="guarantor_includes" className="text-[13px] font-medium text-gray-700">El contrato incluye fiador</label>
          </div>
          <Field label="Nombre completo" name="guarantor_name" defaultValue={g.name ?? ''} span />
          <Field label="Clave de elector (INE)" name="guarantor_id_number" defaultValue={g.id_number ?? ''} />
          <Field label="Teléfono" name="guarantor_phone" defaultValue={g.phone ?? ''} />
          <Field label="Correo" name="guarantor_email" defaultValue={g.email ?? ''} type="email" />
          <Field label="Domicilio" name="guarantor_address" defaultValue={g.address ?? ''} />
        </Section>

        <Section icon={<Scale className="w-4 h-4 text-gray-400" />} title="Cláusulas adicionales">
          <div className="md:col-span-2">
            <textarea
              name="additional_clauses"
              defaultValue={cd.additional_clauses ?? ''}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3 pb-10">
          <Link href="/admin/contratos" className="px-5 h-11 flex items-center text-[13px] font-bold text-gray-600 hover:text-gray-900 transition-colors">
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold rounded-lg transition-colors shadow-sm"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
