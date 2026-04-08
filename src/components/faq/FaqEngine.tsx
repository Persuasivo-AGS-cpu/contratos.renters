"use client";

import { useState } from "react";
import { FaqHeroSection } from "./FaqHeroSection";
import { Scale, FileText, CreditCard, Headphones, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

type Category = "Todas" | "Legal" | "Contratos" | "Pagos" | "Soporte";

interface FaqItem {
  id: string;
  category: Category;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  // LEGAL (3)
  {
    id: "leg-1",
    category: "Legal",
    question: "¿Los contratos generados son legalmente válidos?",
    answer: "Sí, absolutamente. Todas nuestras plantillas han sido redactadas, revisadas y constantemente actualizadas por abogados expertos en derecho inmobiliario conforme a los códigos civiles vigentes de cada estado soportado."
  },
  {
    id: "leg-2",
    category: "Legal",
    question: "¿Para qué estados están disponibles los contratos?",
    answer: "Actualmente nuestro motor soporta con precisión milimétrica las legislaciones de: Ciudad de México, Nuevo León, Jalisco y Estado de México. Pronto abriremos más estados."
  },
  {
    id: "leg-3",
    category: "Legal",
    question: "¿Necesito un abogado para usar el contrato?",
    answer: "No. El propósito de Renters es digitalizar y automatizar el trabajo que haría un abogado, ahorrándote tiempo y dinero, sin sacrificar seguridad legal. El contrato resultante está listo para firmarse."
  },
  
  // CONTRATOS (4)
  {
    id: "con-1",
    category: "Contratos",
    question: "¿Cuánto tiempo tarda generar un contrato?",
    answer: "El proceso toma menos de 10 minutos. Solo debes responder preguntas básicas sobre el arrendador, el inquilino, el inmueble y las condiciones de renta. Nuestro motor ensambla el PDF de inmediato."
  },
  {
    id: "con-2",
    category: "Contratos",
    question: "¿Qué incluye el contrato?",
    answer: "El contrato incluye declaraciones legales, cláusulas de objeto, precio, vigencia, penas convencionales, fiador, causales de rescisión, jurisdicción y domicilios, además de anexos de inventario si los requieres."
  },
  {
    id: "con-3",
    category: "Contratos",
    question: "¿Qué pasa si mi propiedad está amueblada?",
    answer: "Nuestro formulario detecta automáticamente esta condición y te permite adjuntar e integrar legalmente un anexo de inventario detallado de muebles y estado de la propiedad para proteger tus bienes."
  },
  {
    id: "con-4",
    category: "Contratos",
    question: "¿Puedo modificar el contrato después de generarlo?",
    answer: "Por razones de seguridad jurídica y blindaje del modelo legal, el PDF final es inalterable directamente, pero puedes volver a generar una nueva versión desde tu dashboard si omitiste algún dato."
  },
  
  // PAGOS (2)
  {
    id: "pag-1",
    category: "Pagos",
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, Amex) procesadas a través de una conexión blindada SSL y Stripe, garantizando máxima seguridad en tu transacción."
  },
  {
    id: "pag-2",
    category: "Pagos",
    question: "¿Ofrecen factura?",
    answer: "Sí, el costo de $499 MXN es precio final con IVA incluido. Tras realizar el pago podrás solicitar y descargar tu factura CFDI."
  },

  // SOPORTE (2)
  {
    id: "sop-1",
    category: "Soporte",
    question: "¿Cómo recibo mi contrato?",
    answer: "Un par de segundos tras completar el pago, recibirás un correo electrónico automático con el PDF adjunto. Además quedará respaldado de por vida en tu plataforma Renters."
  },
  {
    id: "sop-2",
    category: "Soporte",
    question: "¿Brindan asesoría si surge un conflicto con mi inquilino?",
    answer: "Te proveemos la mejor herramienta preventiva (el contrato blindado). Sin embargo, no somos un despacho en representación, por lo que para juicios o mediaciones futuras deberás contactar a tu abogado de confianza."
  }
];

export function FaqEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { name: "Todas", icon: null },
    { name: "Legal", icon: <Scale className="w-[18px] h-[18px]" /> },
    { name: "Contratos", icon: <FileText className="w-[18px] h-[18px]" /> },
    { name: "Pagos", icon: <CreditCard className="w-[18px] h-[18px]" /> },
    { name: "Soporte", icon: <Headphones className="w-[18px] h-[18px]" /> },
  ];

  // Filtering Logic
  const filteredData = faqData.filter(item => {
    const matchesCategory = activeCategory === "Todas" || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col bg-[#FAFAFA]">
      
      <FaqHeroSection 
        searchQuery={searchQuery} 
        onSearchChange={(val) => {
          setSearchQuery(val);
          setActiveCategory("Todas"); // Reset category when searching for better UX
        }} 
      />

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto w-full px-6 py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 tracking-[0.15em] mb-4">CATEGORÍAS</h3>
          
          <div className="flex flex-col gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              const count = cat.name === "Todas" 
                  ? faqData.length 
                  : faqData.filter(f => f.category === cat.name).length;

              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name as Category)}
                  className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all ${
                    isActive 
                      ? "bg-[#111] text-white font-bold shadow-md" 
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {cat.icon && <span className={isActive ? "text-white" : "text-gray-400"}>{cat.icon}</span>}
                    {cat.name}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contact Support Card */}
          <div className="mt-8 bg-[#f0f4ff] border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[#1a56ff] font-bold text-[14px] mb-3">
              <ZapIcon /> Respuesta en &lt; 2h
            </div>
            <p className="text-gray-600 text-[14px] leading-relaxed mb-5">
              ¿No encuentras tu respuesta? Escríbenos y te ayudamos de inmediato.
            </p>
            <a 
              href="mailto:soporte@renters.mx"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-blue-200 bg-white text-[#1a56ff] font-bold text-[14px] hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-[18px] h-[18px]" /> Ir a Contacto
            </a>
          </div>

        </div>

        {/* Right Content Area (Accordion List) */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {filteredData.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No se encontraron resultados para tu búsqueda.
            </div>
          ) : (
            filteredData.map((faq) => {
              const isExpanded = expandedId === faq.id;
              
              // Map category pill styling
              let pillColor = "bg-[#f0f4ff] text-[#1a56ff]"; // Default (Soporte, etc)
              if (faq.category === "Contratos") pillColor = "bg-[#f3e8ff] text-[#9333ea]";
              if (faq.category === "Pagos") pillColor = "bg-[#fff7ed] text-[#ea580c]";
              if (faq.category === "Soporte") pillColor = "bg-[#e0f2fe] text-[#0ea5e9]";

              return (
                <div 
                  key={faq.id} 
                  className={`w-full bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded ? "border-[#1a56ff] shadow-md shadow-blue-500/5" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button 
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${pillColor}`}>
                        {faq.category}
                      </span>
                      <span className="font-bold text-[#111] text-[16px] md:text-[18px]">
                        {faq.question}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-[#4b5563] text-[15px] leading-relaxed md:pl-[95px]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

// Inline ZapIcon specific to match the blue lighting
function ZapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}
