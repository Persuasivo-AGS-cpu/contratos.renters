import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Star } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="w-full bg-[#0a0e17] text-white py-16 px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col justify-center h-full relative overflow-hidden">
      
      {/* Decorative Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
        <span className="text-[#a1a1aa] text-[13px] font-bold tracking-[0.2em] mb-6 block uppercase">
          Contacto
        </span>
        
        <h1 className="text-5xl md:text-[64px] font-display font-black leading-[1.05] tracking-tight mb-6">
          Hablemos.<br/>
          <span className="text-[#1a56ff]">Estamos aquí.</span>
        </h1>
        
        <p className="text-[#a1a1aa] text-[18px] md:text-[20px] mb-10 font-medium leading-relaxed max-w-md">
          ¿Tienes dudas sobre tus contratos, necesitas algo especial o quieres tu factura? Escríbenos, respondemos rápido.
        </p>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-gray-800 bg-[#0B0F19] mb-12 shadow-sm">
          <div className="flex items-center justify-center relative w-3 h-3">
             <div className="absolute inset-0 bg-[#10b981] rounded-full animate-ping opacity-75"></div>
             <div className="relative w-2 h-2 bg-[#10b981] rounded-full"></div>
          </div>
          <span className="text-sm font-bold text-gray-300">Respondemos en menos de 2 horas</span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-5 mb-14">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 shadow-xl">
            <Image 
              src="/images/daniela_profile.png" 
              alt="Daniela Ríos" 
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h4 className="font-bold text-[17px] text-white">Daniela Ríos</h4>
            <p className="text-[#a1a1aa] text-[14px]">Especialista Legal · Te responderá personalmente</p>
          </div>
        </div>

        {/* Directory */}
        <ul className="space-y-6 mb-12 border-b border-gray-800 pb-12">
          <li className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-300 font-medium">contacto@renters.mx</span>
          </li>
          <li className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-gray-500" />
            <a href="https://wa.me/528110610111" target="_blank" rel="noreferrer" className="text-gray-300 font-medium hover:text-[#10b981] transition-colors">+52 81 1061 0111</a>
          </li>
          <li className="flex items-center gap-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="text-gray-300 font-medium">Monterrey, Nuevo León</span>
          </li>
          <li className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-300 font-medium">Lun – Vie · 9:00 a 18:00</span>
          </li>
        </ul>

        {/* Trust & WhatsApp */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-[#facc15] text-[#facc15]" />
            <Star className="w-5 h-5 fill-[#facc15] text-[#facc15]" />
            <Star className="w-5 h-5 fill-[#facc15] text-[#facc15]" />
            <Star className="w-5 h-5 fill-[#facc15] text-[#facc15]" />
            <Star className="w-5 h-5 fill-[#facc15] text-[#facc15]" />
            <span className="ml-2 font-bold text-gray-300">4.9/5 en Google</span>
          </div>
          <p className="text-gray-500 text-[14px]">
            +1,200 arrendadores nos contactaron este mes
          </p>

          <a
            href="https://wa.me/528110610111"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-[#10b981] font-bold hover:text-[#059669] transition-colors"
          >
            <WhatsAppIcon /> También puedes escribirnos por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}
