import { Webhook, Info } from "lucide-react";

export default function AjustesPage() {
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  const resendKey = process.env.RESEND_API_KEY ?? "";
  const stripeKeyMasked = stripeKey ? `${stripeKey.slice(0, 12)}••••••••••••${stripeKey.slice(-4)}` : "No configurada";
  const resendKeyMasked = resendKey ? `re_••••••••${resendKey.slice(-4)}` : "No configurada";
  const isLive = stripeKey.startsWith("rk_live") || stripeKey.startsWith("sk_live");

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">
            Ajustes del Sistema
          </h1>
          <p className="text-[13px] text-gray-500 font-medium">
            Configuración de núcleo y llaves de integración. Solo lectura — modifica en variables de entorno.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pricing */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <DollarIcon />
            <h2 className="text-[14px] font-semibold text-gray-900">Precios y Monetización</h2>
          </div>
          <div className="p-6">
            <div className="max-w-xs">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                Precio Contrato Básico (MXN)
              </label>
              <div className="flex items-center h-10 px-3 border border-gray-200 rounded-md bg-gray-50 text-[14px] font-bold text-gray-800">
                $499.00
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Precio único. Modificar en <code className="bg-gray-100 px-1 rounded">src/lib/stripe.ts → PLAN_PRICES</code>
              </p>
            </div>
          </div>
        </div>

        {/* Stripe Mode */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Webhook className="w-4 h-4 text-gray-400" />
            <h2 className="text-[14px] font-semibold text-gray-900">Integraciones API</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                Stripe Key
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-10 px-3 border border-gray-200 rounded-md bg-gray-50 text-[13px] font-mono text-gray-500 flex items-center">
                  {stripeKeyMasked}
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    isLive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}
                >
                  {isLive ? "LIVE" : "TEST"}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Configura en variable de entorno <code className="bg-gray-100 px-1 rounded">STRIPE_SECRET_KEY</code>
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                Resend API Key (Correos)
              </label>
              <div className="h-10 px-3 border border-gray-200 rounded-md bg-gray-50 text-[13px] font-mono text-gray-500 flex items-center">
                {resendKeyMasked}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Configura en variable de entorno <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY</code>
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                URL del Sistema
              </label>
              <div className="h-10 px-3 border border-gray-200 rounded-md bg-gray-50 text-[13px] font-mono text-gray-600 flex items-center">
                {process.env.NEXT_PUBLIC_APP_URL ?? "No configurada"}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Variable <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_APP_URL</code> — debe ser <code className="bg-gray-100 px-1 rounded">https://contratos.renters.mx</code> en producción
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-[13px] text-blue-700">
          <Info className="w-4 h-4 shrink-0" />
          Todos los ajustes se configuran como variables de entorno en Vercel. No se persisten desde este panel.
        </div>
      </div>
    </div>
  );
}

function DollarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
