"use client";

import Link from "next/link";
import { CheckCircle2, Mail, Download, ShieldCheck, DownloadCloud } from "lucide-react";
import { useContractStore } from "@/store/useContractStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const { contract } = useContractStore();
  const [email, setEmail] = useState(contract.landlord.email || contract.tenant.email || "");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSendEmail = () => {
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      router.push('/gracias');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden bg-[#0a0f1c]">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#111827] to-[#0a0f1c]" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          opacity: 0.1
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4D6BFE] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-6 py-12 flex flex-col items-center text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-8 transform -rotate-6">
           <CheckCircle2 className="w-12 h-12 text-white transform rotate-6" />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black mb-4 text-white tracking-tight">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
          Hemos liberado el bloqueo corporativo. Tu contrato de arrendamiento oficial está listo para utilizarse.
        </p>

        {/* Action Cards Container */}
        <div className="w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link 
              href="/"
              className="flex flex-col items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl p-6 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                 <DownloadCloud className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                 <span className="block font-bold text-lg leading-none mb-1">Descargar</span>
                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Archivo PDF</span>
              </div>
            </Link>

            <div className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                 <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-center w-full">
                 <span className="block font-bold text-lg leading-none mb-3 text-white">Enviar copia</span>
                 <div className="relative w-full">
                    <input 
                      type="email" 
                      placeholder="ejemplo@correo.com" 
                      className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-white text-center"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                 </div>
              </div>
            </div>
          </div>

          <button 
             onClick={handleSendEmail} 
             disabled={sent || !email}
             className="w-full h-14 bg-[#4D6BFE] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-[#3b55d9] transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:grayscale"
          >
             {sent ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Enviando contrato...
               </span>
             ) : (
               "Despachar Contrato"
             )}
          </button>

        </div>

        {/* Support & Packages Links */}
        <div className="mt-8 flex flex-col items-center gap-4 w-full">
           <div className="flex items-center justify-center gap-2 text-gray-500 bg-white/5 py-2 px-4 rounded-full border border-white/5 shadow-sm">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-xs font-medium">Contrato redactado jurídicamente y listo para firma.</span>
           </div>

           <div className="w-full bg-[#111827]/50 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-left gap-4 backdrop-blur-md">
             <div>
               <h5 className="text-[13px] font-bold text-white mb-0.5">¿Notaste un error en tu contrato?</h5>
               <p className="text-[12px] text-gray-400 leading-tight">No te preocupes. Tienes soporte gratuito para corregir datos (nombres, fechas) en las primeras 24 horas.</p>
             </div>
             <Link href="/contacto" className="shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold rounded-lg transition-colors border border-white/5">
                Contactar Soporte
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
