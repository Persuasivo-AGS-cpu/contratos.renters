"use client";

import { useContractStore } from "@/store/useContractStore";
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
      <div className="flex-1 w-full bg-surface-clean rounded-xl border border-border-layout shadow-sm p-6 overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
}
