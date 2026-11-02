import Link from "next/link";
import { Check, FileText, Mail, LifeBuoy, ShieldCheck, Lock, CreditCard, Download, RefreshCw } from "lucide-react";
import { CLAUSULAS } from "@/lib/clausulas";
import { CORRECCION_GRATIS_HORAS, ENLACE_VIGENCIA_DIAS, SOPORTE_RESPUESTA } from "@/lib/compra";

// Última pantalla antes de pagar: qué se obtiene y qué pasa al pagar.
// Todo lo que promete sale de lib/compra.ts y lib/clausulas.ts, que tienen pruebas.
export function PurchaseValue({
  legalStateName,
  furnished,
  includesGuarantor,
}: {
  legalStateName: string;
  furnished: boolean;
  includesGuarantor: boolean;
}) {
  // La cláusula de fiador solo está en el PDF cuando se incluye fiador.
  const clausulas = CLAUSULAS.filter((c) => includesGuarantor || c.titulo !== 'FIADOR Y OBLIGADO SOLIDARIO');
  return (
    <div className="mt-8 space-y-6">
      <section className="bg-white border border-border-layout rounded-2xl p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-text-main mb-1">Lo que incluye tu compra</h3>
        <p className="text-sm text-text-muted mb-4">Pago único, IVA incluido. Sin suscripción.</p>

        <ul className="space-y-3 text-sm text-text-main">
          <li className="flex gap-3">
            <FileText className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Tu contrato en PDF, listo para firmar</strong>, conforme al Código Civil de {legalStateName}.
            </span>
          </li>
          <li className="flex gap-3">
            <Mail className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Te llega por correo</strong> y puedes descargarlo con tu enlace durante {ENLACE_VIGENCIA_DIAS} días.
            </span>
          </li>
          <li className="flex gap-3">
            <RefreshCw className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Corrección de datos gratis</strong> durante las primeras {CORRECCION_GRATIS_HORAS} horas, si notas un error.
            </span>
          </li>
          <li className="flex gap-3">
            <LifeBuoy className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Soporte</strong> con respuesta en {SOPORTE_RESPUESTA}.{" "}
              <Link href="/contacto" className="text-brand-primary underline">Escríbenos</Link>
            </span>
          </li>
        </ul>

        <div className="mt-5 pt-5 border-t border-border-layout">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
            {clausulas.length} cláusulas incluidas{furnished ? " + anexo de inventario" : ""}
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-main">
            {clausulas.map((c) => (
              <li key={c.titulo} className="flex gap-2">
                <Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> {c.nombre}
              </li>
            ))}
            {furnished && (
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" /> Anexo A: inventario de muebles
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-white border border-border-layout rounded-2xl p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-text-main mb-4">Tu tranquilidad</h3>
        <ul className="space-y-3 text-sm text-text-main">
          <li className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>Redactado y validado por abogados expertos en el tema.</span>
          </li>
          <li className="flex gap-3">
            <CreditCard className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>El pago lo procesa Stripe. Renters nunca ve los datos de tu tarjeta.</span>
          </li>
          <li className="flex gap-3">
            <Lock className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              Tus datos se usan para generar y entregarte tu contrato, y no los vendemos. Aquí explicamos cómo los tratamos:{" "}
              <Link href="/privacidad" className="text-brand-primary underline">Aviso de privacidad</Link>
            </span>
          </li>
        </ul>
      </section>

      <section className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold text-text-main mb-4">Qué pasa cuando pagas</h3>
        <ol className="space-y-4 text-sm text-text-main">
          {[
            { icon: CreditCard, t: "Pagas de forma segura", d: "Te llevamos a la página de Stripe para pagar $499 MXN con tarjeta." },
            { icon: Download, t: "Descargas tu contrato al instante", d: "Al terminar vuelves a Renters y puedes descargar el PDF en segundos." },
            { icon: Mail, t: "Lo recibes también por correo", d: `Si notas un error, tienes ${CORRECCION_GRATIS_HORAS} horas para pedir la corrección sin costo.` },
          ].map((p, i) => (
            <li key={p.t} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span>
                <strong>{p.t}.</strong> {p.d}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
