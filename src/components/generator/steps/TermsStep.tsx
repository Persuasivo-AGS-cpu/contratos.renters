"use client";
import { useContractStore } from "@/store/useContractStore";

export function TermsStep() {
  const { contract, updateContract, nextStep, prevStep } = useContractStore();

  const canProceed =
    contract.terms.monthly_rent > 0 &&
    contract.terms.deposit_amount > 0 &&
    contract.terms.lease_start_date !== '';

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2">Términos del arrendamiento</h2>
      <p className="text-text-muted mb-8">Define las condiciones económicas y la duración del contrato.</p>
      
      <div className="space-y-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Renta mensual (MXN)</label>
            <input 
              type="number"
              className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
              placeholder="Ej. 15000"
              value={contract.terms.monthly_rent || ''}
              onChange={(e) => updateContract('terms', { monthly_rent: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Depósito en garantía (MXN)</label>
            <input 
              type="number"
              className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
              placeholder="Ej. 15000"
              value={contract.terms.deposit_amount || ''}
              onChange={(e) => updateContract('terms', { deposit_amount: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Duración del contrato</label>
            <select
              className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium bg-white"
              value={contract.terms.lease_duration_months}
              onChange={(e) => updateContract('terms', { lease_duration_months: parseInt(e.target.value) || 12 })}
            >
              <option value={6}>6 meses</option>
              <option value={12}>1 año</option>
              <option value={24}>2 años</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Fecha de inicio</label>
            <input 
              type="date"
              className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
              value={contract.terms.lease_start_date}
              onChange={(e) => updateContract('terms', { lease_start_date: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-border-layout mt-8">
        <button onClick={prevStep} className="px-6 py-3 border border-border-layout bg-white rounded-lg hover:bg-surface-subtle transition-colors font-medium">Anterior</button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="px-6 py-3 bg-brand-primary/90 hover:bg-brand-primary transition-colors text-white rounded-lg flex-1 text-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}
