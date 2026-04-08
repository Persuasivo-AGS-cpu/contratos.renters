import { Save, Lock, Megaphone, Webhook } from "lucide-react";

export default function AjustesPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Ajustes del Sistema</h1>
            <p className="text-[13px] text-gray-500 font-medium">Configuración de núcleo, precios y llaves de API (Fase 2).</p>
         </div>
      </div>

      <div className="space-y-6">
         {/* Pricing config */}
         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
               <DollarIcon />
               <h2 className="text-[14px] font-semibold text-gray-900">Precios y Monetización</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Precio Plan Básico (MXN)</label>
                  <input type="text" defaultValue="299.00" className="w-full h-10 px-3 text-[14px] border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
               </div>
               <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Precio Plan Protección (MXN)</label>
                  <input type="text" defaultValue="499.00" className="w-full h-10 px-3 text-[14px] border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
               </div>
            </div>
         </div>

         {/* API Keys */}
         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
               <Webhook className="w-4 h-4 text-gray-400" />
               <h2 className="text-[14px] font-semibold text-gray-900">Integraciones API</h2>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Stripe Secret Key (Modo Test)</label>
                  <input type="password" defaultValue="sk_test_51NxXXXXXXXXXXXXXXXX" className="w-full h-10 px-3 text-[14px] border border-gray-200 rounded-md font-mono text-gray-500 bg-gray-50 cursor-not-allowed" readOnly disabled/>
                  <p className="text-[11px] text-gray-400 mt-1.5">Bloqueado. Ingresa al entorno de variables para modificar.</p>
               </div>
               <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Resend API Key (Correos)</label>
                  <input type="password" defaultValue="re_123456789" className="w-full h-10 px-3 text-[14px] border border-gray-200 rounded-md font-mono text-gray-500 bg-gray-50 cursor-not-allowed" readOnly disabled/>
               </div>
            </div>
         </div>

         <div className="flex justify-end pt-4">
            <button className="h-10 px-6 bg-gray-900 text-white font-bold text-[13px] rounded-lg shadow-sm hover:bg-black transition-colors flex items-center gap-2">
               <Save className="w-4 h-4" /> Guardar Cambios
            </button>
         </div>

      </div>
    </div>
  )
}

function DollarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
}
