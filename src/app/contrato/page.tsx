import { Suspense } from "react";
import { ContractEngine } from "@/components/generator/ContractEngine";
import { ContractPreview } from "@/components/generator/ContractPreview";
import { ResumeContractToast } from "@/components/generator/ResumeContractToast";

export default function ContractGeneratorPage() {
  return (
    <>
      <div className="flex w-full bg-surface-subtle overflow-hidden h-[calc(100vh-5rem)]">
        {/* Columna Izquierda: Engine */}
        <div className="w-full md:w-[650px] lg:w-[700px] flex-shrink-0 flex flex-col pt-8 md:pt-10 mb-6 px-6 md:px-10 border-r border-border-layout bg-surface-clean overflow-y-auto overflow-x-hidden z-50 shadow-lg relative h-full pb-10">
          <h1 className="text-3xl font-display font-bold mb-8 shrink-0">Generador de Contrato</h1>
          <div className="w-full flex-1 min-h-0">
            <Suspense>
              <ContractEngine />
            </Suspense>
          </div>
        </div>

        {/* Columna Derecha: Preview inmersivo. Menor padding */}
        <div className="flex-1 bg-surface-subtle p-4 lg:p-6 lg:pb-12 relative hidden md:flex flex-col justify-start overflow-y-auto">
          <div className="max-w-[850px] mx-auto w-full h-auto">
            <ContractPreview />
          </div>
        </div>
      </div>
      <ResumeContractToast />
    </>
  );
}
