import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { ReenviarEnlaceForm } from "./ReenviarEnlaceForm";

export const metadata: Metadata = {
  title: "Reenviar mi enlace | Renters",
  description: "Recibe de nuevo el enlace para descargar tu contrato.",
  robots: { index: false, follow: false },
};

export default function ReenviarEnlacePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col font-sans">
      <div className="flex-1 w-full max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-slate-900 mb-3">Reenviar mi enlace</h1>
        <p className="text-slate-500 mb-8">
          Los enlaces de descarga duran 90 días. Escribe el folio de tu contrato y el correo con el que lo
          compraste (o el del inquilino) y te enviamos un enlace nuevo. El anterior deja de funcionar.
        </p>
        <ReenviarEnlaceForm />
      </div>
      <Footer />
    </main>
  );
}
