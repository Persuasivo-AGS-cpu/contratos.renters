import { TrendingUp, FileText, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { ContratosChart } from "@/components/admin/ContratosChart";

export const dynamic = "force-dynamic";

const PRECIO_CONTRATO = 499;

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminDashboardPage() {
  const [
    { count: countPaid },
    { count: countPending },
    { data: recent },
    { data: chartRaw },
  ] = await Promise.all([
    supabaseAdmin.from("contratos").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabaseAdmin.from("contratos").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin
      .from("contratos")
      .select("folio, arrendador_email, monto_renta, status, created_at, paid_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin
      .from("contratos")
      .select("paid_at")
      .eq("status", "paid")
      .gte("paid_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .not("paid_at", "is", null),
  ]);

  const totalIngresos = (countPaid ?? 0) * PRECIO_CONTRATO;

  // Agrupar por día para la gráfica
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    dayMap.set(key, 0);
  }
  (chartRaw ?? []).forEach((r) => {
    if (!r.paid_at) return;
    const key = new Date(r.paid_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  });
  const chartData = Array.from(dayMap, ([fecha, contratos]) => ({ fecha, contratos }));

  const totalContratos = countPaid ?? 0;
  const pendientes = countPending ?? 0;
  const conversionRate =
    totalContratos + pendientes > 0
      ? ((totalContratos / (totalContratos + pendientes)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Visión General</h1>
        <span className="text-xs text-gray-400 font-medium">Datos en tiempo real · Supabase</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <h3 className="text-[13px] font-medium text-gray-500">Ingresos Totales</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-gray-900">{formatMXN(totalIngresos)}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{totalContratos} contratos × $499</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-400" />
            <h3 className="text-[13px] font-medium text-gray-500">Contratos Vendidos</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-gray-900">{totalContratos}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">status = paid</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="text-[13px] font-medium text-gray-500">Pendientes de Pago</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-gray-900">{pendientes}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">checkout iniciado sin completar</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-[13px] font-medium text-gray-500">Tasa de Conversión</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-gray-900">{conversionRate}%</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">pagados / (pagados + pendientes)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[320px]">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-6">
            Contratos pagados — últimos 30 días
          </h3>
          <ContratosChart data={chartData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-[14px] font-semibold text-gray-900">Actividad Reciente</h3>
            <a href="/admin/contratos" className="text-[12px] text-blue-600 font-medium hover:text-blue-800">
              Ver todo
            </a>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {(recent ?? []).length === 0 && (
              <p className="text-center text-gray-400 text-sm py-10">Sin contratos aún.</p>
            )}
            {(recent ?? []).map((c) => (
              <div key={c.folio} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-mono font-medium text-gray-900 truncate">{c.folio}</span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[150px]">{c.arrendador_email || "—"}</span>
                  <span className="text-[11px] text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {c.status === "paid" ? "Pagado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
