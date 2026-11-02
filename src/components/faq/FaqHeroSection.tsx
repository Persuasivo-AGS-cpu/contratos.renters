import { Search } from "lucide-react";

interface FaqHeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function FaqHeroSection({ searchQuery, onSearchChange }: FaqHeroSectionProps) {
  return (
    <section className="w-full bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)] py-24 px-6 md:py-32 relative overflow-hidden flex justify-center">
      
      {/* Decorative Grid Pattern (optional subtle overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="max-w-3xl w-full flex flex-col items-center text-center relative z-10">
        <span className="text-slate-500 text-[13px] font-bold tracking-[0.2em] mb-6">
          FAQ
        </span>
        
        <h1 className="text-5xl md:text-[64px] font-display font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
          ¿En qué podemos<br/>
          <span className="text-[#3563E9]">ayudarte?</span>
        </h1>
        
        <p className="text-slate-600 text-[18px] mb-12 font-medium">
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
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-full py-4 pl-14 pr-6 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3563E9] focus:border-transparent transition-all shadow-sm"
          />
        </div>

      </div>
    </section>
  );
}
