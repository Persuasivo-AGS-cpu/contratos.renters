"use client";
import { useContractStore } from "@/store/useContractStore";

export function LandlordStep() {
  const { contract, updateContract, nextStep, prevStep } = useContractStore();
  
  const landlord = contract.landlord;
  
  const isEmailValid = landlord.email.includes('@') && landlord.email.includes('.');
  const isInePending = !!landlord.id_number_pending;
  const isIneValid = isInePending || landlord.id_number.length === 18;
  const isPhoneValid = landlord.phone.length === 10;
  const isNameValid = landlord.name.trim().length > 3;
  const isAddressValid = landlord.address.trim().length > 5;

  const canProceed = isEmailValid && isIneValid && isPhoneValid && isNameValid && isAddressValid;

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Datos del arrendador</h2>
      <p className="text-gray-500 mb-8">Información del propietario del inmueble.</p>
      
      <div className="space-y-6 mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <label className="block text-[14px] font-bold text-gray-900 mb-2">Nombre completo</label>
          <input 
            type="text"
            className="w-full h-12 px-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
            placeholder="Nombre completo como aparece en su INE"
            value={landlord.name}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^a-zA-Z\sñÑáéíóúÁÉÍÓÚ]/g, '');
              updateContract('landlord', { name: cleaned })
            }}
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-gray-900 mb-2">Clave de Elector (INE/IFE)</label>
          <input 
            type="text"
            maxLength={18}
            disabled={isInePending}
            className="w-full h-12 px-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px] uppercase disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            placeholder="Clave de elector de 18 dígitos"
            value={landlord.id_number}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
              updateContract('landlord', { id_number: cleaned })
            }}
          />
          {landlord.id_number.length > 0 && landlord.id_number.length < 18 && !isInePending && (
            <span className="text-[11px] text-orange-500 mt-1 block font-medium">Debe tener 18 caracteres.</span>
          )}
          <label className="mt-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-[13px] text-gray-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isInePending}
              onChange={(e) => {
                updateContract('landlord', {
                  id_number_pending: e.target.checked,
                  id_number: e.target.checked ? '' : landlord.id_number,
                });
              }}
            />
            <span>No tengo este dato en este momento. Dejar espacio para completarlo antes de la firma.</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Correo electrónico</label>
            <input 
              type="email"
              className="w-full h-12 px-4 border border-gray-200 bg-blue-50/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
              placeholder="correo@ejemplo.com"
              value={landlord.email}
              onChange={(e) => updateContract('landlord', { email: e.target.value })}
            />
            {landlord.email.length > 0 && !isEmailValid && (
               <span className="text-[11px] text-orange-500 mt-1 block font-medium">Ingresa un correo válido con @.</span>
            )}
          </div>
          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Teléfono (10 dígitos)</label>
            <input 
              type="tel"
              maxLength={10}
              className="w-full h-12 px-4 border border-blue-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
              placeholder="81 1234 5678"
              value={landlord.phone}
              onChange={(e) => {
                 const cleaned = e.target.value.replace(/\D/g, '');
                 updateContract('landlord', { phone: cleaned })
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-gray-900 mb-2">Domicilio del arrendador</label>
          <input
            type="text"
            className="w-full h-12 px-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
            placeholder="Calle, Número, Colonia, Municipio, Estado, CP"
            value={landlord.address}
            onChange={(e) => updateContract('landlord', { address: e.target.value })}
          />
          <span className="text-[11px] text-gray-400 mt-1 block">Se usará como domicilio legal para notificaciones en el contrato.</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-10">
         <button onClick={prevStep} className="flex items-center gap-2 font-bold text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Anterior
         </button>
         <button 
           onClick={nextStep} 
           disabled={!canProceed} 
           className="flex items-center justify-center gap-2 px-8 py-3 bg-[#4F46E5] hover:bg-[#4338CA] transition-all text-white rounded-xl shadow-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
         >
            Siguiente &rarr;
         </button>
      </div>
    </div>
  );
}
