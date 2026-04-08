"use client";
import { useContractStore } from "@/store/useContractStore";
import { useState } from "react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { MapPin, Home, User, UserCheck, DollarSign, Scale, Check } from "lucide-react";

export function SummaryStep() {
  const { contract, prevStep } = useContractStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stateLabels: Record<string, string> = {
    'nuevo-leon': 'Nuevo León',
    'jalisco': 'Jalisco',
    'cdmx': 'Ciudad de México',
    'edomex': 'Estado de México'
  };

  const typeLabels: Record<string, string> = {
    casa: 'Casa',
    departamento: 'Departamento',
    local: 'Local Comercial',
    oficina: 'Oficina'
  };

  const addr = contract.property.address;
  const addressLine = `${addr.street} ${addr.ext_num}`;

  return (
    <div className="max-w-2xl pb-10">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Resumen del contrato</h2>
      <p className="text-gray-500 mb-8">Revisa los datos antes de generar tu contrato.</p>

      <div className="space-y-4 mb-8">
        {/* ESTADO */}
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
           <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold text-gray-500 tracking-wider">ESTADO</span>
           </div>
           <p className="font-bold text-gray-900 text-[16px]">{stateLabels[contract.state] || 'Nuevo León'}</p>
           <p className="text-[13px] text-gray-500">Código Civil para el Estado de {stateLabels[contract.state] || 'Nuevo León'}</p>
        </div>

        {/* PROPIEDAD */}
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
           <div className="flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold text-gray-500 tracking-wider">PROPIEDAD</span>
           </div>
           <p className="font-bold text-gray-900 text-[16px] mb-2">{addressLine || 'Joya Topacio 103'}</p>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-[12px] rounded-full">
                {typeLabels[contract.property.type] || 'Departamento'}
              </span>
              {contract.property.furnished && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-[12px] rounded-full">
                  Amueblada
                </span>
              )}
           </div>
        </div>

        {/* ARRENDADOR E INQUILINO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <User className="w-4 h-4 text-blue-600" />
                   <span className="text-[11px] font-bold text-gray-500 tracking-wider">ARRENDADOR</span>
                </div>
                <p className="font-bold text-gray-900 text-[14px]">{contract.landlord.name || 'Sin nombre'}</p>
                <p className="text-[12px] text-gray-500 mb-2">{contract.landlord.email || 'Sin correo'}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-1">
                 <p className="text-[11px] text-gray-400 font-mono">INE: {contract.landlord.id_number}</p>
                 <p className="text-[11px] text-gray-400 capitalize">{contract.landlord.address}</p>
              </div>
           </div>
           
           <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <UserCheck className="w-4 h-4 text-blue-600" />
                   <span className="text-[11px] font-bold text-gray-500 tracking-wider">INQUILINO</span>
                </div>
                <p className="font-bold text-gray-900 text-[14px]">{contract.tenant.name || 'Sin nombre'}</p>
                <p className="text-[12px] text-gray-500 mb-2">{contract.tenant.email || 'Sin correo'}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-1">
                 <p className="text-[11px] text-gray-400 font-mono">INE: {contract.tenant.id_number}</p>
                 <p className="text-[11px] text-gray-400 capitalize">{contract.tenant.address}</p>
              </div>
           </div>
        </div>

        {/* TÉRMINOS */}
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
           <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold text-gray-500 tracking-wider">TÉRMINOS</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Renta mensual</p>
                <p className="font-bold text-gray-900 text-[15px]">${contract.terms.monthly_rent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Depósito</p>
                <p className="font-bold text-gray-900 text-[15px]">${contract.terms.deposit_amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Duración</p>
                <p className="font-bold text-gray-900 text-[15px]">{contract.terms.lease_duration_months} meses</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Pago</p>
                <p className="font-bold text-gray-900 text-[15px] capitalize">{contract.terms.payment_method}</p>
              </div>
           </div>
        </div>

        {/* ADICIONAL */}
        {contract.additional_clauses && (
           <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                 <Scale className="w-4 h-4 text-blue-600" />
                 <span className="text-[11px] font-bold text-gray-500 tracking-wider">ADICIONAL</span>
              </div>
              <p className="italic text-[14px] text-gray-700">"{contract.additional_clauses}"</p>
           </div>
        )}
      </div>

      <div className="mb-10 p-5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl flex items-start gap-3">
         <Check className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
         <p className="text-[14px] text-[#065f46]">
            Al generar el contrato, se creará un PDF legal basado en la plantilla de <strong>{stateLabels[contract.state] || 'Nuevo León'}</strong>, conforme al Código Civil de {contract.state.toUpperCase()}.
         </p>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-10">
         <button onClick={prevStep} className="flex items-center gap-2 font-bold text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Anterior
         </button>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center justify-center gap-2 px-8 py-3 bg-[#4F46E5] hover:bg-[#4338CA] transition-all text-white rounded-xl shadow-md font-bold"
         >
            Proceder al Pago
         </button>
      </div>

      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
