import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";

export function FaqFinalCta() {
  return (
    <section className="w-full bg-white py-24 px-6 md:py-32">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        
        <div className="flex items-center gap-2 text-[#0d944c] font-bold text-[14px] mb-6">
          <CheckCircle2 className="w-5 h-5 fill-[#E6F4EA]" />
          Todo resuelto. Listo para empezar.
        </div>

        <h2 className="text-4xl md:text-[50px] font-display font-black text-[#111] mb-6 tracking-tight leading-tight">
          ¿Listo para generar tu contrato?
        </h2>
        
        <p className="text-[#4b5563] text-[18px] md:text-[20px] mb-10 font-medium">
          En menos de 10 minutos tienes un contrato legal, personalizado y listo para firmar.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a 
            href="mailto:soporte@renters.mx"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-gray-200 text-[#111] font-bold text-[16px] hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Tengo más dudas
          </a>
          
          <Link 
            href="/contrato"
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#1a56ff] border-2 border-[#1a56ff] text-white text-[16px] font-bold rounded-xl hover:bg-[#003ee6] hover:border-[#003ee6] transition-all shadow-lg shadow-blue-500/20"
          >
            Generar Contrato <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
