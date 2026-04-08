"use client";
import { NuevoLeonTemplate } from "@/components/generator/templates/NuevoLeonTemplate";
import { useContractStore } from "@/store/useContractStore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SandboxPage() {
  const { contract } = useContractStore();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
           <Link href="/contrato" className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
             <ArrowLeft className="w-4 h-4" /> Volver al generador
           </Link>
           <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
             Modo Admin / Debug
           </span>
        </div>
        
        <div className="bg-white p-12 shadow-2xl rounded-sm">
           <NuevoLeonTemplate data={contract} />
        </div>
      </div>
    </div>
  );
}
