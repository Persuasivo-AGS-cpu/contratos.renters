"use client";

import { useContractStore } from "@/store/useContractStore";
import { trackBeginCheckout } from "@/lib/analytics";
import { Lock, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { contract } = useContractStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const plan = contract.selectedPlan || 'basico';
  const priceDisplay = plan === 'proteccion' ? '899' : plan === 'pack' ? '1,999' : '499';
  const planName = plan === 'proteccion'
    ? 'Contrato legal + Póliza de Protección'
    : plan === 'pack'
    ? 'Pack Inmobiliario (5 Contratos)'
    : 'Contrato de Arrendamiento Regionalizado';

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    trackBeginCheckout(contract.state, plan);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract, plan }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Error al iniciar pago');
      }

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-clean rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

        <div className="bg-surface-subtle p-6 border-b border-border-layout flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-primary" /> Checkout Seguro
            </h3>
            <p className="text-sm text-text-muted">Desbloquear Contrato Legal — {contract.state.toUpperCase() || 'GENERAL'}</p>
          </div>
          <p className="text-2xl font-mono font-bold text-text-main">
            ${priceDisplay}
            <span className="text-sm text-text-muted"> MXN</span>
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
            <div className="bg-white p-2 rounded shadow-sm">
              <FileText className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{planName}</p>
              <p className="text-xs text-text-muted">Incluye revisión bajo código civil del estado seleccionado y archivo PDF final.</p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <p className="text-xs text-text-muted text-center">
            Serás redirigido a Stripe para completar el pago de forma segura.
          </p>
        </div>

        <div className="p-6 border-t border-border-layout bg-gray-50 space-y-3">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-12 bg-text-main hover:bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Redirigiendo a Stripe...
              </>
            ) : (
              <>Pagar ${priceDisplay}.00 MXN</>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full h-10 text-sm text-text-muted hover:text-text-main transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <div className="flex items-center justify-center gap-1 text-xs text-text-muted">
            <CheckCircle2 className="w-3 h-3 text-brand-accent" />
            <p>Pagos procesados de forma segura mediante Stripe</p>
          </div>
        </div>

      </div>
    </div>
  );
}
