import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactInfo } from "@/components/contacto/ContactInfo";
import { ContactForm } from "@/components/contacto/ContactForm";

export const metadata = {
  title: "Contacto | Renters",
  description: "¿Tienes dudas sobre tus contratos o necesitas algo especial? Escríbenos, respondemos rápido.",
};

export default function ContactoPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col font-sans">
      
      {/* 
        Split Screen Layout 
        We use flex-col on mobile (stacking info then form), 
        and grid 50/50 on large screens (lg:grid-cols-2).
      */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2">
        
        <div className="w-full flex">
          <ContactInfo />
        </div>
        
        <div className="w-full flex">
          <ContactForm />
        </div>

      </div>

      <Footer />
    </main>
  );
}
