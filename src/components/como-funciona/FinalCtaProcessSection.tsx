import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCtaProcessSection() {
  return (
    <section className="w-full bg-white py-32 px-6">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-[50px] font-display font-black text-[#111] mb-6 tracking-tight leading-tight">
          ¿Listo para generar tu contrato?
        </h2>
        <p className="text-[#4b5563] text-[18px] md:text-[20px] mb-10 font-medium">
          Comienza ahora y ten tu contrato legal en menos de 10 minutos.
        </p>
        <Link 
          href="/contrato"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a56ff] text-white text-[16px] font-bold rounded-xl hover:bg-[#003ee6] transition-all shadow-lg shadow-blue-500/20"
        >
          Generar Contrato <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
