"use client";

import { useContractStore } from "@/store/useContractStore";
import { MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ESTATES = [
  { id: 'nuevo-leon', name: 'Nuevo León', code: 'NL', available: true },
  { id: 'jalisco', name: 'Jalisco', code: 'JAL', available: true },
  { id: 'queretaro', name: 'Querétaro', code: 'QRO', available: true },
  { id: 'merida', name: 'Mérida', code: 'MER', available: true },
  { id: 'san-luis-potosi', name: 'San Luis Potosí', code: 'SLP', available: true },
  { id: 'cdmx', name: 'Ciudad de México', code: 'CDMX', available: false },
  { id: 'edomex', name: 'Estado de México', code: 'EDOMEX', available: false },
];

export function StateStep() {
  const { contract, updateContract, nextStep } = useContractStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam && !contract.state) {
      const match = ESTATES.find(e => e.id === estadoParam && e.available);
      if (match) updateContract('state', match.id);
    }
  }, []);

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2">¿En qué estado se encuentra la propiedad?</h2>
      <p className="text-text-muted mb-8">Selecciona el estado para cargar la plantilla legal correcta.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ESTATES.map((estate) => (
          <button
            key={estate.id}
            onClick={() => estate.available && updateContract('state', estate.id)}
            disabled={!estate.available}
            className={`flex items-center gap-4 p-4 border rounded-xl text-left transition-all relative ${
              !estate.available
                ? 'border-border-layout bg-surface-subtle opacity-60 cursor-not-allowed'
                : contract.state === estate.id
                ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                : 'border-border-layout hover:border-brand-primary/50 hover:bg-surface-subtle'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center flex-shrink-0">
               <MapPin className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex-1">
              <span className="font-semibold block">{estate.name}</span>
              <span className="text-xs text-text-muted font-mono uppercase">{estate.code}</span>
            </div>
            {!estate.available && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                Próximamente
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-border-layout mt-10">
         <button disabled className="flex items-center gap-2 font-bold text-gray-400 opacity-50 cursor-not-allowed">
            &larr; Anterior
         </button>
         <button
           onClick={nextStep}
           disabled={!contract.state}
           className="flex items-center justify-center gap-2 px-8 py-3 bg-[#4F46E5] hover:bg-[#4338CA] transition-all text-white rounded-xl shadow-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
         >
            Siguiente &rarr;
         </button>
      </div>
    </div>
  );
}
