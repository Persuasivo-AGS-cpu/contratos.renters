import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ComoFuncionaSection } from "@/components/home/ComoFuncionaSection";
import { StateCards } from "@/components/home/StateCards";
import { PricingSection } from "@/components/home/PricingSection";
import { DudasRapidasSection } from "@/components/home/DudasRapidasSection";
import { CtaSection } from "@/components/home/CtaSection";
import { SoporteSection } from "@/components/home/SoporteSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-clean flex flex-col font-sans">
      <div className="flex-1">
        <HeroSection />
        <ComoFuncionaSection />
        <StateCards />
        <PricingSection />
        <DudasRapidasSection />
        <CtaSection />
        <SoporteSection />
      </div>
      <Footer />
    </main>
  );
}
