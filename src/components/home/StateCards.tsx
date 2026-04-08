import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export function StateCards() {
  const states = [
    { id: 'nuevo-leon', name: 'Nuevo León', code: 'CÓDIGO CIVIL DE NUEVO LEÓN', count: '1,429', image: '/images/states/nuevo-leon.png' },
    { id: 'jalisco', name: 'Jalisco', code: 'CÓDIGO CIVIL DE JALISCO', count: '1,102', image: '/images/states/jalisco.png' },
    { id: 'cdmx', name: 'Ciudad de México', code: 'CÓDIGO CIVIL PARA EL D.F.', count: '3,842', image: '/images/states/cdmx.png' },
    { id: 'edomex', name: 'Estado de México', code: 'CÓDIGO CIVIL DEL EDO. DE MÉXICO', count: '2,156', image: '/images/states/edomex.png' },
  ];

  return (
    <section id="cobertura" className="w-full py-24 px-6 bg-surface-clean">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-display font-bold text-text-main tracking-tight mb-4">Contratos adaptados a tu estado</h2>
           <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">Cada contrato cumple con la legislación local vigente. Selecciona tu estado y genera tu contrato en minutos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {states.map((state) => (
             <Link key={state.id} href="/contrato" className="group relative overflow-hidden rounded-2xl h-80 flex flex-col justify-end p-8 border border-border-layout/30 hover:border-brand-primary/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/15">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
                  style={{ backgroundImage: `url(${state.image})` }}
                ></div>
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Card Content */}
                <div className="relative z-10 flex flex-col">
                   <div className="flex items-center gap-2 mb-2 text-[#4D6BFE]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] md:text-xs uppercase font-bold tracking-[0.1em] text-gray-300">{state.code}</span>
                   </div>
                   
                   <h3 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">{state.name}</h3>
                   
                   <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium text-gray-400">{state.count} contratos generados</span>
                      <span className="text-sm font-bold text-[#4D6BFE] flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        Ver detalles <ArrowRight className="w-4 h-4" />
                      </span>
                   </div>
                </div>
             </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
