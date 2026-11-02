"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "@/components/shared/Phone";
import { AmbientBlobs } from "@/components/shared/BackgroundBlobs";
import { CountUp } from "@/components/shared/CountUp";
import { STATES } from "@/lib/states";

// Solo estados activos en el dropdown — CDMX/Edomex aún no tienen plantilla,
// no tiene sentido mostrarlos como opción "Próximamente" aquí.
const HERO_STATES = Object.entries(STATES)
  .filter(([, s]) => s.available)
  .map(([id, s]) => ({ id, label: s.name }));

export function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const states = HERO_STATES;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ctaHref = selectedState ? `/contrato?estado=${selectedState}` : "/contrato";

  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-20 px-6 bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)]">
      <AmbientBlobs reducedMotion={!!reducedMotion} />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-16">
        {/* Columna izquierda: copy + selector */}
        <div className="flex flex-col items-start text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3563E9]/20 bg-[#EEF2FF] text-xs font-bold text-[#3563E9] uppercase tracking-wide mb-6">
            <ShieldCheck className="w-4 h-4" /> Protección Legal Certificada
          </div>

          {/* Headlines */}
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Contratos de arrendamiento <br className="hidden md:block" />
            <span className="text-[#3563E9]">legalmente válidos</span> <br className="hidden md:block" />
            en minutos
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Genera tu contrato de renta personalizado, redactado por abogados y adaptado a la legislación de tu estado. Sin complicaciones.
          </p>

          {/* CTA Form mimicking mockup */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl relative z-20">
            {/* Custom Dropdown */}
            <div className="flex-1 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full min-h-[56px] flex items-center justify-between bg-white rounded-full border border-slate-200 text-slate-900 px-6 outline-none transition-all hover:border-slate-300 shadow-sm"
              >
                <span>{selectedState ? states.find(s => s.id === selectedState)?.label : "Selecciona tu estado"}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-[min(360px,60vh)] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-2 pt-1 mb-1 border-b border-slate-100 flex items-center gap-2 text-slate-400">
                     <Check className="w-3.5 h-3.5"/> <span className="text-[11px] font-semibold uppercase tracking-wider">Selecciona tu estado</span>
                  </div>
                  <div className="px-2">
                    {states.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedState(s.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                          selectedState === s.id
                            ? "bg-[#3563E9] text-white font-medium"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={ctaHref}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#3563E9] text-white text-lg font-semibold rounded-full hover:bg-[#2951CB] transition-all whitespace-nowrap"
            >
              Generar Contrato <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-8 border-t border-slate-200 w-full max-w-3xl flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
             <div>
                <p className="text-3xl md:text-4xl font-black text-slate-900">
                  $<CountUp target={499} />
                </p>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-[0.15em] mt-1">Precio Único · IVA Incluido</p>
             </div>
             <div>
                <p className="text-3xl md:text-4xl font-black text-slate-900">
                  <CountUp target={HERO_STATES.length} />
                </p>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-[0.15em] mt-1">Estados Disponibles</p>
             </div>
             <div>
                <p className="text-3xl md:text-4xl font-black text-slate-900">
                  &lt; <CountUp target={6} /> <span className="text-xl md:text-2xl font-normal">min</span>
                </p>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-[0.15em] mt-1">Tiempo Promedio</p>
             </div>
          </div>
        </div>

        {/* Columna derecha: mockup real del producto */}
        <div className="hidden lg:flex justify-center" style={{ perspective: 1200 }}>
          <motion.div
            className="w-full max-w-[300px]"
            style={{ rotateY: -8, rotateX: 3 }}
            animate={reducedMotion ? undefined : { y: [0, -14, 0] }}
            transition={reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Phone>
              <Image
                src="/images/como-funciona/paso-1.png"
                alt="Selector de estado en el generador de contrato"
                width={390}
                height={844}
                className="h-full w-full object-cover object-top"
                sizes="300px"
                priority
              />
            </Phone>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
