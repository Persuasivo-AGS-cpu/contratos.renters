"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Inicio", path: "/" },
    { name: "Cómo Funciona", path: "/como-funciona" },
    { name: "Preguntas Frecuentes", path: "/preguntas-frecuentes" },
    { name: "Contacto", path: "/contacto" }
  ];

  return (
    <nav className="w-full h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 md:px-12 z-50 sticky top-0 shadow-sm">
      {/* Brand logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0d52ff] flex items-center justify-center shadow-md">
          <FileText className="text-white w-5 h-5 fill-white" />
        </div>
        <span className="font-display font-black text-2xl tracking-tight text-black">
          Renters
        </span>
      </Link>

      {/* Center Links */}
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

      {/* CTA Button */}
      <div>
        <Link 
          href="/contrato" 
          className="bg-[#0d52ff] text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#003ee6] transition-all shadow-lg shadow-blue-500/20"
        >
          Generar Contrato
        </Link>
      </div>
    </nav>
  );
}
