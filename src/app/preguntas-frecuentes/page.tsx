import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FaqEngine } from "@/components/faq/FaqEngine";
import { DidYouKnowSection } from "@/components/faq/DidYouKnowSection";
import { FaqFinalCta } from "@/components/faq/FaqFinalCta";

export const metadata = {
  title: "Preguntas Frecuentes | Renters",
  description: "Encuentra respuestas a dudas sobre validez, pagos y usos de tu contrato de arrendamiento.",
};

export default function PreguntasFrecuentesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      
      <div className="flex-1">
        {/* Core Interactive FAQ Section */}
        <FaqEngine />
        
        {/* Informational Blocks */}
        <DidYouKnowSection />
        
        {/* CTA */}
        <FaqFinalCta />
      </div>

      <Footer />
    </main>
  );
}
