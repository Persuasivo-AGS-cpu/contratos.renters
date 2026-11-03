"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ContratosMenu } from './ContratosMenu';
import { CONTRATOS_MENU } from '@/lib/contratosNav';

const WWW = 'https://www.renters.mx';

// Mismo menú que www.renters.mx (mismos enlaces, mismo orden), todo en la misma pestaña.
// "Contratos" es esta sección: abre la burbuja con las secciones de la página.
const links = [
  { name: "Inicio", href: `${WWW}/` },
  { name: "Servicios", href: `${WWW}/servicios` },
  { name: "Cómo funciona", href: `${WWW}/como-funciona` },
  { name: "Paquetes", href: `${WWW}/paquetes` },
  { name: "Contratos", href: "/" },
  { name: "Preguntas frecuentes", href: `${WWW}/preguntas-frecuentes` },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Renters, contratos">
      <Image src="/logo-renters.png" alt="Renters" width={666} height={440} className="h-12 w-auto" priority />
    </Link>
  );
}

// Mismo logo y tamaño (90 px) que la barra de www.renters.mx.
function LogoWww() {
  return (
    <Link href="/" className="flex items-center" aria-label="Renters, contratos">
      <Image src="/logo-renters-www.png" alt="Renters" width={90} height={90} className="h-[90px] w-[90px]" priority />
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

  return (
    // Medidas copiadas de www.renters.mx (Header.css): barra de 114 px = 12 + logo de 90 + 12,
    // contenedor de 1320 px con 24 px laterales, enlaces de 13.6 px, botones de 51 px.
    <nav className="w-full bg-white/95 backdrop-blur shadow-[0_4px_20px_rgba(0,0,0,0.05)] z-50 sticky top-0 py-3">
      <div className="mx-auto flex h-[90px] w-full max-w-[1320px] items-center justify-between px-6">
      <LogoWww />

      <ul className="hidden xl:flex items-center gap-6">
        {links.map((link) => (
          <li key={link.name}>
            {link.name === "Contratos" ? (
              <ContratosMenu />
            ) : (
              <Link href={link.href} className="px-3 py-2 text-[13.6px] font-medium rounded-[20px] text-slate-600 hover:text-slate-900 transition-colors">
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <Link
          href={`${WWW}/contacto`}
          className="hidden md:inline-flex h-[51px] items-center border border-slate-200 text-slate-900 px-8 rounded-[30px] text-[16.8px] font-semibold hover:bg-slate-50 transition-colors"
        >
          Contacto
        </Link>
        <Link
          href={`${WWW}/brokers`}
          className="hidden sm:inline-flex h-[51px] items-center border-2 border-transparent bg-[#3563E9] text-white px-8 rounded-[30px] text-[16.8px] font-semibold hover:bg-[#2951CB] transition-colors whitespace-nowrap"
        >
          Soy Broker
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="xl:hidden flex items-center justify-center w-12 h-12 rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full max-h-[calc(100vh-114px)] overflow-y-auto bg-white border-b border-border-layout shadow-lg py-2 flex flex-col">
          {links.map((link) =>
            link.name === "Contratos" ? (
              <details key={link.name} open className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-8 py-4 text-[16px] font-medium bg-[#EEF2FF] text-[#3563E9]">
                  Contratos <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                {CONTRATOS_MENU.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-12 py-3 text-[15px] text-slate-600 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </details>
            ) : (
              <Link key={link.name} href={link.href} className="px-8 py-4 text-[16px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {link.name}
              </Link>
            ),
          )}
          <Link href={`${WWW}/contacto`} className="px-8 py-4 text-[16px] font-medium text-slate-700 hover:bg-slate-50">Contacto</Link>
          <Link href={`${WWW}/brokers`} className="px-8 py-4 text-[16px] font-medium text-slate-700 hover:bg-slate-50">Soy Broker</Link>
        </div>
      )}
    </nav>
  );
}
