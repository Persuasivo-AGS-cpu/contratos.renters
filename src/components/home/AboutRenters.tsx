import { ArrowUpRight, ShieldCheck, FileText } from "lucide-react";

export function AboutRenters() {
  return (
    <section className="w-full py-24 px-6 bg-[#f8f9fa] border-y border-gray-200/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 font-bold text-[11px] uppercase tracking-[0.2em] mb-4 text-[#1a56ff]">
            Parte de Renters
          </div>
          <h2 className="text-3xl md:text-[42px] font-display font-black text-text-main tracking-tight mb-4">
            Respaldado por Renters
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Contratos es el brazo digital de <strong className="text-gray-700">Renters</strong>, la
            plataforma que protege el patrimonio de arrendadores en México.
          </p>
        </div>

        {/* Dos niveles de protección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E8F0FE] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#1a56ff]" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Tu contrato: protección en papel</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Un contrato legalmente válido, redactado por abogados y adaptado a tu estado.
              El primer blindaje de tu propiedad.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#0d944c]" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">La Póliza Jurídica: protección en la vida real</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Si tu inquilino deja de pagar, Renters lo gestiona por ti. El respaldo completo
              que va más allá del papel <span className="text-gray-400">(disponible en Nuevo León)</span>.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="https://www.renters.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold rounded-xl transition-colors shadow-sm"
          >
            Conoce Renters <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
