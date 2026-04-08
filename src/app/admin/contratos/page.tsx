import { Search, Filter, Download, MoreHorizontal, FileText, ExternalLink } from "lucide-react";

export default function ContratosAdminPage() {
  const contracts = [
    { code: "CT-NL-8493", address: "Joya Topacio 103", state: "Nuevo León", author: "juan.perez@example.com", pdf: true, date: "08 Abr, 14:35" },
    { code: "CT-CDMX-8492", address: "Av. Reforma 222", state: "CDMX", author: "m.gomez@empresa.mx", pdf: true, date: "08 Abr, 11:18" },
    { code: "CT-JAL-8491", address: "López Cotilla 1500", state: "Jalisco", author: "luis.t@hotmail.com", pdf: false, date: "07 Abr, 18:20" },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Registro de Contratos</h1>
            <p className="text-[13px] text-gray-500 font-medium">Base de datos documental generada por Renters HQ.</p>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-t-xl border border-gray-200 border-b-0 flex items-center justify-between gap-4">
         <div className="flex-1 w-full max-w-sm relative ml-2">
            <Search className="absolute left-3 top-[10px] w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por dirección o código..." 
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
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Documento</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Propiedad</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Entidad</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Generado por</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">PDF</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Opciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {contracts.map((c, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-5 py-3.5 text-[13px] font-mono text-blue-600 font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" /> {c.code}
                         </td>
                         <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900">{c.address}</td>
                         <td className="px-5 py-3.5 text-[13px] text-gray-600">{c.state}</td>
                         <td className="px-5 py-3.5 text-[13px] text-gray-500">{c.author}</td>
                         <td className="px-5 py-3.5 text-center">
                            {c.pdf ? (
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                            ) : (
                              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" title="Borrador"></span>
                            )}
                         </td>
                         <td className="px-5 py-3.5 text-[13px] text-gray-500">{c.date}</td>
                         <td className="px-5 py-3.5 text-right">
                            <button className="p-1 rounded hover:bg-gray-200 text-gray-400 group-hover:text-blue-600 transition-colors" title="Ver detalle">
                               <ExternalLink className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  )
}
