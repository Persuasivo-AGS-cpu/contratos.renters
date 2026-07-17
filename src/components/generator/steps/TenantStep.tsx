"use client";
import { useContractStore } from "@/store/useContractStore";

export function TenantStep() {
  const { contract, updateContract, nextStep, prevStep } = useContractStore();
  
  const tenant = contract.tenant;
  
  const isEmailValid = tenant.email.includes('@') && tenant.email.includes('.');
  const isInePending = !!tenant.id_number_pending;
  const isIneValid = isInePending || tenant.id_number.length === 18;
  const isPhoneValid = tenant.phone.length === 10;
  const isNameValid = tenant.name.trim().length > 3;

  const canProceed = isEmailValid && isIneValid && isPhoneValid && isNameValid;

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Datos del inquilino</h2>
      <p className="text-gray-500 mb-8">Información de la persona que rentará el inmueble.</p>
      
      <div className="space-y-6 mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <label className="block text-[14px] font-bold text-gray-900 mb-2">Nombre completo</label>
          <input 
            type="text"
            className="w-full h-12 px-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
            placeholder="Nombre completo como aparece en su INE"
            value={tenant.name}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^a-zA-Z\sñÑáéíóúÁÉÍÓÚ]/g, '');
              updateContract('tenant', { name: cleaned })
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
            value={tenant.id_number}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
              updateContract('tenant', { id_number: cleaned })
            }}
          />
          {tenant.id_number.length > 0 && tenant.id_number.length < 18 && !isInePending && (
            <span className="text-[11px] text-orange-500 mt-1 block font-medium">Debe tener 18 caracteres.</span>
          )}
          <label className="mt-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-[13px] text-gray-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isInePending}
              onChange={(e) => {
                updateContract('tenant', {
                  id_number_pending: e.target.checked,
                  id_number: e.target.checked ? '' : tenant.id_number,
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
              className="w-full h-12 px-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
              placeholder="correo@ejemplo.com"
              value={tenant.email}
              onChange={(e) => updateContract('tenant', { email: e.target.value })}
            />
            {tenant.email.length > 0 && !isEmailValid && (
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
              value={tenant.phone}
              onChange={(e) => {
                 const cleaned = e.target.value.replace(/\D/g, '');
                 updateContract('tenant', { phone: cleaned })
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-gray-900 mb-2">Domicilio del inquilino</label>
          <input
            type="text"
            className="w-full h-12 px-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[14px]"
            placeholder="Calle, Número, Colonia, Municipio, Estado, CP"
            value={tenant.address}
            onChange={(e) => updateContract('tenant', { address: e.target.value })}
          />
          <span className="text-[11px] text-gray-400 mt-1 block">Domicilio actual del inquilino (puede ser diferente al inmueble rentado).</span>
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
