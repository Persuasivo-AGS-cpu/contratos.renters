"use client";

import { useEffect, useState } from "react";
import { useContractStore } from "@/store/useContractStore";
import { FileText, X } from "lucide-react";

export function ResumeContractToast() {
  const { contract, currentStep, resetContract } = useContractStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasProgress =
      contract.state !== '' ||
      contract.landlord.name !== '' ||
      contract.tenant.name !== '' ||
      contract.property.address.street !== '';

    if (hasProgress && contract.status === 'pending' && currentStep > 1) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleDiscard = () => {
    resetContract();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1e293b] border border-white/10 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-none mb-1">Tienes un contrato en progreso</p>
          <p className="text-xs text-gray-400 leading-tight truncate">
            {contract.state ? `Estado: ${contract.state.replace('-', ' ')}` : 'Continúa donde lo dejaste'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDiscard}
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
          >
            Descartar
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Continuar
          </button>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
