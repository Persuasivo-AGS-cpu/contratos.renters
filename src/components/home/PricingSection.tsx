"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useContractStore } from "@/store/useContractStore";

export function PricingSection() {
  const plans = [
    {
      name: "Contrato Básico",
      desc: "Contrato de arrendamiento estándar adaptado a tu estado.",
      price: "499",
      period: "por contrato",
      features: [
        "Contrato legal completo",
        "Adaptado a legislación estatal",
        "Descarga en PDF",
        "Envío por correo electrónico",
        "Guía de uso incluida"
      ],
      cta: "Empezar con este plan",
      popular: false
    },
    {
      name: "Contrato + Protección",
      desc: "Contrato completo más póliza de protección al arrendador.",
      price: "899",
      period: "por contrato",
      features: [
        "Todo lo del plan Básico",
        "Póliza de protección legal",
        "Anexo de inventario",
        "Cláusulas reforzadas",
        "Soporte legal por correo",
        "Renovación con descuento"
      ],
      cta: "Empezar con este plan",
      popular: true
    },
    {
      name: "Pack Inmobiliario",
      desc: "Ideal para inversionistas con múltiples propiedades.",
      price: "1,999",
      period: "hasta 5 contratos",
      features: [
        "Todo lo del plan Protección",
        "Hasta 5 contratos",
        "Dashboard de contratos",
        "Recordatorios de vencimiento",
        "Soporte prioritario"
      ],
      cta: "Empezar con este plan",
      popular: false
    }
  ];

  const updateContract = useContractStore((state) => state.updateContract);

  return (
    <section id="precios" className="w-full py-24 px-6 bg-surface-clean relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block px-3 py-1 font-bold text-xs uppercase tracking-[0.2em] mb-4 text-[#4D6BFE]">PRECIOS</div>
        <h2 className="text-3xl md:text-5xl font-display font-black text-text-main mb-4 tracking-tight">Inversión que protege tu patrimonio</h2>
        <p className="text-xl text-text-muted">Precios transparentes. Sin cargos ocultos. Tu contrato listo en minutos.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative bg-white rounded-2xl p-8 flex flex-col h-full 
              ${plan.popular 
                ? 'border-2 border-[#1a56ff] shadow-xl shadow-blue-900/5 lg:-mt-4 lg:mb-[-1rem] lg:pb-12' 
                : 'border border-border-layout shadow-sm'
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1a56ff] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                Más Popular
              </div>
            )}

            <h3 className="text-xl font-bold font-display text-text-main mb-2">{plan.name}</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">{plan.desc}</p>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-5xl font-black font-display tracking-tight">${plan.price}</span>
              <span className="text-sm font-semibold text-gray-500">{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
               {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                     <Check className="w-4 h-4 text-[#00c985] shrink-0 mt-0.5" />
                     <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </li>
               ))}
            </ul>

            <Link 
              href="/contrato"
              onClick={() => {
                const planId = plan.name.includes("Básico") ? "basico" : plan.name.includes("Protección") ? "proteccion" : "pack";
                updateContract("selectedPlan", planId);
              }}
              className={`w-full flex items-center justify-center gap-2 h-12 font-bold rounded-lg transition-all ${
                plan.popular 
                  ? 'bg-[#1a56ff] hover:bg-[#003ee6] text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white hover:bg-gray-50 text-text-main border border-gray-200 shadow-sm'
              }`}
            >
              {plan.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
