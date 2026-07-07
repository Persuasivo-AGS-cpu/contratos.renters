"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, DownloadCloud, Loader2, AlertCircle } from "lucide-react";
import { useContractStore } from "@/store/useContractStore";
import { trackPurchase } from "@/lib/analytics";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface ContractResult {
  folio: string;
  pdf_token: string;
}

const MAX_VERIFY_ATTEMPTS = 30; // ~1 minuto a 2s por intento

function SuccessContent() {
  const { resetContract } = useContractStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContractResult | null>(null);
  const [stillProcessing, setStillProcessing] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError('No se encontró la sesión de pago.');
      setLoading(false);
      return;
    }

    const verify = async (attempt: number) => {
      try {
        const res = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (res.status === 402) {
          // Pago aún procesándose — reintentar en 2s
          if (attempt >= MAX_VERIFY_ATTEMPTS) {
            setStillProcessing(true);
            setLoading(false);
            return;
          }
          setTimeout(() => verify(attempt + 1), 2000);
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error verificando pago');
        }

        setResult({ folio: data.folio, pdf_token: data.pdf_token });
        trackPurchase(data.folio);
        resetContract();
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    verify(0);
  }, [sessionId, resetContract]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
        <p className="text-gray-400 text-lg">Verificando tu pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c] px-6">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-white text-2xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-gray-400 text-center max-w-sm mb-6">{error}</p>
        <Link href="/contacto" className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors">
          Contactar Soporte
        </Link>
      </div>
    );
  }

  if (stillProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c] px-6">
        <Loader2 className="w-12 h-12 text-blue-400 mb-4" />
        <h2 className="text-white text-2xl font-bold mb-2">Tu pago se está procesando</h2>
        <p className="text-gray-400 text-center max-w-sm mb-6">
          Está tardando más de lo normal. En cuanto se confirme te llegará el contrato por correo — si en unos minutos no te llega, contáctanos.
        </p>
        <Link href="/contacto" className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors">
          Contactar Soporte
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden bg-[#0a0f1c]">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#111827] to-[#0a0f1c]" />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          opacity: 0.1,
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4D6BFE] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-6 py-12 flex flex-col items-center text-center">

        <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-8 transform -rotate-6">
          <CheckCircle2 className="w-12 h-12 text-white transform rotate-6" />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black mb-2 text-white tracking-tight">
          ¡Pago Exitoso!
        </h1>
        {result?.folio && (
          <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest">Folio: {result.folio}</p>
        )}
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
          Tu contrato de arrendamiento oficial está listo para descargar.
        </p>

        <div className="w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">

          <Link
            href={result?.pdf_token ? `/imprimir?token=${result.pdf_token}&folio=${result.folio}` : '#'}
            target="_blank"
            className="flex flex-col items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl p-6 transition-all group w-full mb-4"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <DownloadCloud className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg leading-none mb-1">Descargar / Imprimir</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Archivo PDF</span>
            </div>
          </Link>

        </div>

        <div className="mt-8 flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-center gap-2 text-gray-500 bg-white/5 py-2 px-4 rounded-full border border-white/5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium">Contrato redactado jurídicamente y listo para firma.</span>
          </div>

          <div className="w-full bg-[#111827]/50 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-left gap-4 backdrop-blur-md">
            <div>
              <h5 className="text-[13px] font-bold text-white mb-0.5">¿Notaste un error en tu contrato?</h5>
              <p className="text-[12px] text-gray-400 leading-tight">Soporte gratuito para corregir datos en las primeras 24 horas.</p>
            </div>
            <Link href="/contacto" className="shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold rounded-lg transition-colors border border-white/5">
              Contactar Soporte
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0a0f1c]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
