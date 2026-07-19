"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Inicio", path: "/" },
    { name: "Cómo Funciona", path: "/como-funciona" },
    { name: "Preguntas Frecuentes", path: "/preguntas-frecuentes" },
    { name: "Contacto", path: "/contacto" }
  ];

  // Cerrar el menú móvil al navegar a otra ruta.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="w-full h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 md:px-12 z-50 sticky top-0 shadow-sm">
      {/* Brand logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0d52ff] flex items-center justify-center shadow-md">
          <FileText className="text-white w-5 h-5 fill-white" />
        </div>
        <span className="hidden sm:inline-block font-display font-black text-2xl tracking-tight text-black">
          Renters
        </span>
      </Link>

      {/* Center Links (desktop) */}
      <div className="hidden lg:flex items-center gap-2">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`px-4 py-2 font-bold text-[15px] transition-colors rounded-xl ${
                isActive
                  ? 'bg-[#EEF2FC] text-[#0d52ff]'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* CTA + hamburguesa móvil */}
      <div className="flex items-center gap-2">
        <Link
          href="/contrato"
          className="bg-[#0d52ff] text-white px-5 sm:px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#003ee6] transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
        >
          Generar Contrato
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-2 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-8 py-4 font-bold text-[16px] transition-colors ${
                  isActive
                    ? 'bg-[#EEF2FC] text-[#0d52ff]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
