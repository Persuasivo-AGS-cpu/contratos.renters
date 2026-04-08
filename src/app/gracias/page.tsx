import Link from "next/link";
import { MailCheck, ArrowRight, ShieldCheck, Send } from "lucide-react";

export default function GraciasPage() {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10b981] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-6 py-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="relative mb-10">
           <div className="absolute inset-0 bg-[#4D6BFE] blur-[30px] opacity-50 rounded-full" />
           <div className="relative w-28 h-28 bg-[#111827] border-2 border-white/10 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
              <MailCheck className="w-12 h-12 text-[#4D6BFE] -rotate-12" />
           </div>
        </div>

        <div className="border border-white/10 bg-white/5 rounded-full px-4 py-1.5 flex items-center gap-2 mb-6 backdrop-blur-md">
           <Send className="w-3.5 h-3.5 text-blue-400" />
           <span className="text-xs font-bold text-white uppercase tracking-widest">Despacho Exitoso</span>
        </div>

        <h1 className="text-4xl md:text-[52px] font-display font-black mb-6 text-white tracking-tight leading-none">
          ¡Revisa tu correo!
        </h1>
        
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg mx-auto font-medium">
          Hemos enviado la versión íntegra de tu <span className="text-white font-bold">Contrato de Arrendamiento</span> a tu bandeja de entrada. Revisa también tu carpeta de spam, por si acaso.
        </p>

        <div className="w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left flex gap-4 items-start shadow-xl max-w-md mx-auto mb-10">
          <div className="bg-[#10b981]/20 p-2 rounded-lg shrink-0">
             <ShieldCheck className="w-6 h-6 text-[#10b981]" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1.5 text-sm">Garantía de Legalidad</h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              El documento fue estructurado basándose en el Código Civil Estatal exacto. Tiene total validez legal inmediata.
            </p>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-flex justify-center items-center gap-3 w-full px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-xl text-lg group mb-6"
        >
          Crear otro contrato <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Support Banner */}
        <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-left gap-4 backdrop-blur-md">
           <div>
             <h5 className="text-[13px] font-bold text-white mb-0.5">¿Error de dedo en tu contrato?</h5>
             <p className="text-[12px] text-gray-400 leading-tight">Tienes 24 horas de soporte técnico para ajustes sin costo.</p>
           </div>
           <Link href="/contacto" className="shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold rounded-lg transition-colors border border-white/5">
              Hablar con Soporte
           </Link>
        </div>

      </div>
    </div>
  );
}
