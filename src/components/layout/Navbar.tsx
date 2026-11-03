"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { SiteHeader } from './SiteHeader';

const WWW = 'https://www.renters.mx';

function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Renters, contratos">
      <Image src="/logo-renters.png" alt="Renters" width={666} height={440} className="h-12 w-auto" priority />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();

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

  // Resto del sitio: el mismo encabezado que www.renters.mx.
  return <SiteHeader />;
}
