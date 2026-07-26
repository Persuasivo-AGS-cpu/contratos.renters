import { TrendingDown } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Arranque oficial de medición — antes de esta fecha solo hay pruebas propias
// (compras de prueba, testing manual del wizard), no tráfico real de negocio.
const FUNNEL_START_DATE = "2026-07-10T00:00:00Z";

// Los números de paso (1-7) son compartidos por ambas variantes en
// funnel_events, pero NO significan lo mismo en cada una — por eso cada
// variante tiene su propio set de títulos en vez de reusar uno solo.
// A: StateStep/PropertyStep/LandlordStep/TenantStep/TermsStep/LegalStep/
// SummaryStep (ContractEngine.tsx). B: estado/tipo+estatus+inmueble/
// arrendador/arrendatario/terminos+banco/aval/revision (ContratoBEngine.tsx,
// SECTION_STEP) — ej. el paso 6 en A es "Condiciones" (banco+penalidades+
// aval+cláusulas); en B el paso 6 es solo la pregunta de aval.
const STEPS_A = [
  { id: 1, title: "Estado" },
  { id: 2, title: "Propiedad" },
  { id: 3, title: "Arrendador (INE)" },
  { id: 4, title: "Inquilino" },
  { id: 5, title: "Términos" },
  { id: 6, title: "Condiciones" },
  { id: 7, title: "Resumen (pre-pago)" },
];

const STEPS_B = [
  { id: 1, title: "Estado" },
  { id: 2, title: "Propiedad (tipo, estatus, dirección)" },
  { id: 3, title: "Arrendador" },
  { id: 4, title: "Inquilino" },
  { id: 5, title: "Términos + banco" },
  { id: 6, title: "Aval / fiador" },
  { id: 7, title: "Revisión (pre-pago)" },
];

function buildRows(steps: typeof STEPS_A, maxSteps: number[]) {
  const rows = steps.map((s) => ({ ...s, sessions: maxSteps.filter((m) => m >= s.id).length }));
  const top = rows[0]?.sessions || 0;
  const rowsWithRates = rows.map((r, i) => {
    const prev = i === 0 ? r.sessions : rows[i - 1].sessions;
    const pctOfTop = top > 0 ? (r.sessions / top) * 100 : 0;
    const dropFromPrev = prev > 0 ? ((prev - r.sessions) / prev) * 100 : 0;
    return { ...r, pctOfTop, dropFromPrev, isFirst: i === 0 };
  });
  return { rowsWithRates, top };
}

type Row = ReturnType<typeof buildRows>["rowsWithRates"][number];

function FunnelTable({
  rows,
  paid,
  paidLabel,
}: {
  rows: Row[];
  paid?: { count: number; top: number };
  paidLabel?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Paso</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Sesiones que llegaron</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">% del inicio</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Caída vs. paso previo</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[220px]">Retención</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => {
              const bigDrop = !r.isFirst && r.dropFromPrev >= 30;
              return (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-gray-900">
                      <span className="font-mono text-gray-400 mr-2">{r.id}</span>
                      {r.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[15px] font-bold text-gray-900">
                    {r.sessions.toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] text-gray-600">{r.pctOfTop.toFixed(0)}%</td>
                  <td className="px-4 py-3 text-right">
                    {r.isFirst ? (
                      <span className="text-[13px] text-gray-300">—</span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 text-[13px] font-bold ${
                          bigDrop ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {bigDrop && <TrendingDown className="w-3.5 h-3.5" />}
                        -{r.dropFromPrev.toFixed(0)}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bigDrop ? "bg-red-500" : "bg-[#4F46E5]"}`}
                        style={{ width: `${Math.max(r.pctOfTop, 2)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {paid && (
              <tr className="bg-emerald-50/40 border-t-2 border-emerald-100">
                <td className="px-4 py-3">
                  <span className="text-[13px] font-bold text-emerald-800">
                    <span className="font-mono text-emerald-400 mr-2">✓</span>
                    {paidLabel || "Pagó (contratos)"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[15px] font-bold text-emerald-700">
                  {paid.count.toLocaleString("es-MX")}
                </td>
                <td className="px-4 py-3 text-right text-[13px] text-emerald-700">
                  {paid.top > 0 ? ((paid.count / paid.top) * 100).toFixed(1) : "0"}%
                </td>
                <td className="px-4 py-3" colSpan={2}>
                  <span className="text-[12px] text-gray-500">
                    Conversión (contratos pagados / sesiones que iniciaron)
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function FunnelAdminPage() {
  // Un embudo real es monotónico: "sesiones que llegaron AL MENOS hasta este
  // paso", no "sesiones que dispararon el evento exacto de este paso" (eso
  // rompía con sesiones que retoman el formulario tras recargar — el store
  // persiste currentStep y al rehidratar salta directo al paso guardado sin
  // volver a disparar los intermedios). Se calcula el paso más lejano que
  // alcanzó cada sesión y se cuenta cuántas llegaron a >= cada paso.
  const { data: events } = await supabaseAdmin
    .from("funnel_events")
    .select("session_id, step, variant")
    .gte("created_at", FUNNEL_START_DATE);

  // Por sesión: el paso más lejano alcanzado + la variante A/B vista (una
  // sesión debería tener siempre la misma, la cookie no cambia a medio camino).
  const bySession = new Map<string, { maxStep: number; variant: "a" | "b" | null }>();
  for (const e of events ?? []) {
    const cur = bySession.get(e.session_id);
    const variant = e.variant === "a" || e.variant === "b" ? e.variant : null;
    if (!cur) {
      bySession.set(e.session_id, { maxStep: e.step, variant });
    } else {
      if (e.step > cur.maxStep) cur.maxStep = e.step;
      if (!cur.variant && variant) cur.variant = variant;
    }
  }
  const maxSteps = [...bySession.values()].map((v) => v.maxStep);

  const stepsByVariant: Record<"a" | "b", number[]> = { a: [], b: [] };
  for (const v of bySession.values()) {
    if (v.variant === "a") stepsByVariant.a.push(v.maxStep);
    else if (v.variant === "b") stepsByVariant.b.push(v.maxStep);
  }
  const hasVariantData = stepsByVariant.a.length > 0 || stepsByVariant.b.length > 0;

  // Pagos: contratos que efectivamente se pagaron (unidad distinta, referencia)
  const { count: paidCount } = await supabaseAdmin
    .from("contratos")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid")
    .gte("paid_at", FUNNEL_START_DATE);

  const { data: paidVariantRows } = await supabaseAdmin
    .from("contratos")
    .select("variant")
    .eq("status", "paid")
    .gte("paid_at", FUNNEL_START_DATE);

  const paidByVariant = { a: 0, b: 0 };
  for (const r of paidVariantRows ?? []) {
    if (r.variant === "a") paidByVariant.a++;
    else if (r.variant === "b") paidByVariant.b++;
  }

  const variantSummary = (["a", "b"] as const).map((v) => {
    const steps = stepsByVariant[v];
    const started = steps.length;
    const reachedFinal = steps.filter((m) => m >= 7).length;
    const paid = paidByVariant[v];
    return {
      variant: v,
      started,
      completionPct: started > 0 ? (reachedFinal / started) * 100 : 0,
      paid,
      conversionPct: started > 0 ? (paid / started) * 100 : 0,
    };
  });

  const combined = buildRows(STEPS_A, maxSteps);
  const variantA = buildRows(STEPS_A, stepsByVariant.a);
  const variantB = buildRows(STEPS_B, stepsByVariant.b);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Embudo del Generador</h1>
          <p className="text-[13px] text-gray-500 font-medium">
            Cuántas sesiones anónimas llegaron a cada paso · dónde abandona la gente ·
            desde el 10 jul 2026 (excluye pruebas propias previas)
          </p>
        </div>
      </div>

      <FunnelTable rows={combined.rowsWithRates} paid={{ count: paidCount ?? 0, top: combined.top }} />

      {hasVariantData && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">Comparación A/B</h2>
            <p className="text-[12px] text-gray-500 mb-3">
              /contrato (A, wizard actual) vs. /contrato-b (B, scroll continuo) — asignación por
              src/proxy.ts. Sesiones sin cookie de variante (previas al test, o pruebas con
              ?forceVariant=) no aparecen aquí.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Variante</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Sesiones iniciadas</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Llegaron a revisión</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Pagaron</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Conversión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variantSummary.map((r) => (
                    <tr key={r.variant} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-[13px] font-bold text-gray-900">
                        {r.variant === "a" ? "A · /contrato" : "B · /contrato-b"}
                      </td>
                      <td className="px-4 py-3 text-right text-[15px] font-bold text-gray-900">
                        {r.started.toLocaleString("es-MX")}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] text-gray-600">{r.completionPct.toFixed(0)}%</td>
                      <td className="px-4 py-3 text-right text-[13px] text-gray-600">{r.paid.toLocaleString("es-MX")}</td>
                      <td className="px-4 py-3 text-right text-[13px] font-bold text-emerald-700">
                        {r.conversionPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detalle por paso, propio de cada variante — los pasos no significan
              lo mismo entre A y B (ver comentario de STEPS_A/STEPS_B), así que
              cada una tiene su propia tabla en vez de compartir una sola. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[13px] font-bold text-gray-700 mb-2">A · /contrato — detalle por paso</h3>
              {stepsByVariant.a.length > 0 ? (
                <FunnelTable rows={variantA.rowsWithRates} />
              ) : (
                <p className="text-[12px] text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
                  Todavía no hay sesiones registradas en esta variante.
                </p>
              )}
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-gray-700 mb-2">B · /contrato-b — detalle por paso</h3>
              {stepsByVariant.b.length > 0 ? (
                <FunnelTable rows={variantB.rowsWithRates} />
              ) : (
                <p className="text-[12px] text-gray-400 bg-white border border-gray-200 rounded-xl p-4">
                  Todavía no hay sesiones registradas en esta variante.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-1.5">
        <p className="text-[12px] text-gray-400">
          Una sesión = un navegador (id anónimo). Cada fila cuenta sesiones que llegaron
          <strong> al menos</strong> hasta ese paso (acumulado del anterior, siempre igual o
          menor). El paso con mayor caída en rojo es donde más gente abandona.
        </p>
        <p className="text-[12px] text-gray-400">
          Los pagos son una unidad distinta (contratos), por eso van separados como referencia de
          conversión final.
        </p>
      </div>
    </div>
  );
}
