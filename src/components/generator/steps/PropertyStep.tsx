"use client";
import { useContractStore } from "@/store/useContractStore";
import { Home, Building2, Store, Briefcase, Package, Box, Minus, Plus } from "lucide-react";

export function PropertyStep() {
  const { contract, updateContract, nextStep, prevStep } = useContractStore();
  const addr = contract.property.address;
  
  const INVENTORY_ITEMS = [
    { id: 'sofas', label: 'Sofá', icon: '🛋️' },
    { id: 'cama_individual', label: 'Cama individual', icon: '🛏️' },
    { id: 'cama_matrimonial', label: 'Cama matrimonial', icon: '🛏️' },
    { id: 'comedor', label: 'Comedor', icon: '🪑' },
    { id: 'refrigerador', label: 'Refrigerador', icon: '🧊' },
    { id: 'microondas', label: 'Microondas', icon: '📦' },
    { id: 'estufa', label: 'Estufa / Parrilla', icon: '🔥' },
    { id: 'lavadora', label: 'Lavadora', icon: '🫧' },
    { id: 'abanicos', label: 'Abanico / Ventilador', icon: '🌀' },
    { id: 'climas', label: 'Aire acondicionado', icon: '❄️' },
    { id: 'boiler', label: 'Calentador de agua', icon: '🚿' },
    { id: 'tv', label: 'Televisor', icon: '📺' },
  ];

  const totalItems = Object.values(contract.property.inventory).reduce((acc, curr) => acc + curr, 0);

  const updateAddress = (field: string, value: string) => {
    updateContract('property', { 
      address: { ...contract.property.address, [field]: value } 
    });
  };

  const isAddressComplete = addr.street && addr.ext_num && addr.neighborhood && addr.municipality && addr.zip_code;
  const isTypeComplete = contract.property.type !== '';
  const canProceed = isAddressComplete && isTypeComplete;

  return (
    <div className="max-w-xl pb-10">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Datos de la propiedad</h2>
      <p className="text-gray-500 mb-8">Información sobre el inmueble que se va a arrendar.</p>
      
      {/* TIPO DE PROPIEDAD */}
      <div className="mb-8">
        <label className="block text-[14px] font-bold text-gray-900 mb-3">Tipo de propiedad</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'casa', label: 'Casa', icon: Home },
            { id: 'departamento', label: 'Departamento', icon: Building2 },
            { id: 'local', label: 'Local Comercial', icon: Store },
            { id: 'oficina', label: 'Oficina', icon: Briefcase }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => updateContract('property', { type: type.id })}
              className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-all ${
                contract.property.type === type.id 
                  ? 'border-blue-500 bg-blue-50/50 text-blue-700 ring-1 ring-blue-500' 
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              <type.icon className="w-5 h-5" />
              <span className="font-bold text-[14px]">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DIRECCIÓN ESTRUCTURADA */}
      <div className="mb-8 p-6 bg-gray-50/50 border border-gray-200 rounded-2xl">
        <label className="block text-[14px] font-bold text-gray-900 mb-4">Dirección completa del inmueble</label>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 flex flex-col gap-1">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Calle</label>
              <input 
                type="text"
                className="w-full h-11 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                value={addr.street || ''}
                onChange={(e) => updateAddress('street', e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Ext.</label>
              <input 
                type="text"
                className="w-full h-11 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                value={addr.ext_num || ''}
                onChange={(e) => updateAddress('ext_num', e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Int.</label>
              <input 
                type="text"
                className="w-full h-11 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                value={addr.int_num || ''}
                onChange={(e) => updateAddress('int_num', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
               <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Colonia</label>
               <input 
                 type="text"
                 className="w-full h-11 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                 value={addr.neighborhood || ''}
                 onChange={(e) => updateAddress('neighborhood', e.target.value)}
               />
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Municipio / Alcaldía</label>
               <input 
                 type="text"
                 className="w-full h-11 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                 value={addr.municipality || ''}
                 onChange={(e) => updateAddress('municipality', e.target.value)}
               />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
               <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Código Postal</label>
               <input 
                 type="text"
                 maxLength={5}
                 pattern="[0-9]*"
                 className="w-full h-11 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                 value={addr.zip_code || ''}
                 onChange={(e) => updateAddress('zip_code', e.target.value.replace(/\D/g, ''))}
               />
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Estado</label>
               <input 
                 type="text"
                 disabled
                 className="w-full h-11 px-3 border border-gray-200 bg-gray-100 text-gray-500 font-medium rounded-lg cursor-not-allowed text-[14px]"
                 value={contract.state.toUpperCase()}
               />
               <span className="text-[10px] text-gray-400">Autocompletado desde el Paso 1</span>
             </div>
          </div>

        </div>
      </div>

      {/* AMUEBLADO */}
      <div className="mb-4">
        <label className="block text-[14px] font-bold text-gray-900 mb-1">¿El inmueble se entrega amueblado?</label>
        <p className="text-[13px] text-gray-500 mb-3">Si viene con muebles, se agregará un Anexo de Inventario al contrato.</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateContract('property', { furnished: false, inventory: {} })}
            className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-all ${
              !contract.property.furnished 
                ? 'border-blue-500 bg-blue-50/50 text-blue-700 ring-1 ring-blue-500' 
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            <Box className="w-5 h-5" />
            <div>
               <p className="font-bold text-[14px]">Sin muebles</p>
               <p className="text-[12px] text-gray-500">Inmueble vacío</p>
            </div>
          </button>
          <button
            onClick={() => updateContract('property', { furnished: true })}
            className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-all ${
              contract.property.furnished 
                ? 'border-blue-500 bg-blue-50/50 text-blue-700 ring-1 ring-blue-500' 
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            <Package className="w-5 h-5" />
            <div>
               <p className="font-bold text-[14px]">Amueblado</p>
               <p className="text-[12px] text-gray-500">Incluye mobiliario</p>
            </div>
          </button>
        </div>
      </div>

      {/* INVENTARIO PREMIUM */}
      {contract.property.furnished && (
        <div className="mb-8 p-6 bg-[#f8fbff] border border-blue-200 rounded-2xl animate-in slide-in-from-top-2 fade-in duration-200">
          
          <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold text-gray-900 text-[15px]">Inventario de muebles y electrodomésticos</h4>
             <div className="bg-[#4F46E5] text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
                {totalItems} artículos
             </div>
          </div>
          
          <p className="text-[13px] text-gray-600 mb-6">Indica cuántas unidades de cada artículo se incluyen. Esto se agregará al Anexo de Inventario del contrato.</p>

          <div className="space-y-3 bg-white rounded-xl border border-blue-100 overflow-hidden divide-y divide-blue-50">
            {INVENTORY_ITEMS.map((item) => {
              const qty = contract.property.inventory[item.id] || 0;
              return (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                     <span className="text-xl bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">{item.icon}</span>
                     <span className="text-[14px] font-semibold text-gray-800">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-30 transition-all font-bold"
                      disabled={qty === 0}
                      onClick={() => 
                        updateContract('property', { 
                          inventory: { ...contract.property.inventory, [item.id]: Math.max(0, qty - 1) } 
                        })
                      }
                    ><Minus className="w-4 h-4"/></button>
                    <span className="w-4 text-center font-black text-[15px] select-none text-gray-900">{qty}</span>
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all font-bold"
                      onClick={() => 
                        updateContract('property', { 
                          inventory: { ...contract.property.inventory, [item.id]: qty + 1 } 
                        })
                      }
                    ><Plus className="w-4 h-4"/></button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* BOTONES */}
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
