import { Search, Filter, Download, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TransaccionesPage() {
  const transactions = [
    { id: "pi_1NqZ...", email: "juan.perez@example.com", plan: "Protección", amount: "$499.00", status: "succeeded", date: "08 Abr, 14:32" },
    { id: "pi_1NqX...", email: "m.gomez@empresa.mx", plan: "Básico", amount: "$299.00", status: "succeeded", date: "08 Abr, 11:15" },
    { id: "pi_1NyP...", email: "desconocido", plan: "N/A", amount: "$0.00", status: "failed", date: "08 Abr, 09:42" },
    { id: "pi_1NzQ...", email: "luis.t@hotmail.com", plan: "Protección", amount: "$499.00", status: "refunded", date: "07 Abr, 18:20" },
    { id: "pi_1NaW...", email: "ana.sofia@realestate.com", plan: "Pack x5", amount: "$1,499.00", status: "succeeded", date: "07 Abr, 16:05" },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Transacciones</h1>
            <p className="text-[13px] text-gray-500 font-medium">Historial de pagos procesados por Stripe (Modo Real).</p>
         </div>
         <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Exportar CSV
         </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-t-xl border border-gray-200 border-b-0 flex items-center justify-between gap-4">
         <div className="flex-1 w-full max-w-sm relative ml-2">
            <Search className="absolute left-3 top-[10px] w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID, email o monto..." 
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-transparent text-gray-900 focus:outline-none placeholder-gray-400"
            />
         </div>
         <div className="flex items-center gap-2 pr-2">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <Filter className="w-3.5 h-3.5" /> Estado: Todos
             </button>
         </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">ID Pago</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Acción</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {transactions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-5 py-3.5 text-[13px] font-mono text-gray-500">{t.id}</td>
                         <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900">{t.email}</td>
                         <td className="px-5 py-3.5 text-[13px] text-gray-600">{t.plan}</td>
                         <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900">{t.amount}</td>
                         <td className="px-5 py-3.5">
                            {t.status === 'succeeded' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"><ArrowUpRight className="w-3 h-3"/> Completado</span>}
                            {t.status === 'failed' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-100"><ArrowDownRight className="w-3 h-3"/> Fallido</span>}
                            {t.status === 'refunded' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Reembolsado</span>}
                         </td>
                         <td className="px-5 py-3.5 text-[13px] text-gray-500">{t.date}</td>
                         <td className="px-5 py-3.5 text-right">
                            <button className="p-1 rounded hover:bg-gray-200 text-gray-400 group-hover:text-gray-600 transition-colors">
                               <MoreHorizontal className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-[12px] text-gray-500 font-medium">
             <span>Mostrando 5 de 1,204 transacciones</span>
             <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white transition-colors" disabled>Anterior</button>
                <button className="px-3 py-1 border border-gray-200 rounded bg-white shadow-sm hover:bg-gray-50 transition-colors">Siguiente</button>
             </div>
          </div>
      </div>
    </div>
  )
}
