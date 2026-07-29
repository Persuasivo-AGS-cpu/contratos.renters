"use client";

import { useContractStore } from "@/store/useContractStore";
import { STATES } from "@/lib/states";
import { WaitlistCapture } from "@/components/generator/WaitlistCapture";
import { MapPin, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ESTATES = Object.entries(STATES).map(([id, s]) => ({ id, ...s }));

export function StateStep() {
  const { contract, updateContract, nextStep } = useContractStore();
  const [waitlistState, setWaitlistState] = useState<string | null>(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  const searchParams = useSearchParams();

  // El estado elegido en el banner/tarjetas de la home (?estado=) es una
  // elección explícita: gana sobre lo que haya quedado en el store persistido.
  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam) {
      const match = ESTATES.find(e => e.id === estadoParam && e.available);
      if (match && match.id !== contract.state) updateContract('state', match.id);
    }
  }, []);

  // Fix A (test A/B, 2026-07-29): antes había que elegir el estado Y ADEMÁS
  // hacer click en "Siguiente" — un click extra que el 99% no completaba.
  // Ahora elegir el estado avanza solo, con una pausa breve para que se vea
  // el resaltado de la selección antes de pasar al siguiente paso (igual
  // patrón sin-gate que ya usa la variante B).
  const selectState = (id: string) => {
    updateContract('state', id);
    setTimeout(() => nextStep(), 350);
  };

  // Captura opcional: hace recuperable a quien abandona antes del checkout y
  // prellena el correo del arrendador en el paso 3.
  const saveLead = () => {
    if (!leadEmail.includes("@") || leadSaved) return;
    setLeadSaved(true);
    if (!contract.landlord.email) {
      updateContract("landlord", { email: leadEmail.trim() });
    }
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: leadEmail.trim(), estado: contract.state || null }),
    }).catch(() => {});
  };

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2">¿En qué estado se encuentra la propiedad?</h2>
      <p className="text-text-muted mb-8">Selecciona el estado para cargar la plantilla legal correcta.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ESTATES.map((estate) => (
          <button
            key={estate.id}
            onClick={() =>
              estate.available
                ? selectState(estate.id)
                : setWaitlistState(estate.id)
            }
            className={`flex items-center gap-4 p-4 border rounded-xl text-left transition-all relative ${
              !estate.available
                ? 'border-border-layout bg-surface-subtle opacity-60'
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

      {waitlistState && (
        <WaitlistCapture estado={waitlistState} onClose={() => setWaitlistState(null)} />
      )}

      {contract.state && (
        <div className="mt-6 p-4 bg-surface-subtle border border-border-layout rounded-xl">
          {leadSaved ? (
            <p className="text-[13px] text-gray-600 font-medium flex items-center gap-2">
              <Save className="w-4 h-4 text-emerald-600 shrink-0" />
              Listo — tu avance queda ligado a tu correo.
            </p>
          ) : (
            <>
              <p className="text-[13px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                <Save className="w-4 h-4 text-gray-400" /> Guarda tu avance (opcional)
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveLead()}
                  placeholder="tu@correo.com"
                  className="flex-1 min-w-0 h-10 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
                />
                <button
                  onClick={saveLead}
                  disabled={!leadEmail.includes("@")}
                  className="shrink-0 w-full sm:w-auto px-4 h-10 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-bold rounded-lg transition-colors disabled:opacity-40"
                >
                  Guardar
                </button>
              </div>
            </>
          )}
        </div>
      )}

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
