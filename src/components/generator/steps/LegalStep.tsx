"use client";
import { useContractStore } from "@/store/useContractStore";
import type { ContractState } from "@/store/useContractStore";

import { analyzeClabe } from "@/utils/clabeValidator";

export function LegalStep() {
  const { contract, updateContract, nextStep, prevStep } = useContractStore();

  const clabeInfo = analyzeClabe(contract.terms.bank_clabe);
  const bankDetailsPending = !!contract.terms.bank_details_pending;

  const handleClabeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length > 18) return; // Prevent more than 18
    
    const analysis = analyzeClabe(rawVal);
    
    // Si metió menos de 18 o no fallé el limit, guardo en store 
    const updates: Partial<ContractState['terms']> = { bank_clabe: rawVal, is_valid_clabe: analysis.isValidChecksum };
    
    if (analysis.bankName && analysis.bankName !== 'No identificado') {
       updates.bank_name = analysis.bankName;
    }
    
    updateContract('terms', updates);
  };

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2">Condiciones legales</h2>
      <p className="text-text-muted mb-8">Define el método de pago, penalidades y cláusulas adicionales.</p>
      
      <div className="space-y-6 mb-10">
        <div className="p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-xl space-y-4">
           <h4 className="font-bold text-sm text-brand-primary">Datos Bancarios para Recepción del Pago</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <label className="block text-xs font-bold text-text-main mb-1">Banco</label>
               <input 
                 type="text"
                 disabled={bankDetailsPending}
                 className="w-full h-10 px-3 border border-border-layout rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                 placeholder="Ej. BANORTE"
                 value={contract.terms.bank_name || ''}
                 onChange={(e) => updateContract('terms', { bank_name: e.target.value })}
               />
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs font-bold text-text-main mb-1">CLABE Interbancaria</label>
               <input 
                 type="text"
                 disabled={bankDetailsPending}
                 className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 text-sm font-medium font-mono transition-colors ${
                   bankDetailsPending
                     ? 'border-border-layout bg-gray-100 text-gray-400 cursor-not-allowed'
                     : clabeInfo.errorType !== 'none'
                     ? 'border-red-400 focus:ring-red-400/50 bg-red-50 text-red-900' 
                     : clabeInfo.isValidChecksum 
                       ? 'border-green-400 focus:ring-green-400/50 bg-green-50 text-green-900'
                       : 'border-border-layout focus:ring-brand-primary/50'
                 }`}
                 placeholder="Ingresa tu CLABE de 18 dígitos"
                 value={clabeInfo.formattedClabe}
                 onChange={handleClabeChange}
               />
               {clabeInfo.errorType === 'length' && (
                 <p className="text-red-500 text-[10px] mt-1 font-medium">La CLABE debe tener 18 dígitos.</p>
               )}
               {clabeInfo.errorType === 'checksum' && (
                 <p className="text-red-500 text-[10px] mt-1 font-medium">La CLABE no es válida. Verifica los datos.</p>
               )}
             </div>
           </div>
           <label className="flex items-start gap-3 rounded-lg border border-brand-primary/10 bg-white/70 p-3 text-[13px] text-text-muted">
             <input
               type="checkbox"
               className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
               checked={bankDetailsPending}
               onChange={(e) => {
                 updateContract('terms', {
                   bank_details_pending: e.target.checked,
                   bank_name: e.target.checked ? '' : contract.terms.bank_name,
                   bank_account: e.target.checked ? '' : contract.terms.bank_account,
                   bank_clabe: e.target.checked ? '' : contract.terms.bank_clabe,
                   is_valid_clabe: e.target.checked ? false : contract.terms.is_valid_clabe,
                 });
               }}
             />
             <span>No tengo estos datos bancarios en este momento. Dejar espacio para completarlos antes de la firma.</span>
           </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[11px] uppercase font-bold text-text-main mb-2">Día de pago</label>
            <input 
              type="number"
              className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
              placeholder="Ej. 5"
              value={contract.terms.payment_day || ''}
              onChange={(e) => updateContract('terms', { payment_day: parseInt(e.target.value) || 5 })}
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase font-bold text-text-main mb-2">Penalidad x Retraso</label>
            <div className="relative">
              <input 
                type="number"
                className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                placeholder="Ej. 10"
                value={contract.terms.late_penalty_percent || ''}
                onChange={(e) => updateContract('terms', { late_penalty_percent: parseInt(e.target.value) || 0 })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">%</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase font-bold text-text-main mb-2" title="Meses de renta por terminar antes del plazo">Penalidad Salida</label>
            <div className="relative">
              <input 
                type="number"
                className="w-full h-12 px-4 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                placeholder="Ej. 2"
                value={contract.terms.early_termination_penalty_months || ''}
                onChange={(e) => updateContract('terms', { early_termination_penalty_months: parseInt(e.target.value) || 0 })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs">meses</span>
            </div>
          </div>
        </div>

        <div className="border border-border-layout rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">¿Incluir fiador/aval?</p>
              <p className="text-xs text-text-muted">Se agregarán campos para los datos del fiador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={contract.guarantor.includes} onChange={(e) => updateContract('guarantor', { includes: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
          </div>

          {contract.guarantor.includes && (
            <div className="mt-6 space-y-4 pt-6 border-t border-border-layout animate-in slide-in-from-top-2 fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Nombre Completo del Fiador</label>
                  <input type="text" className="w-full h-10 px-3 border border-border-layout rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-medium" placeholder="Nombre completo" value={contract.guarantor.name || ''} onChange={(e) => updateContract('guarantor', { name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Clave de Elector (INE)</label>
                  <input type="text" className="w-full h-10 px-3 border border-border-layout rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-medium" placeholder="18 caracteres" value={contract.guarantor.id_number || ''} onChange={(e) => updateContract('guarantor', { id_number: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Correo Electrónico</label>
                  <input type="email" className="w-full h-10 px-3 border border-border-layout rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-medium" placeholder="correo@ejemplo.com" value={contract.guarantor.email || ''} onChange={(e) => updateContract('guarantor', { email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Teléfono</label>
                  <input type="tel" className="w-full h-10 px-3 border border-border-layout rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-medium" placeholder="10 dígitos" value={contract.guarantor.phone || ''} onChange={(e) => updateContract('guarantor', { phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-text-main mb-1">Domicilio del Fiador</label>
                  <input type="text" className="w-full h-10 px-3 border border-border-layout rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-medium" placeholder="Calle, Número, Colonia, Municipio, Estado, CP" value={contract.guarantor.address || ''} onChange={(e) => updateContract('guarantor', { address: e.target.value })} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-text-main mb-2">Cláusulas adicionales (opcional)</label>
          <textarea 
            className="w-full h-32 p-4 border border-brand-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all bg-brand-primary/5 font-medium resize-none"
            placeholder="Ej. No se admiten mascotas..."
            value={contract.additional_clauses || ''}
            onChange={(e) => updateContract('additional_clauses', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-border-layout mt-8">
        <button onClick={prevStep} className="px-6 py-3 border border-border-layout bg-white rounded-lg hover:bg-surface-subtle transition-colors font-medium">Anterior</button>
        <button onClick={nextStep} className="px-6 py-3 bg-brand-primary/90 hover:bg-brand-primary transition-colors text-white rounded-lg flex-1 text-center font-bold">
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}
