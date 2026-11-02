import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface-clean border-t border-border-layout py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center" aria-label="Renters, contratos">
            <Image src="/logo-renters.png" alt="Renters" width={666} height={440} className="h-14 w-auto" />
          </Link>
          <p className="text-sm text-text-muted text-center md:text-left max-w-xs mt-2">
             Contratos de arrendamiento personalizados por estado: los llenas en línea y descargas el PDF.
          </p>
          <a
            href="https://www.renters.mx"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-brand-primary hover:underline"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Parte de Renters.mx
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-8 text-center md:text-left text-sm font-medium text-text-muted">
           <div className="flex flex-col gap-3">
              <span className="text-text-main font-bold uppercase tracking-wider text-xs">Producto</span>
              <a href="https://www.renters.mx/paquetes" className="hover:text-brand-primary transition-colors">Póliza jurídica</a>
              <Link href="/#como" className="hover:text-brand-primary transition-colors">Cómo Funciona</Link>
              <Link href="/#precio" className="hover:text-brand-primary transition-colors">Precios</Link>
              <a href="https://www.renters.mx/preguntas-frecuentes?tema=contratos" className="hover:text-brand-primary transition-colors">Preguntas Frecuentes</a>
           </div>
           
           <div className="flex flex-col gap-3">
              <span className="text-text-main font-bold uppercase tracking-wider text-xs">Legal</span>
              <Link href="/terminos" className="hover:text-brand-primary transition-colors">Términos y Condiciones</Link>
              <Link href="/privacidad" className="hover:text-brand-primary transition-colors">Aviso de Privacidad</Link>
           </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border-layout flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
         <p>© {new Date().getFullYear()} Renters.mx. Todos los derechos reservados. | Desarrollado por <a href="https://www.persuasivo.mx" target="_blank" rel="noreferrer" className="hover:underline text-inherit">Persuasivo MKT</a></p>
         <div className="flex items-center gap-2 text-brand-primary bg-brand-primary/5 px-3 py-1.5 rounded-full border border-brand-primary/10">
            <ShieldCheck className="w-4 h-4" /> Plataforma Legal Segura
         </div>
      </div>
    </footer>
  );
}
