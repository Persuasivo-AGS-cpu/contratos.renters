"use client";

import { useContractStore } from "@/store/useContractStore";
import { MapPin } from "lucide-react";

const ESTATES = [
  { id: 'nuevo-leon', name: 'Nuevo León', code: 'NL' },
  { id: 'jalisco', name: 'Jalisco', code: 'JAL' },
  { id: 'cdmx', name: 'Ciudad de México', code: 'CDMX' },
  { id: 'edomex', name: 'Estado de México', code: 'EDOMEX' },
];

export function StateStep() {
  const { contract, updateContract, nextStep } = useContractStore();

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2">¿En qué estado se encuentra la propiedad?</h2>
      <p className="text-text-muted mb-8">Selecciona el estado para cargar la plantilla legal correcta.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ESTATES.map((estate) => (
          <button
            key={estate.id}
            onClick={() => updateContract('state', estate.id)}
            className={`flex items-center gap-4 p-4 border rounded-xl text-left transition-all ${
              contract.state === estate.id 
                ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' 
                : 'border-border-layout hover:border-brand-primary/50 hover:bg-surface-subtle'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center flex-shrink-0">
               <MapPin className="w-5 h-5 text-text-muted" />
            </div>
            <div>
              <span className="font-semibold block">{estate.name}</span>
              <span className="text-xs text-text-muted font-mono uppercase">{estate.code}</span>
            </div>
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
