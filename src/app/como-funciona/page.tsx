import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroProcessSection } from "@/components/como-funciona/HeroProcessSection";
import { StepByStepSection } from "@/components/como-funciona/StepByStepSection";
import { ProcessFeaturesSection } from "@/components/como-funciona/ProcessFeaturesSection";
import { FinalCtaProcessSection } from "@/components/como-funciona/FinalCtaProcessSection";

export const metadata = {
  title: "Cómo Funciona | Renters",
  description: "Descubre cómo generar tu contrato legal de arrendamiento en menos de 10 minutos con Renters.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      
      <div className="flex-1">
        <HeroProcessSection />
        <StepByStepSection />
        <ProcessFeaturesSection />
        <FinalCtaProcessSection />
      </div>

      <Footer />
    </main>
  );
}
