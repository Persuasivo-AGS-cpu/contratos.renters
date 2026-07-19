import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { STATES } from "@/lib/states";

// Rótulo del badge por estado; los irregulares (no siguen "CÓDIGO CIVIL DE X") van aquí.
const CODE_LABEL_OVERRIDES: Partial<Record<string, string>> = {
  cdmx: 'CÓDIGO CIVIL PARA EL D.F.',
  edomex: 'CÓDIGO CIVIL DEL ESTADO DE MÉXICO',
};

const ALL_STATES = Object.entries(STATES).map(([id, s]) => ({
  id,
  name: s.name,
  code: CODE_LABEL_OVERRIDES[id] ?? `CÓDIGO CIVIL DE ${s.legalName.toUpperCase()}`,
  image: `/images/states/${id}.png`,
  available: s.available,
}));

export function StateCards() {
  const available = ALL_STATES.filter((s) => s.available);
  const comingSoon = ALL_STATES.filter((s) => !s.available);

  return (
    <section id="cobertura" className="w-full py-24 px-6 bg-surface-clean">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-display font-bold text-text-main tracking-tight mb-4">Contratos adaptados a tu estado</h2>
           <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">Cada contrato cumple con la legislación local vigente. Selecciona tu estado y genera tu contrato en minutos.</p>
        </div>

        {/* Estados disponibles — flex centrado para que la última fila (2) no quede huérfana */}
        <div className="flex flex-wrap justify-center gap-6">
          {available.map((state, i) => (
            <Reveal key={state.id} delay={i * 0.08} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <Link
                href={`/contrato?estado=${state.id}`}
                className="group relative overflow-hidden rounded-2xl h-80 w-full flex flex-col justify-end p-8 border border-border-layout/30 transition-all hover:border-brand-primary/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/15 cursor-pointer"
              >
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${state.image})` }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col">
                   <div className="flex items-center gap-2 mb-2 text-[#4D6BFE]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] md:text-xs uppercase font-bold tracking-[0.1em] text-gray-300">{state.code}</span>
                   </div>
                   <h3 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">{state.name}</h3>
                   <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium text-gray-400">Plantilla actualizada 2026</span>
                      <span className="text-sm font-bold text-[#4D6BFE] flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        Ver detalles <ArrowRight className="w-4 h-4" />
                      </span>
                   </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Próximamente — strip compacto, comunica roadmap sin dejar cards huérfanas */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
            <Clock className="w-4 h-4" /> Próximamente
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {comingSoon.map((state) => (
              <span
                key={state.id}
                className="px-4 py-2 rounded-full border border-border-layout bg-surface-subtle text-sm font-semibold text-text-muted"
              >
                {state.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
