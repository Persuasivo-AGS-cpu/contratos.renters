"use client";

import { useEffect } from "react";
import { getStateTemplate } from "@/components/generator/templates/getStateTemplate";
import { useContractStore } from "@/store/useContractStore";
import type { ContractState } from "@/store/useContractStore";

interface Props {
  contractData: ContractState;
  folio: string;
}

export default function ImprimirClient({ contractData, folio }: Props) {
  const { updateContract } = useContractStore();
  const StateTemplate = getStateTemplate(contractData.state);

  useEffect(() => {
    // Hidratar store con los datos del contrato verificado en servidor
    Object.entries(contractData).forEach(([key, value]) => {
      updateContract(key as keyof ContractState, value);
    });
    updateContract('status', 'paid');

    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main id="print-area" className="bg-white min-h-screen p-8 max-w-4xl mx-auto print:p-0 print:m-0">
      <div className="mb-4 print:hidden flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Folio: {folio}</span>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Descargar / Imprimir PDF
        </button>
      </div>
      <StateTemplate />
    </main>
  );
}
