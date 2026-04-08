"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
       q: "¿Los contratos generados son legalmente válidos?",
       a: "Totalmente. Nuestro motor cuenta con plantillas desarrolladas por abogados expertos, cruzando la información para generar un documento acoplado al milímetro con el Código Civil de tu jurisdicción elegida."
    },
    {
       q: "¿Cuánto tiempo tarda generar un contrato?",
       a: "El tiempo que te tome responder el cuestionario dinámico. En promedio son menos de 6 minutos. Una vez realizado el pago, el archivo PDF final es despachado de forma instantánea."
    },
    {
       q: "¿Para qué estados están disponibles?",
       a: "Renters ofrece cobertura garantizada para Nuevo León, Yucatán, Querétaro, Coahuila, CDMX y Estado de México. Estamos expandiendo al resto del país velozmente."
    },
    {
       q: "¿Necesito un abogado para usarlo?",
       a: "No. Esa es la ventaja de Renters. El algoritmo inyecta las cláusulas protectoras como renuncia a la jurisdicción domiciliaria y deudor solidario para que estés 100% protegido sin gastar en asesoría."
    },
    {
       q: "¿Qué métodos de pago aceptan?",
       a: "Aceptamos todas las tarjetas de Crédito y Débito (Visa, Mastercard, Amex) procesadas bajo el blindaje y seguridad bancaria directa de Stripe."
    },
    {
       q: "¿Puedo modificar el contrato después de generarlo?",
       a: "Sí. Dentro de tu cuenta tendrás un periodo de gracia en el que podrás editar sin costo algunas correcciones menores, o usar tu Pack Inmobiliario si ya lo has adquirido."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-16 px-6 bg-[#f8f9fa] overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-block font-bold text-xs uppercase tracking-[0.2em] mb-4 text-[#1a56ff]">PREGUNTAS FRECUENTES</div>
          <h2 className="text-3xl md:text-[40px] font-display font-black text-text-main mb-3 tracking-tight">Todo lo que necesitas saber</h2>
          <p className="text-lg text-gray-500 font-medium">Respuestas directas a las dudas más comunes de arrendadores en México.</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
           {faqs.map((faq, i) => (
             <div key={i} className="rounded-xl overflow-hidden bg-white shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left px-8 py-5 flex items-center justify-between gap-4 font-bold text-[17px] text-[#111] hover:text-[#1a56ff] transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-6 h-6 shrink-0 transition-transform ${openIndex === i ? 'rotate-180 text-[#1a56ff]' : 'text-gray-400'}`} />
                </button>
                <div 
                   className={`grid transition-all duration-300 ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                   <div className="overflow-hidden">
                     <p className="px-8 pb-6 text-gray-500 leading-relaxed text-[16px]">{faq.a}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-gray-500 font-medium mr-2">¿Tienes una pregunta diferente?</p>
          <button className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[14px] text-gray-700 font-bold shadow-sm transition-colors">
            Ver todas las preguntas
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0d52ff] hover:bg-[#003ee6] text-white text-[14px] font-bold shadow-md shadow-blue-500/20 transition-colors">
            <MessageCircle className="w-5 h-5" /> Contáctanos
          </button>
        </div>
      </div>
    </section>
  );
}
