import { ArrowUpRight, Clock } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function truncate(str: string | null, len = 20) {
  if (!str) return "—";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export default async function TransaccionesPage() {
  const { data: transactions, count } = await supabaseAdmin
    .from("contratos")
    .select(
      "id, folio, stripe_session_id, stripe_payment_id, arrendador_email, status, paid_at, created_at, monto_pagado",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Transacciones</h1>
          <p className="text-[13px] text-gray-500 font-medium">
            Historial de sesiones de pago · {count ?? 0} registros · Supabase + Stripe
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-2 rounded-t-xl border border-gray-200 border-b-0 flex items-center gap-4 px-4">
        <span className="text-[13px] text-gray-400 font-medium">Mostrando los 50 más recientes</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Folio</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Stripe Session ID</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(transactions ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-gray-400 text-sm">
                    Sin transacciones registradas aún.
                  </td>
                </tr>
              )}
              {(transactions ?? []).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-mono text-blue-600 font-medium">{t.folio}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-gray-500">{truncate(t.stripe_session_id, 24)}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-gray-500">
                    {t.stripe_payment_id ? truncate(t.stripe_payment_id, 24) : (
                      <span className="text-gray-300 italic">pendiente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-700 truncate max-w-[180px]">
                    {t.arrendador_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-gray-900">
                    {t.status === "paid"
                      ? `$${(((t.monto_pagado ?? 49900) / 100)).toLocaleString("es-MX")} MXN`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {t.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <ArrowUpRight className="w-3 h-3" /> Completado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-500">
                    {t.status === "paid" ? formatDate(t.paid_at) : formatDate(t.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(count ?? 0) > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-[12px] text-gray-500 font-medium">
            Mostrando {Math.min(50, count ?? 0)} de {count ?? 0} registros
          </div>
        )}
      </div>
    </div>
  );
}
