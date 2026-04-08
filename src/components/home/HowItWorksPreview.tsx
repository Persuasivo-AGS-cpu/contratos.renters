import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HowItWorksPreview() {
  const steps = [
    {
       number: "01",
       title: "Elige tu Estado",
       desc: "Nuestro motor selecciona la plantilla legal regida por la jurisdicción específica donde se encuentra el inmueble."
    },
    {
       number: "02",
       title: "Dicta las Reglas",
       desc: "Llena el formulario dinámico interactivo y personaliza el inventario, fiador, pagos y cláusulas especiales."
    },
    {
       number: "03",
       title: "Paga con Seguridad",
       desc: "$499 MXN pago único mediante conexión blindada. Sin planes ni suscripciones tramposas."
    },
    {
       number: "04",
       title: "Descarga y Firma",
       desc: "Obtén tu contrato en formato PDF instantáneamente en tu correo electrónico listo para imprimirse."
    }
  ];

  return (
    <section id="como-funciona" className="w-full py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        <div className="flex-1 w-full lg:max-w-md">
           <div className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs uppercase tracking-widest mb-6">Proceso</div>
           <h2 className="text-3xl md:text-5xl font-display font-bold text-text-main mb-6 leading-tight">Tu contrato sellado en 4 pasos simples.</h2>
           <p className="text-lg text-text-muted mb-10 leading-relaxed">
             No necesitas ser abogado ni estudiar leyes complejas. Nuestro sistema inteligente ha digitalizado y ensamblado la burocracia para ti.
           </p>
           <Link 
             href="/contrato"
             className="hidden lg:inline-flex items-center gap-2 px-6 py-3 border-2 border-text-main text-text-main font-bold rounded-xl hover:bg-text-main hover:text-white transition-colors"
           >
             Iniciar mi contrato <ArrowRight className="w-4 h-4" />
           </Link>
        </div>

        <div className="flex-1 w-full relative">
           {/* Line connection */}
           <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-brand-primary/20 via-brand-primary/10 to-transparent"></div>
           
           <div className="space-y-12 relative">
             {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative group">
                   <div className="w-16 h-16 shrink-0 rounded-2xl bg-white border-2 border-brand-primary/20 flex items-center justify-center font-display font-black text-xl text-brand-primary shadow-sm group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 relative z-10">
                     {step.number}
                   </div>
                   <div className="pt-2">
                     <h3 className="text-xl font-bold text-text-main mb-2">{step.title}</h3>
                     <p className="text-text-muted leading-relaxed max-w-sm">{step.desc}</p>
                   </div>
                </div>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
}
