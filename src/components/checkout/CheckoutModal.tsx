"use client";

import { useContractStore } from "@/store/useContractStore";
import { Lock, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { contract, updateContract } = useContractStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      updateContract('status', 'paid');
      router.push('/success');
    }, 2500); // Simulando conexión con Stripe
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-clean rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="bg-surface-subtle p-6 border-b border-border-layout flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-primary" /> Checkout Seguro
            </h3>
            <p className="text-sm text-text-muted">Desbloquear Contrato Legal - {contract.state.toUpperCase() || 'GENERAL'}</p>
          </div>
          <p className="text-2xl font-mono font-bold text-text-main">
            ${contract.selectedPlan === 'proteccion' ? '899' : contract.selectedPlan === 'pack' ? '1,999' : '499'} 
            <span className="text-sm text-text-muted"> MXN</span>
          </p>
        </div>

        {/* Body Modal / Simulación de Tarjeta */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
            <div className="bg-white p-2 rounded shadow-sm">
              <FileText className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {contract.selectedPlan === 'proteccion' ? 'Contrato legal + Póliza de Protección' : contract.selectedPlan === 'pack' ? 'Pack Inmobiliario (5 Contratos)' : 'Contrato de Arrendamiento Regionalizado'}
              </p>
              <p className="text-xs text-text-muted">Incluye revisión bajo código civil del estado seleccionado, firmas digitales y archivo PDF final.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Información de Pago (Simulación)</label>
              <div className="h-12 w-full border border-border-layout rounded-lg flex items-center px-4 bg-gray-50 text-gray-400 font-mono text-sm">
                 •••• •••• •••• 4242
                 <div className="ml-auto flex gap-2">
                    <span className="w-8 h-5 bg-gray-200 rounded"></span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Acción */}
        <div className="p-6 border-t border-border-layout bg-gray-50">
          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-12 bg-text-main hover:bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando pago...
              </>
            ) : (
              <>
                Pagar ${contract.selectedPlan === 'proteccion' ? '899' : contract.selectedPlan === 'pack' ? '1,999' : '499'}.00
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1 mt-4 text-xs text-text-muted">
            <CheckCircle2 className="w-3 h-3 text-brand-accent" /> 
            <p>Pagos procesados de forma segura mediante Stripe (Dummy Mode)</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
