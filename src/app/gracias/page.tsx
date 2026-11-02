import Link from "next/link";
import { MailCheck, ArrowRight, ShieldCheck, Send } from "lucide-react";

export default function GraciasPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)]">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          opacity: 0.05
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3563E9] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-6 py-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="relative mb-10">
           <div className="absolute inset-0 bg-[#3563E9] blur-[30px] opacity-20 rounded-full" />
           <div className="relative w-28 h-28 bg-white border-2 border-[#3563E9]/15 rounded-3xl rotate-12 flex items-center justify-center shadow-xl">
              <MailCheck className="w-12 h-12 text-[#3563E9] -rotate-12" />
           </div>
        </div>

        <div className="border border-[#3563E9]/20 bg-[#EEF2FF] rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
           <Send className="w-3.5 h-3.5 text-[#3563E9]" />
           <span className="text-xs font-bold text-[#3563E9] uppercase tracking-widest">Despacho Exitoso</span>
        </div>

        <h1 className="text-4xl md:text-[52px] font-display font-extrabold mb-6 text-slate-900 tracking-tight leading-none">
          ¡Revisa tu correo!
        </h1>
        
        <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto font-medium">
          Hemos enviado la versión íntegra de tu <span className="text-slate-900 font-bold">Contrato de Arrendamiento</span> a tu bandeja de entrada. Revisa también tu carpeta de spam, por si acaso.
        </p>

        <div className="w-full bg-white border border-border-layout rounded-2xl p-6 text-left flex gap-4 items-start shadow-sm max-w-md mx-auto mb-10">
          <div className="bg-[#10b981]/20 p-2 rounded-lg shrink-0">
             <ShieldCheck className="w-6 h-6 text-[#10b981]" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 text-sm">Garantía de Legalidad</h4>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              El documento fue estructurado basándose en el Código Civil Estatal exacto. Tiene total validez legal inmediata.
            </p>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-flex justify-center items-center gap-3 w-full px-8 py-4 bg-[#3563E9] text-white font-semibold rounded-full hover:bg-[#2951CB] transition-all text-lg group mb-6"
        >
          Crear otro contrato <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Support Banner */}
        <div className="w-full bg-white border border-border-layout rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-left gap-4">
           <div>
             <h5 className="text-[13px] font-bold text-slate-900 mb-0.5">¿Error de dedo en tu contrato?</h5>
             <p className="text-[12px] text-slate-500 leading-tight">Tienes 24 horas de soporte técnico para ajustes sin costo.</p>
           </div>
           <Link href="/contacto" className="shrink-0 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-900 text-[12px] font-semibold rounded-full transition-colors">
              Hablar con Soporte
           </Link>
        </div>

      </div>
    </div>
  );
}
