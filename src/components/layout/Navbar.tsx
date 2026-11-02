"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const WWW = 'https://www.renters.mx';

// Mismo menú que www.renters.mx: lo de allá abre en la misma pestaña para que se sienta un solo sitio.
// "Contratos" es esta sección; "Cómo funciona" y "Preguntas frecuentes" son las de contratos.
const links = [
  { name: "Inicio", href: `${WWW}/`, external: true },
  { name: "Servicios", href: `${WWW}/servicios`, external: true },
  { name: "Paquetes", href: `${WWW}/paquetes`, external: true },
  { name: "Contratos", href: "/", external: false },
  { name: "Cómo funciona", href: "/como-funciona", external: false },
  { name: "Preguntas frecuentes", href: "/preguntas-frecuentes", external: false },
];

const SECCIONES_PROPIAS = ["/como-funciona", "/preguntas-frecuentes"];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú móvil al navegar a otra ruta.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string, external: boolean) => {
    if (external) return false;
    if (href === "/") return !SECCIONES_PROPIAS.includes(pathname) && pathname !== "/contacto";
    return pathname === href;
  };

  return (
    <nav className="w-full h-20 border-b border-border-layout bg-white/95 backdrop-blur flex items-center justify-between px-6 md:px-12 z-50 sticky top-0">
      <Link href="/" className="flex items-center" aria-label="Renters, contratos">
        <Image src="/logo-renters.png" alt="Renters" width={666} height={440} className="h-12 w-auto" priority />
      </Link>

      <ul className="hidden xl:flex items-center gap-1">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`px-3 py-2 text-[13.5px] font-medium rounded-full transition-colors ${
                isActive(link.href, link.external)
                  ? 'bg-[#EEF2FF] text-[#3563E9]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <Link
          href="/contacto"
          className="hidden md:inline-flex border border-slate-200 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Contacto
        </Link>
        <Link
          href="/contrato"
          className="bg-[#3563E9] text-white px-5 sm:px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#2951CB] transition-colors whitespace-nowrap"
        >
          Generar contrato
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
          {[...links, { name: "Contacto", href: "/contacto", external: false }].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-8 py-4 text-[16px] font-medium transition-colors ${
                isActive(link.href, link.external)
                  ? 'bg-[#EEF2FF] text-[#3563E9]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
