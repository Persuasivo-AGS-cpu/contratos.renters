"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileSignature, CheckCircle, MapPin, ShieldCheck, MessageCircle, Mail } from "lucide-react";
import { CONTRATOS_MENU, type ContratosMenuId } from "@/lib/contratosNav";

const ICONOS: Record<ContratosMenuId, typeof MapPin> = {
  resumen: FileSignature,
  como: CheckCircle,
  estados: MapPin,
  precio: ShieldCheck,
  dudas: MessageCircle,
  soporte: Mail,
};

// En escritorio con cursor la burbuja abre al pasar el mouse; en táctil, con toque.
const hayHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export function ContratosMenu() {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => hayHover() && setAbierto(true)}
      onMouseLeave={() => hayHover() && setAbierto(false)}
    >
      <button
        type="button"
        aria-expanded={abierto}
        aria-haspopup="true"
        aria-controls="menu-contratos"
        // Con hover, el clic no debe cerrar lo que el mouse acaba de abrir.
        onClick={() => setAbierto((a) => (hayHover() ? true : !a))}
        className="inline-flex h-[33px] items-center gap-1.5 rounded-[20px] bg-[#EEF2FF] px-3 text-[13.6px] font-medium text-[#3563E9] transition-colors"
      >
        Contratos
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div id="menu-contratos" className="absolute left-1/2 top-full z-50 w-[360px] -translate-x-1/2 pt-3">
          <div className="relative rounded-2xl border border-border-layout bg-white p-2 shadow-2xl shadow-slate-900/10 before:absolute before:-top-1.5 before:left-1/2 before:-ml-1.5 before:size-3 before:rotate-45 before:border-l before:border-t before:border-border-layout before:bg-white">
            {CONTRATOS_MENU.map((item, i) => {
              const Icono = ICONOS[item.id];
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className={`flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none ${
                    i === 0 ? "mb-1.5 border-b border-border-layout rounded-b-none pb-3" : ""
                  }`}
                >
                  <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-[#EEF2FF] text-[#3563E9]">
                    <Icono className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-main">{item.label}</span>
                    <span className="mt-0.5 block text-[12.5px] text-text-muted">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
