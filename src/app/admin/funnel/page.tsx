import { TrendingDown } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Arranque oficial de medición — antes de esta fecha solo hay pruebas propias
// (compras de prueba, testing manual del wizard), no tráfico real de negocio.
const FUNNEL_START_DATE = "2026-07-10T00:00:00Z";

const STEPS = [
  { id: 1, title: "Estado" },
  { id: 2, title: "Propiedad" },
  { id: 3, title: "Arrendador (INE)" },
  { id: 4, title: "Inquilino" },
  { id: 5, title: "Términos" },
  { id: 6, title: "Condiciones" },
  { id: 7, title: "Resumen (pre-pago)" },
];

export default async function FunnelAdminPage() {
  // Sesiones que alcanzaron cada paso (UNIQUE(session_id,step) → COUNT = sesiones)
  const counts = await Promise.all(
    STEPS.map((s) =>
      supabaseAdmin
        .from("funnel_events")
        .select("*", { count: "exact", head: true })
        .eq("step", s.id)
        .gte("created_at", FUNNEL_START_DATE)
    )
  );

  // Pagos: contratos que efectivamente se pagaron (unidad distinta, referencia)
  const { count: paidCount } = await supabaseAdmin
    .from("contratos")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid")
    .gte("paid_at", FUNNEL_START_DATE);

  const rows = STEPS.map((s, i) => ({ ...s, sessions: counts[i].count ?? 0 }));
  const top = rows[0]?.sessions || 0;

  const rowsWithRates = rows.map((r, i) => {
    const prev = i === 0 ? r.sessions : rows[i - 1].sessions;
    const pctOfTop = top > 0 ? (r.sessions / top) * 100 : 0;
    const dropFromPrev = prev > 0 ? ((prev - r.sessions) / prev) * 100 : 0;
    return { ...r, pctOfTop, dropFromPrev, isFirst: i === 0 };
  });

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
              {rowsWithRates.map((r) => {
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
                    <td className="px-4 py-3 text-right text-[13px] text-gray-600">
                      {r.pctOfTop.toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.isFirst ? (
                        <span className="text-[13px] text-gray-300">—</span>
                      ) : r.dropFromPrev < 0 ? (
                        // Sesiones "suben" vs. el paso previo — no es una caída real, es
                        // tráfico no lineal (retomar desde otro paso, testing manual, etc.)
                        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-600">
                          +{Math.abs(r.dropFromPrev).toFixed(0)}%
                        </span>
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

              {/* Pago — unidad distinta (contratos pagados), referencia final */}
              <tr className="bg-emerald-50/40 border-t-2 border-emerald-100">
                <td className="px-4 py-3">
                  <span className="text-[13px] font-bold text-emerald-800">
                    <span className="font-mono text-emerald-400 mr-2">✓</span>
                    Pagó (contratos)
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[15px] font-bold text-emerald-700">
                  {(paidCount ?? 0).toLocaleString("es-MX")}
                </td>
                <td className="px-4 py-3 text-right text-[13px] text-emerald-700">
                  {top > 0 ? (((paidCount ?? 0) / top) * 100).toFixed(1) : "0"}%
                </td>
                <td className="px-4 py-3" colSpan={2}>
                  <span className="text-[12px] text-gray-500">
                    Conversión total del embudo (contratos pagados / sesiones que iniciaron)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[12px] text-gray-400">
          Una sesión = un navegador (id anónimo). Cada fila cuenta sesiones que alguna vez
          llegaron a ese paso — <strong>no</strong> es acumulado del anterior, así que un paso
          puede mostrar más sesiones que el previo si hay tráfico no lineal (alguien retoma el
          formulario desde otro punto, prueba manual del checkout saltando pasos, etc.). El paso
          con mayor caída en rojo es donde más gente abandona linealmente.
        </p>
        <p className="text-[12px] text-gray-400">
          Los pagos son una unidad distinta (contratos), por eso van separados como referencia de
          conversión final.
        </p>
      </div>
    </div>
  );
}
