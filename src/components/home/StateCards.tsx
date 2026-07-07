import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export function StateCards() {
  const states = [
    { id: 'nuevo-leon', name: 'Nuevo León', code: 'CÓDIGO CIVIL DE NUEVO LEÓN', image: '/images/states/nuevo-leon.png', available: true },
    { id: 'jalisco', name: 'Jalisco', code: 'CÓDIGO CIVIL DE JALISCO', image: '/images/states/jalisco.png', available: true },
    { id: 'queretaro', name: 'Querétaro', code: 'CÓDIGO CIVIL DE QUERÉTARO', image: '/images/states/queretaro.png', available: true },
    { id: 'merida', name: 'Mérida', code: 'CÓDIGO CIVIL DE YUCATÁN', image: '/images/states/merida.png', available: true },
    { id: 'san-luis-potosi', name: 'San Luis Potosí', code: 'CÓDIGO CIVIL DE SAN LUIS POTOSÍ', image: '/images/states/san-luis-potosi.png', available: true },
    { id: 'cdmx', name: 'Ciudad de México', code: 'CÓDIGO CIVIL PARA EL D.F.', image: '/images/states/cdmx.png', available: false },
    { id: 'edomex', name: 'Estado de México', code: 'CÓDIGO CIVIL DEL ESTADO DE MÉXICO', image: '/images/states/edomex.png', available: false },
  ];

  return (
    <section id="cobertura" className="w-full py-24 px-6 bg-surface-clean">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-display font-bold text-text-main tracking-tight mb-4">Contratos adaptados a tu estado</h2>
           <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">Cada contrato cumple con la legislación local vigente. Selecciona tu estado y genera tu contrato en minutos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => {
            const CardWrapper = state.available ? Link : 'div';
            const wrapperProps = state.available ? { href: `/contrato?estado=${state.id}` } : {};
            return (
              <CardWrapper
                key={state.id}
                {...(wrapperProps as any)}
                className={`group relative overflow-hidden rounded-2xl h-80 flex flex-col justify-end p-8 border border-border-layout/30 transition-all ${
                  state.available
                    ? 'hover:border-brand-primary/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/15 cursor-pointer'
                    : 'cursor-default opacity-70'
                }`}
              >
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${state.image})` }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                {!state.available && (
                  <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Próximamente
                  </div>
                )}

                <div className="relative z-10 flex flex-col">
                   <div className="flex items-center gap-2 mb-2 text-[#4D6BFE]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] md:text-xs uppercase font-bold tracking-[0.1em] text-gray-300">{state.code}</span>
                   </div>
                   <h3 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">{state.name}</h3>
                   <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium text-gray-400">Plantilla actualizada 2026</span>
                      {state.available && (
                        <span className="text-sm font-bold text-[#4D6BFE] flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          Ver detalles <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                   </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
