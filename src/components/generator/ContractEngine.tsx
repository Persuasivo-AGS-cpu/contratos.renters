"use client";

import { useEffect, useRef } from "react";
import { useContractStore } from "@/store/useContractStore";
import { getLegalStateName } from "@/lib/states";
import { trackGeneratorStep } from "@/lib/analytics";
import { trackFunnelStep } from "@/lib/funnel";
import { ContractStepper } from "./ContractStepper";
import { StateStep } from "./steps/StateStep";
import { PropertyStep } from "./steps/PropertyStep";
import { LandlordStep } from "./steps/LandlordStep";
import { TenantStep } from "./steps/TenantStep";
import { TermsStep } from "./steps/TermsStep";
import { LegalStep } from "./steps/LegalStep";
import { SummaryStep } from "./steps/SummaryStep";

export function ContractEngine() {
  const currentStep = useContractStore((state) => state.currentStep);
  const contractState = useContractStore((state) => state.contract.state);
  const propertyAddress = useContractStore((state) => state.contract.property.address);
  const updateContract = useContractStore((state) => state.updateContract);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackGeneratorStep(currentStep, contractState || undefined);
    trackFunnelStep(currentStep, contractState || undefined);
  }, [currentStep, contractState]);

  // El campo "Estado" de la dirección (PropertyStep) se muestra de solo
  // lectura, derivado del estado elegido en el paso 1, pero nunca se
  // guardaba en contract.property.address.state — salía vacío en el PDF y
  // el checkout lo rechazaba como dirección incompleta. Vive en
  // ContractEngine (siempre montado durante el wizard) y no en PropertyStep,
  // para que también corrija sesiones persistidas que ya avanzaron de paso
  // sin haber pasado por ahí con este fix activo.
  useEffect(() => {
    if (!contractState) return;
    const legalName = getLegalStateName(contractState);
    if (propertyAddress.state !== legalName) {
      updateContract('property', { address: { ...propertyAddress, state: legalName } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractState]);

  // Al cambiar de paso, volver arriba: la página (móvil) y el contenedor
  // scrolleable interno (desktop) para que el paso nuevo empiece por arriba.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    scrollRef.current?.scrollTo({ top: 0 });
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StateStep />;
      case 2:
        return <PropertyStep />;
      case 3:
        return <LandlordStep />;
      case 4:
        return <TenantStep />;
      case 5:
        return <TermsStep />;
      case 6:
        return <LegalStep />;
      case 7:
        return <SummaryStep />;
      default:
        return <StateStep />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <ContractStepper />
      <div ref={scrollRef} className="flex-1 w-full bg-surface-clean rounded-xl border border-border-layout shadow-sm p-6 overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
}
