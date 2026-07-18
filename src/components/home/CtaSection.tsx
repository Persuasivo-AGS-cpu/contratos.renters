import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

export function CtaSection() {
  return (
    <section className="w-full py-20 px-4 md:px-8 bg-white flex justify-center">
      <div className="relative overflow-hidden w-full max-w-[1340px] bg-[#0a0f1c] rounded-[3rem] py-32 px-6 flex flex-col items-center text-center shadow-2xl">

        {/* Dotted Background Overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            opacity: 0.15
          }}
        />

        <Reveal className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-[56px] font-display font-black text-white mb-5 tracking-tight">
            Protege tu patrimonio hoy
          </h2>

          <p className="text-gray-200 text-[18px] md:text-[20px] max-w-[700px] mx-auto leading-relaxed mb-12 font-medium">
            No arriesgues tu propiedad con contratos improvisados. Genera un contrato legal profesional en menos de 10 minutos.
          </p>

          <Link
            href="/contrato"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0d52ff] text-white text-[16px] font-bold rounded-xl hover:bg-[#003ee6] transition-all shadow-lg shadow-blue-500/20"
          >
            Generar mi Contrato <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
