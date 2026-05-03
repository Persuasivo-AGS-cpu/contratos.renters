"use client";

import { useEffect, useState } from "react";
import { NuevoLeonTemplate } from "@/components/generator/templates/NuevoLeonTemplate";

export default function ImprimirPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lanzar diálogo de impresión automáticamente
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <main id="print-area" className="bg-white min-h-screen p-8 max-w-4xl mx-auto print:p-0 print:m-0">
      <NuevoLeonTemplate />
    </main>
  );
}
