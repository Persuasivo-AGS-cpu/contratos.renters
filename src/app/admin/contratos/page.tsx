import { FileText, Download } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatMXN(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

const TIPO_LABEL: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  local: "Local Comercial",
  oficina: "Oficina",
};

export default async function ContratosAdminPage() {
  const { data: contracts, count } = await supabaseAdmin
    .from("contratos")
    .select(
      "id, folio, estado, tipo_propiedad, arrendador_nombre, arrendador_email, inquilino_nombre, inquilino_email, monto_renta, status, paid_at, created_at, pdf_token",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">
            Registro de Contratos
          </h1>
          <p className="text-[13px] text-gray-500 font-medium">
            {count ?? 0} contratos en base de datos · Supabase
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Arrendador</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Inquilino</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Renta/Mes</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(contracts ?? []).length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-gray-400 text-sm">
                    Sin contratos registrados aún.
                  </td>
                </tr>
              )}
              {(contracts ?? []).map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-mono text-blue-600 font-medium flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {c.folio}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">
                    {TIPO_LABEL[c.tipo_propiedad] ?? c.tipo_propiedad ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600 uppercase font-medium">
                    {c.estado ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-medium text-gray-900 truncate max-w-[140px]">
                      {c.arrendador_nombre ?? "—"}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[140px]">
                      {c.arrendador_email ?? ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-medium text-gray-900 truncate max-w-[140px]">
                      {c.inquilino_nombre ?? "—"}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[140px]">
                      {c.inquilino_email ?? ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-gray-900">
                    {formatMXN(c.monto_renta)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        c.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {c.status === "paid" ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-500">
                    {formatDate(c.paid_at ?? c.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.status === "paid" && c.pdf_token ? (
                      <a
                        href={`/api/pdf?token=${c.pdf_token}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-400 group-hover:text-emerald-600 transition-colors inline-flex"
                        title="Ver PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="p-1.5 inline-flex text-gray-200 cursor-not-allowed">
                        <Download className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(count ?? 0) > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-[12px] text-gray-500 font-medium">
            Mostrando {Math.min(50, count ?? 0)} de {count ?? 0} contratos
          </div>
        )}
      </div>
    </div>
  );
}
