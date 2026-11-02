"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, DownloadCloud, Loader2, AlertCircle, ArrowUpRight } from "lucide-react";
import { useContractStore } from "@/store/useContractStore";
import { trackPurchase, trackUpsellClick } from "@/lib/analytics";
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)]">
        <Loader2 className="w-12 h-12 text-[#3563E9] animate-spin mb-4" />
        <p className="text-slate-600 text-lg">Verificando tu pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)] px-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-slate-900 text-2xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-slate-600 text-center max-w-sm mb-6">{error}</p>
        <Link href="/contacto" className="px-6 py-3 bg-[#3563E9] text-white rounded-full font-semibold hover:bg-[#2951CB] transition-colors">
          Contactar Soporte
        </Link>
      </div>
    );
  }

  if (stillProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)] px-6">
        <Loader2 className="w-12 h-12 text-[#3563E9] mb-4" />
        <h2 className="text-slate-900 text-2xl font-bold mb-2">Tu pago se está procesando</h2>
        <p className="text-slate-600 text-center max-w-sm mb-6">
          Está tardando más de lo normal. En cuanto se confirme te llegará el contrato por correo — si en unos minutos no te llega, contáctanos.
        </p>
        <Link href="/contacto" className="px-6 py-3 bg-[#3563E9] text-white rounded-full font-semibold hover:bg-[#2951CB] transition-colors">
          Contactar Soporte
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)]">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          opacity: 0.05,
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3563E9] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-6 py-12 flex flex-col items-center text-center">

        <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.25)] mb-8 transform -rotate-6">
          <CheckCircle2 className="w-12 h-12 text-white transform rotate-6" />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-2 text-slate-900 tracking-tight">
          ¡Pago Exitoso!
        </h1>
        {result?.folio && (
          <p className="font-mono text-xs text-slate-500 mb-4 tracking-widest">Folio: {result.folio}</p>
        )}
        <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-md mx-auto">
          Tu contrato de arrendamiento oficial está listo para descargar.
        </p>

        <div className="w-full bg-white border border-border-layout rounded-3xl p-6 md:p-8 shadow-sm">

          <Link
            href={result?.pdf_token ? `/api/pdf?token=${result.pdf_token}` : '#'}
            target="_blank"
            className="flex flex-col items-center justify-center gap-3 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-slate-900 rounded-2xl p-6 transition-all group w-full mb-4"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <DownloadCloud className="w-6 h-6 text-[#3563E9]" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg leading-none mb-1">Descargar / Imprimir</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Archivo PDF</span>
            </div>
          </Link>

        </div>

        <div className="mt-8 flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-center gap-2 text-slate-600 bg-white py-2 px-4 rounded-full border border-border-layout">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium">Contrato redactado jurídicamente y listo para firma.</span>
          </div>

          <div className="w-full bg-white border border-border-layout rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-left gap-4">
            <div>
              <h5 className="text-[13px] font-bold text-slate-900 mb-0.5">¿Notaste un error en tu contrato?</h5>
              <p className="text-[12px] text-slate-500 leading-tight">Soporte gratuito para corregir datos en las primeras 24 horas.</p>
            </div>
            <Link href="/contacto" className="shrink-0 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-900 text-[12px] font-semibold rounded-full transition-colors">
              Contactar Soporte
            </Link>
          </div>

          {/* Upsell de póliza jurídica — solo Nuevo León (folio NL-), donde hay cobertura */}
          {result?.folio?.startsWith("NL-") && (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <h5 className="text-[14px] font-bold text-slate-900">Da el siguiente paso: protégete si tu inquilino no paga</h5>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                Tu contrato te blinda en papel. Con la <strong className="text-slate-900">Póliza Jurídica de Renters</strong>,
                si tu inquilino deja de pagar, nosotros lo gestionamos por ti — cobranza y desalojo incluidos.
                Escríbenos y te contamos cómo funciona.
              </p>
              <a
                href={`https://wa.me/528110610111?text=${encodeURIComponent(
                  `Hola, acabo de generar mi contrato de arrendamiento${result?.folio ? ` (folio ${result.folio})` : ""} y me interesa la Póliza Jurídica de Renters en Nuevo León.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackUpsellClick("poliza-nl", result?.folio ?? "")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold rounded-full transition-colors"
              >
                Pregúntanos por WhatsApp <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top_right,#E0E7FF_0%,#F4F7FB_40%,#FFFFFF_100%)]">
        <Loader2 className="w-12 h-12 text-[#3563E9] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
