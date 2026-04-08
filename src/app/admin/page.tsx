import { TrendingUp, FileText, Map, Activity, ArrowUpRight, DollarSign, Download, Search, Filter } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Visión General</h1>
         <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Exportar Reporte
         </button>
      </div>

      {/* KPI Cards (Stripe Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex flex-row items-center gap-2 mb-3">
               <DollarSign className="w-4 h-4 text-gray-400" />
               <h3 className="text-[13px] font-medium text-gray-500">Ingresos (Mes)</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
               <span className="text-2xl font-bold text-gray-900">$124,500</span>
               <span className="text-[12px] font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 12.5%</span>
            </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex flex-row items-center gap-2 mb-3">
               <FileText className="w-4 h-4 text-gray-400" />
               <h3 className="text-[13px] font-medium text-gray-500">Contratos Generados</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
               <span className="text-2xl font-bold text-gray-900">4,203</span>
               <span className="text-[12px] font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 8.1%</span>
            </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex flex-row items-center gap-2 mb-3">
               <Map className="w-4 h-4 text-gray-400" />
               <h3 className="text-[13px] font-medium text-gray-500">Estado Líder</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
               <span className="text-2xl font-bold text-gray-900">N.L.</span>
               <span className="text-[13px] font-medium text-gray-500">65% del Share</span>
            </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex flex-row items-center gap-2 mb-3">
               <Activity className="w-4 h-4 text-gray-400" />
               <h3 className="text-[13px] font-medium text-gray-500">Tasa de Conversión</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
               <span className="text-2xl font-bold text-gray-900">24.8%</span>
               <span className="text-[12px] font-medium text-gray-500">Visitantes/Pagos</span>
            </div>
         </div>

      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
         
         <div className="flex-1 w-full relative">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Estado</label>
            <select className="w-full h-[38px] px-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer appearance-none">
               <option value="">Nacional (Todos)</option>
               <option value="NL">Nuevo León</option>
               <option value="CDMX">CDMX</option>
               <option value="JAL">Jalisco</option>
               <option value="EDOMEX">EDOMEX</option>
            </select>
            <div className="absolute right-3 top-[32px] pointer-events-none text-gray-400">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
         </div>

         <div className="flex-1 w-full relative">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Vigencia / Fecha</label>
            <select className="w-full h-[38px] px-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer appearance-none">
               <option value="">Este Mes</option>
               <option value="last_month">Mes Anterior</option>
               <option value="ytd">YTD (Año actual)</option>
               <option value="all">Histórico Completo</option>
            </select>
            <div className="absolute right-3 top-[32px] pointer-events-none text-gray-400">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
         </div>

         <div className="flex-1 w-full relative">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Tipo de Inmueble</label>
            <select className="w-full h-[38px] px-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer appearance-none">
               <option value="">Residencial y Comercial</option>
               <option value="casa">Solo Casas</option>
               <option value="departamento">Solo Departamentos</option>
               <option value="comercial">Locales / Oficinas</option>
            </select>
            <div className="absolute right-3 top-[32px] pointer-events-none text-gray-400">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
         </div>

         <div className="flex-[2] w-full relative">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Rastreo por Parte Legal</label>
            <Search className="absolute left-3 top-[29px] w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre de Arrendador o Inquilino..." 
              className="w-full h-[38px] pl-9 pr-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
            />
         </div>

         <button className="h-[38px] px-5 bg-[#0f172a] text-white text-[13px] font-bold rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm border border-transparent">
            <Filter className="w-4 h-4" /> Aplicar
         </button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Main Chart Placeholder */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[400px]">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-6">Volumen de Contratos (Últimos 30 días)</h3>
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
               {/* Simulating a bar chart with pure CSS blocks for mockup */}
               <div className="flex items-end justify-center gap-3 md:gap-6 h-48 w-full px-6">
                  {[40, 60, 45, 80, 55, 90, 110, 85, 120, 100].map((h, i) => (
                    <div key={i} className="w-full max-w-[40px] bg-blue-100 hover:bg-blue-600 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                          {h}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Recent Transactions List */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="text-[14px] font-semibold text-gray-900">Actividad Reciente</h3>
               <button className="text-[12px] text-blue-600 font-medium hover:text-blue-800">Ver todo</button>
            </div>
            <div className="flex-1 overflow-y-auto">
               {[
                 { user: 'juan.perez@example.com', amount: '$499.00', status: 'Pagado', time: 'hace 2 min' },
                 { user: 'm.gomez@empresa.mx', amount: '$499.00', status: 'Pagado', time: 'hace 14 min' },
                 { user: 'roberto_1985@gmail.com', amount: '$499.00', status: 'Pagado', time: 'hace 1 hora' },
                 { user: 'ana.sofia@realestate.com', amount: '$499.00', status: 'Pagado', time: 'hace 3 horas' },
                 { user: 'desconocido', amount: '$0.00', status: 'Abandonado', time: 'hace 4 horas' },
                 { user: 'luis.t@hotmail.com', amount: '$499.00', status: 'Pagado', time: 'hace 5 horas' },
               ].map((txn, idx) => (
                 <div key={idx} className="px-5 py-3 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex flex-col">
                       <span className="text-[13px] font-medium text-gray-900 truncate max-w-[150px]">{txn.user}</span>
                       <span className="text-[11px] text-gray-400">{txn.time}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[13px] font-medium text-gray-900">{txn.amount}</span>
                       <span className={`text-[10px] font-bold ${txn.status === 'Pagado' ? 'text-emerald-600' : 'text-gray-400'}`}>
                         {txn.status}
                       </span>
                    </div>
                 </div>
               ))}
             </div>
         </div>

      </div>

    </div>
  )
}
