import { ArrowRight } from "lucide-react";
import { COPY } from "@/lib/copy";

export function PolizaNota({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-border-layout bg-white p-5 text-left ${className}`}>
      <p className="mb-2 text-sm font-semibold text-text-main">{COPY.soloContrato}</p>
      <p className="text-sm leading-relaxed text-text-muted">{COPY.polizaNota}</p>
      <a
        href={COPY.polizaEnlace.href}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3563E9] hover:underline"
      >
        {COPY.polizaEnlace.label} <ArrowRight className="size-4" />
      </a>
    </div>
  );
}
