import { Shield, Zap, FileText } from "lucide-react";

export function ProcessFeaturesSection() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-[#1a56ff] stroke-[2.5]" />,
      title: "Abogados especializados",
      desc: "Cada plantilla fue revisada por expertos en derecho inmobiliario mexicano."
    },
    {
      icon: <Zap className="w-6 h-6 text-[#1a56ff] stroke-[2.5]" />,
      title: "Entrega en segundos",
      desc: "Pago confirmado → contrato en tu correo. Sin esperas, sin filas."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#1a56ff] stroke-[2.5]" />,
      title: "PDF profesional",
      desc: "Formato listo para imprimir, firmar y presentar ante cualquier autoridad."
    }
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-20 pb-32 px-6 border-b border-gray-200/50">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-[#E8F0FE] flex items-center justify-center mb-6 shadow-sm">
              {f.icon}
            </div>
            {/* Body */}
            <h3 className="text-[18px] font-black text-[#111] mb-3 leading-tight tracking-tight">
              {f.title}
            </h3>
            <p className="text-[#4b5563] text-[15px] font-medium leading-relaxed max-w-[280px]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
