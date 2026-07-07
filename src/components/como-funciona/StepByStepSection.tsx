import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function StepByStepSection() {
  const steps = [
    {
      pill: "PASO 01",
      subtitle: "Formulario inteligente",
      title: "Responde el formulario paso a paso",
      desc: "Sin tecnicismos. Nuestro formulario te guía con preguntas claras: la propiedad, quién renta, quién arrienda y los términos económicos. En 5 minutos tienes todo capturado.",
      bullets: [
        "Tipo de propiedad, dirección y condición (amueblada o no)",
        "Datos del arrendador e inquilino con ID",
        "Renta mensual, depósito y duración del contrato",
        "Cláusulas opcionales: fiador, penalidades, inventario"
      ],
      image: "/images/step1_latin_laptop_1775795637922.png",
      imagePill: "Persona llenando formulario en laptop"
    },
    {
      pill: "PASO 02",
      subtitle: "Motor legal por estado",
      title: "El sistema arma tu contrato en segundos",
      desc: "Seleccionamos automáticamente la plantilla legal correcta para tu estado — disponible para Nuevo León, Jalisco, Querétaro, Mérida y San Luis Potosí. Cada plantilla fue redactada por abogados especializados.",
      bullets: [
        "Plantilla adaptada al código civil de tu estado",
        "Variables dinámicas con tus datos exactos",
        "Cláusulas legales obligatorias incluidas",
        "Anexo de inventario si la propiedad es amueblada"
      ],
      image: "/images/step2_latin_legal_1775795652381.png",
      imagePill: "Documentos legales y contrato",
      reverse: true
    },
    {
      pill: "PASO 03",
      subtitle: "Pago seguro",
      title: "Paga en línea con total seguridad",
      desc: "Un solo pago, sin suscripciones ni cargos ocultos. Aceptamos tarjetas de crédito, débito y transferencia. El precio incluye IVA y factura digital.",
      bullets: [
        "Desde $499 MXN — menos que una hora de abogado",
        "Pago encriptado con certificado SSL",
        "Factura CFDI disponible a solicitud",
        "Garantía de satisfacción"
      ],
      image: "/images/step3_latin_payment_1775795667532.png",
      imagePill: "Pago seguro con tarjeta"
    },
    {
      pill: "PASO 04",
      subtitle: "Entrega inmediata",
      title: "Recibe tu PDF listo para firmar",
      desc: "En segundos llega a tu correo electrónico. El contrato en PDF es profesional, listo para imprimir, firmar y entregar. También lo guardamos en tu dashboard.",
      bullets: [
        "PDF con formato legal profesional",
        "Instrucciones de firma incluidas",
        "Copia en tu dashboard permanentemente",
        "Reenvío por correo sin costo"
      ],
      image: "/images/step4_latin_contract_1775795679209.png",
      imagePill: "Persona revisando contrato en PDF",
      reverse: true
    }
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-[1240px] mx-auto space-y-32">
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col gap-12 lg:gap-20 items-center ${step.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
          >
            {/* Text Content */}
            <div className="flex-1 w-full max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#E6F4EA] text-[#0d944c] font-black text-[13px] px-3 py-1.5 rounded-full tracking-wider">
                  {step.pill}
                </span>
                <span className="text-[#4b5563] font-bold text-[14px]">
                  {step.subtitle}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-[40px] font-display font-black text-[#111] leading-tight tracking-tight mb-6">
                {step.title}
              </h2>
              
              <p className="text-[#4b5563] text-[18px] leading-relaxed mb-8">
                {step.desc}
              </p>
              
              <ul className="space-y-4">
                {step.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0 fill-[#E6F4EA] relative top-[2px]" />
                    <span className="text-[#374151] font-medium leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Box */}
            <div className="flex-1 w-full relative group">
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/5">
                <Image 
                  src={step.image} 
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
                
                {/* Floating Image Pill */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-[#111] text-[13px] font-bold px-4 py-2.5 rounded-full shadow-lg">
                  {step.imagePill}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
