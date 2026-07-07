import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Arrendador en Nuevo León",
      text: "Llevo 3 propiedades rentadas con los contratos de Renters. El proceso es increíblemente simple y me da la tranquilidad absoluta de saber que están respaldados por el Código Civil del Estado.",
      stars: 5
    },
    {
      name: "Ana Patricia Ruiz",
      role: "Propietaria",
      text: "Antes le pagaba más de $3,500 a un buffet de abogados por cada redacción de contrato. Con Renters lo tengo en exactamente 10 minutos por $499 MXN. Es una verdadera maravilla tecnológica.",
      stars: 5
    },
    {
      name: "Roberto Sánchez",
      role: "Inversionista Inmobiliario",
      text: "Me dedico a bienes raíces y la plataforma es ultra profesional. Me encanta la estructura de las cláusulas, especialmente cómo manejan rigurosamente a la figura del Fiador o Aval. Recomendado al cien.",
      stars: 5
    }
  ];

  return (
    <section className="w-full py-28 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#E8F0FE] text-[#1a56ff] font-bold text-[11px] uppercase tracking-[0.2em] mb-6 shadow-sm">TESTIMONIOS</div>
          <h2 className="text-3xl md:text-[40px] font-display font-black text-text-main mb-4 tracking-tight">Arrendadores que confían en Renters</h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">No arriesgues la plusvalía de tus bienes raíces. Únete a los propietarios que duermen tranquilos gracias a nuestro blindaje.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {testimonials.map((t, i) => (
             <div key={i} className="bg-white p-8 rounded-2xl border border-border-layout shadow-sm flex flex-col justify-between">
                <div>
                   <div className="flex gap-1 mb-6">
                      {[...Array(t.stars)].map((_, s) => (
                         <Star key={s} className="w-5 h-5 fill-brand-accent text-brand-accent" />
                      ))}
                   </div>
                   <p className="text-text-main leading-relaxed mb-8 italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-surface-subtle rounded-full border border-border-layout flex items-center justify-center font-display font-bold text-text-muted">
                      {t.name.charAt(0)}
                   </div>
                   <div>
                      <p className="font-bold text-text-main text-sm">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
