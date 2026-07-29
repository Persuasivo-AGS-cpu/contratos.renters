"use client";

import { useContractStore } from '@/store/useContractStore';

const TOTAL_STEPS = 7;

// Fix A (test A/B, 2026-07-29): el stepper anterior mostraba los 7 pasos
// nombrados desde la primera pantalla — comunica la longitud total del
// formulario por adelantado, anti-patrón documentado (reduce conversión en
// formularios largos). Se reemplaza por una barra de progreso continua sin
// contador de pasos, igual que la variante B (que retenía ~10x mejor en el
// mismo punto del embudo).
export function ContractStepper() {
  const currentStep = useContractStore((state) => state.currentStep);
  const pct = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="w-full mb-8 shrink-0">
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
