import { Scale, CheckCircle, FileSignature, CalendarCheck } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

export function TrustBar() {
  const items = [
    { icon: Scale, text: "Redactado por abogados" },
    { icon: CheckCircle, text: "Conforme al código civil" },
    { icon: FileSignature, text: "Válido ante autoridades" },
    { icon: CalendarCheck, text: "Actualizado 2026-2027" }
  ];

  return (
    <section className="w-full bg-white border-y border-border-layout py-8">
      <div className="max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {items.map((item, index) => (
               <Reveal key={index} delay={index * 0.06} className="flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left text-brand-primary">
                  <item.icon className="w-6 h-6 shrink-0 opacity-80" />
                  <span className="font-medium text-sm text-text-main max-w-[120px] md:max-w-none leading-tight">{item.text}</span>
               </Reveal>
            ))}
         </div>
      </div>
    </section>
  );
}
