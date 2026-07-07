import { Bell, Mail } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { getStateName } from "@/lib/states";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function WaitlistAdminPage() {
  const [{ data: entries, count }, { data: allRows }] = await Promise.all([
    supabaseAdmin
      .from("waitlist")
      .select("id, email, estado, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(100),
    supabaseAdmin.from("waitlist").select("estado"),
  ]);

  // Conteo por estado para los KPI
  const byState = new Map<string, number>();
  (allRows ?? []).forEach((r) => byState.set(r.estado, (byState.get(r.estado) ?? 0) + 1));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Lista de Espera</h1>
          <p className="text-[13px] text-gray-500 font-medium">
            {count ?? 0} correos esperando estados nuevos · lista de lanzamiento
          </p>
        </div>
      </div>

      {/* KPI por estado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from(byState.entries()).map(([estado, n]) => (
          <div key={estado} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-gray-400" />
              <h3 className="text-[13px] font-medium text-gray-500">{getStateName(estado)}</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{n}</span>
            <p className="text-[11px] text-gray-400 mt-1">correos registrados</p>
          </div>
        ))}
        {byState.size === 0 && (
          <div className="col-span-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center text-gray-400 text-sm">
            Aún no hay registros en la lista de espera.
          </div>
        )}
      </div>

      {/* Tabla */}
      {(entries ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado esperado</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(entries ?? []).map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-[13px] text-gray-900 font-medium flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {e.email}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-600">{getStateName(e.estado)}</td>
                    <td className="px-4 py-3 text-[13px] text-gray-500">{formatDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
