"use client";

import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useContractStore } from "@/store/useContractStore";

const features = [
  "Contrato legal completo",
  "Adaptado a legislación de tu estado",
  "Descarga en PDF",
  "Envío por correo electrónico",
  "Guía de uso incluida",
];

export function PricingSection() {
  const updateContract = useContractStore((state) => state.updateContract);

  return (
    <section id="precios" className="w-full py-24 px-6 bg-surface-clean relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block px-3 py-1 font-bold text-xs uppercase tracking-[0.2em] mb-4 text-[#4D6BFE]">PRECIOS</div>
        <h2 className="text-3xl md:text-5xl font-display font-black text-text-main mb-4 tracking-tight">
          Inversión que protege tu patrimonio
        </h2>
        <p className="text-xl text-text-muted">Precio único. Sin suscripciones. Sin cargos ocultos.</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative bg-white rounded-2xl p-10 border-2 border-[#1a56ff] shadow-2xl shadow-blue-900/10 flex flex-col items-center text-center">

          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1a56ff] text-white px-5 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Legalmente válido
          </div>

          {/* Plan name */}
          <h3 className="text-2xl font-black font-display text-text-main mt-4 mb-1">Contrato Básico</h3>
          <p className="text-gray-500 text-sm mb-8">Contrato de arrendamiento estándar adaptado a tu estado.</p>

          {/* Price */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 mb-1">
              Un despacho tradicional: <span className="line-through">$2,500 – $5,000</span>
            </p>
            <div className="flex items-start justify-center gap-1">
              <span className="text-2xl font-bold text-gray-400 mt-3">$</span>
              <span className="text-7xl font-black font-display tracking-tight text-[#111]">499</span>
              <span className="text-lg font-semibold text-gray-400 mt-5">MXN</span>
            </div>
            <p className="text-sm text-gray-400 font-medium mt-1">por contrato · IVA incluido</p>
          </div>

          {/* Features */}
          <ul className="w-full space-y-4 mb-10 text-left">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0d944c]" strokeWidth={3} />
                </span>
                <span className="text-gray-700 font-medium">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/contrato"
            onClick={() => updateContract("selectedPlan", "basico")}
            className="w-full flex items-center justify-center gap-2 h-14 bg-[#1a56ff] hover:bg-[#003ee6] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25"
          >
            Generar mi contrato <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="mt-4 flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#0d944c] shrink-0" />
            Corrección de datos gratis las primeras 24 horas
          </p>
        </div>
      </div>
    </section>
  );
}
