import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { StateCards } from "@/components/home/StateCards";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AboutRenters } from "@/components/home/AboutRenters";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-clean flex flex-col font-sans">
      
      <div className="flex-1">
        <HeroSection />
        <TrustBar />
        <StateCards />
        <PricingSection />
        <TestimonialsSection />
        <AboutRenters />
        <CtaSection />
      </div>

      <Footer />
    </main>
  );
}
