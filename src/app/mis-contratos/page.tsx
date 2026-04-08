import Link from "next/link";
import { FileText, Plus, MapPin, DollarSign, Calendar } from "lucide-react";

export const metadata = {
  title: "Mis Contratos | Renters",
  description: "Administra tus contratos de arrendamiento generados.",
};

const mockContracts = [
  {
    id: "1",
    address: "Joya Topacio 103",
    state: "Nuevo León",
    rent: "$15,400",
    date: "08 Apr 2026",
    status: "pagado"
  },
  {
    id: "2",
    address: "Joya topacio, 103, Cumbres la joya, Monterrey Nuevo león, 64349",
    state: "Nuevo León",
    rent: "$22,000",
    date: "07 Apr 2026",
    status: "pagado"
  },
  {
    id: "3",
    address: "Condor 2351, cumbres segundo sector, Monterrey Nuevo León, 64610",
    state: "Estado de México",
    rent: "$12,300",
    date: "06 Apr 2026",
    status: "pagado"
  },
  {
    id: "4",
    address: "joya topacio 103",
    state: "Nuevo León",
    rent: "$14,500",
    date: "05 Apr 2026",
    status: "pagado"
  },
  {
    id: "5",
    address: "topacio 103",
    state: "Nuevo León",
    rent: "$3,000",
    date: "02 Apr 2026",
    status: "pagado"
  },
  {
    id: "6",
    address: "Joya Topacio 103, Cumbres segundo sector, Monterrey, Nuevo León Mexico.",
    state: "Nuevo León",
    rent: "$12,700",
    date: "02 Apr 2026",
    status: "pendiente"
  }
];

export default function MisContratosPage() {
  return (
    <div className="flex-1 bg-[#FAFAFA] min-h-[calc(100vh-64px)] py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-[32px] font-display font-black text-gray-900 tracking-tight leading-none mb-2">
              Mis Contratos
            </h1>
            <p className="text-gray-500 font-medium">Administra tus contratos de arrendamiento.</p>
          </div>
          <Link 
            href="/contrato"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4D6BFE] text-white font-bold rounded-xl hover:bg-[#3b55d9] transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" /> Nuevo Contrato
          </Link>
        </div>

        {/* Contract List */}
        <div className="space-y-3">
          {mockContracts.map((c) => (
            <div 
              key={c.id} 
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px] mb-1 line-clamp-1">{c.address}</h3>
                  <div className="flex items-center gap-3 text-[12px] font-medium text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.state}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {c.rent} /mes</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {c.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 self-end md:self-auto">
                {c.status === 'pagado' ? (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#EBF1FF] text-[#4D6BFE] border border-[#d6e2ff]">
                    Pagado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#FFF4E5] text-[#F59E0B] border border-[#ffecce]">
                    Pendiente de pago
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
