"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroProcessSection() {
  return (
    <section className="w-full bg-white pt-20 pb-20 md:pt-32 md:pb-28 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Column */}
        <div className="flex-1 w-full max-w-xl">
          <div className="inline-block px-3 py-1 font-bold text-xs uppercase tracking-[0.2em] mb-6 text-[#1a56ff]">
            PROCESO
          </div>
          
          <h1 className="text-5xl md:text-[64px] font-display font-black text-[#111] leading-[1.05] tracking-tight mb-8">
            Tu contrato legal,<br/>
            <span className="text-[#1a56ff]">en menos de 10 minutos</span>
          </h1>
          
          <p className="text-[#4b5563] text-[20px] md:text-[22px] leading-relaxed mb-10 font-medium">
            Sin abogados, sin citas, sin complicaciones. Solo un formulario simple y tu contrato listo para firmar.
          </p>
          
          <Link 
            href="/contrato"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a56ff] text-white text-[16px] font-bold rounded-xl hover:bg-[#003ee6] transition-all shadow-lg shadow-blue-500/20"
          >
            Empezar ahora <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Right Column Grid */}
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            
            {/* Box 1 */}
            <div className="bg-[#fbfcff] border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="text-4xl lg:text-[44px] font-display font-black text-[#1a56ff] mb-2 tracking-tight">
                &lt; 10 min
              </div>
              <p className="text-gray-600 font-medium text-[15px]">Para tener tu contrato</p>
            </div>

            {/* Box 2 */}
            <div className="bg-[#fbfcff] border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="text-4xl lg:text-[44px] font-display font-black text-[#1a56ff] mb-2 tracking-tight">
                $499 MXN
              </div>
              <p className="text-gray-600 font-medium text-[15px]">Precio desde</p>
            </div>

            {/* Box 3 */}
            <div className="bg-[#fbfcff] border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="text-4xl lg:text-[44px] font-display font-black text-[#1a56ff] mb-2 tracking-tight">
                5 estados
              </div>
              <p className="text-gray-600 font-medium text-[15px]">Disponibles ahora</p>
            </div>

            {/* Box 4 */}
            <div className="bg-[#fbfcff] border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="text-4xl lg:text-[44px] font-display font-black text-[#1a56ff] mb-2 tracking-tight">
                100%
              </div>
              <p className="text-gray-600 font-medium text-[15px]">Legal y válido</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
