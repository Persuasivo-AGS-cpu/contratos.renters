"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "@/components/shared/Phone";
import { AmbientBlobs } from "@/components/shared/BackgroundBlobs";
import { CountUp } from "@/components/shared/CountUp";

export function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const states = [
    { id: "nuevo-leon", label: "Nuevo León", available: true },
    { id: "jalisco", label: "Jalisco", available: true },
    { id: "queretaro", label: "Querétaro", available: true },
    { id: "merida", label: "Mérida", available: true },
    { id: "san-luis-potosi", label: "San Luis Potosí", available: true },
    { id: "cdmx", label: "CDMX", available: false },
    { id: "edomex", label: "Estado de México", available: false },
  ];

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
    <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-20 px-6 overflow-hidden bg-[#0a0f1c]">
      <AmbientBlobs reducedMotion={!!reducedMotion} />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-16">
        {/* Columna izquierda: copy + selector */}
        <div className="flex flex-col items-start text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#3B5998] bg-[#1A2352]/60 backdrop-blur-sm text-xs font-bold text-[#4D6BFE] uppercase tracking-wide mb-6">
            <ShieldCheck className="w-4 h-4" /> Protección Legal Certificada
          </div>

          {/* Headlines */}
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Contratos de arrendamiento <br className="hidden md:block" />
            <span className="text-[#4D6BFE]">legalmente válidos</span> <br className="hidden md:block" />
            en minutos
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
            Genera tu contrato de renta personalizado, redactado por abogados y adaptado a la legislación de tu estado. Sin complicaciones.
          </p>

          {/* CTA Form mimicking mockup */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl relative z-20">
            {/* Custom Dropdown */}
            <div className="flex-1 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full min-h-[56px] flex items-center justify-between bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white px-6 outline-none transition-all hover:bg-white/10"
              >
                <span>{selectedState ? states.find(s => s.id === selectedState)?.label : "Selecciona tu estado"}</span>
                <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1e2023] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-2 pt-1 mb-1 border-b border-white/5 flex items-center gap-2 text-white/50">
                     <Check className="w-3.5 h-3.5"/> <span className="text-[11px] font-semibold uppercase tracking-wider">Selecciona tu estado</span>
                  </div>
                  <div className="px-2">
                    {states.map((s) => (
                      <button
                        key={s.id}
                        disabled={!s.available}
                        onClick={() => {
                          if (!s.available) return;
                          setSelectedState(s.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                          !s.available
                            ? "opacity-40 cursor-not-allowed text-gray-500"
                            : selectedState === s.id
                            ? "bg-[#4D6BFE] text-white font-medium"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{s.label}</span>
                        {!s.available && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded-full">
                            Próximamente
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={ctaHref}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#4D6BFE] text-white text-lg font-bold rounded-lg hover:bg-[#3b55d9] transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
            >
              Generar Contrato <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-3xl flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
             <div>
                <p className="text-3xl md:text-4xl font-black text-white">
                  $<CountUp target={499} />
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-[0.15em] mt-1">Precio Único · IVA Incluido</p>
             </div>
             <div>
                <p className="text-3xl md:text-4xl font-black text-white">
                  <CountUp target={5} />
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-[0.15em] mt-1">Estados Disponibles</p>
             </div>
             <div>
                <p className="text-3xl md:text-4xl font-black text-white">
                  &lt; <CountUp target={10} /> <span className="text-xl md:text-2xl font-normal">min</span>
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-[0.15em] mt-1">Tiempo Promedio</p>
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
