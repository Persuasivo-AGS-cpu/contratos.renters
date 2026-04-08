"use client";

import { useContractStore } from "@/store/useContractStore";
import { Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NuevoLeonTemplate } from "./templates/NuevoLeonTemplate";

export function ContractPreview() {
  const { contract } = useContractStore();
  
  const isPaid = contract.status === 'paid' || contract.status === 'completed';

  const getStateName = (stateId: string) => {
    switch(stateId) {
      case 'nuevo-leon': return 'NUEVO LEÓN';
      case 'jalisco': return 'JALISCO';
      case 'cdmx': return 'CIUDAD DE MÉXICO';
      case 'edomex': return 'ESTADO DE MÉXICO';
      default: return '[ESTADO SELECCIONADO]';
    }
  }

  return (
    <div className="w-full flex-col flex text-[10px] sm:text-[11px] tracking-normal mb-8">
      <div className="mb-4">
        <h3 className="text-xs font-mono font-semibold tracking-widest text-text-muted uppercase">Vista Previa en Tiempo Real</h3>
      </div>
      <div className="w-full min-h-[600px] aspect-[1/1.4] bg-white border border-border-layout shadow-sm rounded-lg relative overflow-hidden flex flex-col pointer-events-none">
        
        {/* Header Documento */}
        <div className="p-4 md:p-6 pb-2">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700">
               <ShieldCheck className="w-3.5 h-3.5" />
               <span className="font-semibold text-[10px]">Renters.mx • Verificado</span>
            </div>
            <div className="text-right flex flex-col items-end leading-tight">
               <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-widest">Folio Digital</span>
               <span className="font-mono text-[10px] text-gray-600 font-bold">
                 {isPaid ? 'VAL-2026-99381' : `${contract.state ? contract.state.substring(0,2).toUpperCase() : 'XX'}-2026-18536`}
               </span>
            </div>
          </div>
          
          <div className="text-center space-y-1 mb-6 border-b border-gray-100 pb-6">
            <p className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-widest">Instrumento Legal</p>
            <h3 className="font-display font-bold uppercase text-gray-900 text-base leading-tight pt-2">Contrato de Arrendamiento<br/>Residencial</h3>
            <p className="text-gray-400 uppercase font-mono text-[9px] font-bold tracking-wider pt-2">
              CÓDIGO CIVIL PARA EL ESTADO DE {getStateName(contract.state)}
            </p>
          </div>
        </div>

        {/* Contenido Dinámico Legal */}
        <div className="px-4 md:px-8 pt-0 flex-1 relative overflow-y-auto scrollbar-hide pb-20 select-none">
          <NuevoLeonTemplate />

          {isPaid && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold animate-in slide-in-from-bottom-2">
              <ShieldCheck className="w-5 h-5" />
              CONTRATO DESBLOQUEADO
            </div>
          )}
        </div>

        {/* Zona Borrosa Condicional (Fija sobre el scroll) */}
        {!isPaid && (
          <div className="absolute inset-x-0 bottom-0 h-[55%] flex flex-col items-center justify-center z-20 pointer-events-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-[2px]" />
            <div className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center w-72 mt-20">
              <Lock className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="font-bold text-[15px] text-gray-900 mb-1">Cláusulas bloqueadas</h4>
              <p className="text-gray-500 text-[12px] leading-tight">
                Completa el pago para desbloquear el contrato completo y descargarlo en PDF.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
