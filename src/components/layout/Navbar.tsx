"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const WWW = 'https://www.renters.mx';

// Mismo menú que www.renters.mx (mismos enlaces, mismo orden), todo en la misma pestaña.
// "Contratos" es esta sección; lo que es solo del contrato vive en el submenú de abajo.
const links = [
  { name: "Inicio", href: `${WWW}/` },
  { name: "Servicios", href: `${WWW}/servicios` },
  { name: "Cómo funciona", href: `${WWW}/como-funciona` },
  { name: "Paquetes", href: `${WWW}/paquetes` },
  { name: "Contratos", href: "/" },
  { name: "Preguntas frecuentes", href: `${WWW}/preguntas-frecuentes` },
];

const subLinks = [
  { name: "Cómo funciona", href: "/como-funciona" },
  { name: "Estados", href: "/#cobertura" },
  { name: "Precio", href: "/#precios" },
  { name: "Preguntas del contrato", href: `${WWW}/preguntas-frecuentes?tema=contratos` },
  { name: "Soporte", href: "/contacto" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Renters, contratos">
      <Image src="/logo-renters.png" alt="Renters" width={666} height={440} className="h-12 w-auto" priority />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú móvil al navegar a otra ruta.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Generador: sin menú completo, para que quien llena datos no tenga salidas que distraigan.
  if (pathname === "/contrato") {
    return (
      <nav className="w-full h-16 border-b border-border-layout bg-white/95 backdrop-blur flex items-center justify-between px-4 md:px-12 z-50 sticky top-0">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 min-h-11">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <Logo />
        <a
          href={`${WWW}/preguntas-frecuentes?tema=contratos`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-end min-h-11 w-16 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ¿Dudas?
        </a>
      </nav>
    );
  }

  const showSubNav = !pathname.startsWith("/admin");

  return (
    <>
      <nav className="w-full h-20 border-b border-border-layout bg-white/95 backdrop-blur flex items-center justify-between px-6 md:px-12 z-50 sticky top-0">
        <Logo />

        <ul className="hidden xl:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`px-3 py-2 text-[13.5px] font-medium rounded-full transition-colors ${
                  link.href === "/" ? 'bg-[#EEF2FF] text-[#3563E9]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href={`${WWW}/contacto`}
            className="hidden md:inline-flex border border-slate-200 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Contacto
          </Link>
          <Link
            href={`${WWW}/brokers`}
            className="hidden sm:inline-flex bg-[#3563E9] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#2951CB] transition-colors whitespace-nowrap"
          >
            Soy Broker
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="xl:hidden flex items-center justify-center w-11 h-11 rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="xl:hidden absolute top-20 left-0 w-full bg-white border-b border-border-layout shadow-lg py-2 flex flex-col">
            {[...links, { name: "Contacto", href: `${WWW}/contacto` }, { name: "Soy Broker", href: `${WWW}/brokers` }].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-8 py-4 text-[16px] font-medium transition-colors ${
                  link.href === "/" ? 'bg-[#EEF2FF] text-[#3563E9]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {showSubNav && (
        <div className="w-full h-12 bg-[#F8FAFC] border-b border-border-layout flex items-center justify-between gap-4 px-6 md:px-12 sticky top-20 z-40">
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto [scrollbar-width:none]">
            <span className="hidden md:inline text-[13px] font-semibold text-slate-900 mr-3 whitespace-nowrap">Contratos de arrendamiento</span>
            {subLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${
                  pathname === link.href ? 'bg-[#EEF2FF] text-[#3563E9]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            href="/contrato"
            className="shrink-0 bg-[#3563E9] text-white px-5 py-1.5 rounded-full text-[13px] font-semibold hover:bg-[#2951CB] transition-colors whitespace-nowrap"
          >
            Generar contrato
          </Link>
        </div>
      )}
    </>
  );
}
