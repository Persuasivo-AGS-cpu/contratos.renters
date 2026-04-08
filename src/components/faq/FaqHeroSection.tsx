import { Search } from "lucide-react";

interface FaqHeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function FaqHeroSection({ searchQuery, onSearchChange }: FaqHeroSectionProps) {
  return (
    <section className="w-full bg-[#0a0e17] py-24 px-6 md:py-32 relative overflow-hidden flex justify-center">
      
      {/* Decorative Grid Pattern (optional subtle overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="max-w-3xl w-full flex flex-col items-center text-center relative z-10">
        <span className="text-[#a1a1aa] text-[13px] font-bold tracking-[0.2em] mb-6">
          FAQ
        </span>
        
        <h1 className="text-5xl md:text-[64px] font-display font-black text-white leading-[1.05] tracking-tight mb-6">
          ¿En qué podemos<br/>
          <span className="text-[#1a56ff]">ayudarte?</span>
        </h1>
        
        <p className="text-[#a1a1aa] text-[18px] mb-12 font-medium">
          11 respuestas a las dudas más comunes sobre contratos de arrendamiento.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-[600px] relative">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Busca tu pregunta... ej: '¿es válido legalmente?'"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#181e29] border border-gray-800 text-white rounded-2xl py-4 pl-14 pr-6 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a56ff] focus:border-transparent transition-all shadow-xl"
          />
        </div>

      </div>
    </section>
  );
}
