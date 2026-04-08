"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Visión General", href: "/admin", exact: true },
    { name: "Transacciones", href: "/admin/transacciones" },
    { name: "Contratos", href: "/admin/contratos" },
    { name: "Ajustes", href: "/admin/ajustes" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8 h-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-900 rounded-[4px] flex items-center justify-center text-white font-bold text-[10px]">R</div>
          <span className="font-bold text-[14px]">Renters HQ</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium h-full">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`h-full flex items-center pt-0.5 transition-colors ${
                  isActive 
                    ? "text-gray-900 border-b-2 border-gray-900" 
                    : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
         <div className="text-[13px] text-gray-500 font-medium">Entorno: <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Producción</span></div>
         <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-blue-700/20 cursor-pointer">
           A
         </div>
      </div>
    </nav>
  );
}
