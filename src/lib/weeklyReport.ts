import { supabaseAdmin } from '@/lib/supabase';
import { sendReportEmail } from '@/lib/email';

// Reporte semanal (embudo + ventas), últimos 7 días. Se dispara desde el cron
// diario existente los lunes (Vercel Hobby limita a 2 crons, por eso no tiene
// el suyo propio) y también desde /api/cron/weekly-report para pruebas manuales.

const STEPS = [
  { id: 1, title: 'Estado' },
  { id: 2, title: 'Propiedad' },
  { id: 3, title: 'Arrendador (INE)' },
  { id: 4, title: 'Inquilino' },
  { id: 5, title: 'Términos' },
  { id: 6, title: 'Condiciones' },
  { id: 7, title: 'Resumen (pre-pago)' },
];

function fmtMXN(pesos: number) {
  return pesos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

export async function buildAndSendWeeklyReport() {
  const sinceIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: iniciados },
    { data: paidRows, count: pagados },
    { count: sesiones },
  ] = await Promise.all([
    supabaseAdmin.from('contratos').select('*', { count: 'exact', head: true }).gte('created_at', sinceIso),
    supabaseAdmin.from('contratos').select('monto_pagado', { count: 'exact' }).eq('status', 'paid').gte('created_at', sinceIso),
    supabaseAdmin.from('funnel_events').select('session_id', { count: 'exact', head: true }).gte('created_at', sinceIso),
  ]);

  const ingresos = (paidRows ?? []).reduce((s, r) => s + (r.monto_pagado ?? 49900), 0) / 100;
  const nIniciados = iniciados ?? 0;
  const nPagados = pagados ?? 0;
  const conversion = nIniciados > 0 ? `${((nPagados / nIniciados) * 100).toFixed(1)}%` : 'N/A';

  const stepCounts = await Promise.all(
    STEPS.map((s) =>
      supabaseAdmin
        .from('funnel_events')
        .select('*', { count: 'exact', head: true })
        .eq('step', s.id)
        .gte('created_at', sinceIso)
    )
  );
  const rows = STEPS.map((s, i) => ({ ...s, sessions: stepCounts[i].count ?? 0 }));
  const top = rows[0]?.sessions || 0;

  const stepRowsHtml = rows
    .map((r, i) => {
      const prev = i === 0 ? r.sessions : rows[i - 1].sessions;
      const pctOfTop = top > 0 ? `${((r.sessions / top) * 100).toFixed(0)}%` : '—';
      const drop = i === 0 ? '—' : prev > 0 ? `-${(((prev - r.sessions) / prev) * 100).toFixed(0)}%` : '—';
      const bigDrop = i > 0 && prev > 0 && (prev - r.sessions) / prev >= 0.3;
      return `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;">${r.id}. ${r.title}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">${r.sessions}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;color:#64748b;">${pctOfTop}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:${bigDrop ? '#dc2626' : '#64748b'};">${bigDrop ? '🔴 ' : ''}${drop}</td>
      </tr>`;
    })
    .join('');

  let nota: string;
  if ((sesiones ?? 0) === 0) {
    nota = 'Sin tráfico registrado en el generador esta semana — revisar que la campaña de Meta siga activa y que el tracking funcione.';
  } else if (nIniciados > 0 && nPagados === 0) {
    nota = '⚠️ Hubo contratos iniciados pero 0 pagados — posible fricción en el paso de pago.';
  } else {
    nota = 'Revisa el paso marcado en rojo (mayor caída) como primer punto a optimizar.';
  }

  const hoy = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:28px;background:#fff;color:#0f172a;">
    <h1 style="font-size:22px;font-weight:900;margin:0 0 4px;">📊 Reporte Semanal — Renters Contratos</h1>
    <p style="color:#64748b;margin:0 0 24px;font-size:13px;">Últimos 7 días · Generado ${hoy}</p>

    <h2 style="font-size:15px;margin:0 0 10px;">Ventas e ingresos</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
      <tr><td style="padding:8px 10px;border-bottom:1px solid #eee;color:#64748b;">Ingresos cobrados</td><td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:900;font-size:18px;color:#059669;">${fmtMXN(ingresos)}</td></tr>
      <tr><td style="padding:8px 10px;border-bottom:1px solid #eee;color:#64748b;">Contratos pagados</td><td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">${nPagados}</td></tr>
      <tr><td style="padding:8px 10px;border-bottom:1px solid #eee;color:#64748b;">Contratos iniciados</td><td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">${nIniciados}</td></tr>
      <tr><td style="padding:8px 10px;border-bottom:1px solid #eee;color:#64748b;">Sesiones en el generador</td><td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">${sesiones ?? 0}</td></tr>
      <tr><td style="padding:8px 10px;color:#64748b;">Conversión (pagados / iniciados)</td><td style="padding:8px 10px;text-align:right;font-weight:700;">${conversion}</td></tr>
    </table>

    <h2 style="font-size:15px;margin:0 0 10px;">Dónde se cae la gente (embudo del generador)</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:8px 10px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Paso</th>
          <th style="padding:8px 10px;text-align:right;color:#64748b;font-size:11px;text-transform:uppercase;">Sesiones</th>
          <th style="padding:8px 10px;text-align:right;color:#64748b;font-size:11px;text-transform:uppercase;">% del inicio</th>
          <th style="padding:8px 10px;text-align:right;color:#64748b;font-size:11px;text-transform:uppercase;">Caída</th>
        </tr>
      </thead>
      <tbody>${stepRowsHtml}</tbody>
    </table>

    <p style="margin-top:24px;padding:14px 16px;background:#f1f5f9;border-radius:10px;font-size:13px;color:#334155;">${nota}</p>
    <p style="margin-top:16px;font-size:12px;color:#94a3b8;">Panel en vivo: <a href="https://contratos.renters.mx/admin/funnel" style="color:#4d6bfe;">contratos.renters.mx/admin/funnel</a></p>
  </div>`;

  await sendReportEmail(`📊 Reporte semanal Renters — ${fmtMXN(ingresos)} en ventas`, html);

  return { ingresos, pagados: nPagados, iniciados: nIniciados };
}
