import Link from "next/link";
import { Mail, Phone as TelefonoIcono, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { CONTACTO } from "@/lib/contactInfo";
import { SOPORTE_RESPUESTA } from "@/lib/compra";
import { Reveal } from "@/components/shared/Reveal";

export function SoporteSection() {
  const datos = [
    { Icono: Mail, titulo: "Correo", valor: CONTACTO.email, href: `mailto:${CONTACTO.email}` },
    { Icono: TelefonoIcono, titulo: "Teléfono y WhatsApp", valor: CONTACTO.telefono, href: CONTACTO.whatsapp },
    { Icono: Clock, titulo: "Horario", valor: CONTACTO.horario, href: undefined },
  ];

  return (
    <section id="soporte" className="w-full bg-surface-subtle px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#3563E9]">Soporte</div>
          <h2 className="mb-3 font-display text-3xl font-black tracking-tight text-text-main md:text-[40px]">
            ¿Dudas con tu contrato?
          </h2>
          <p className="text-lg text-text-muted">Respondemos en {SOPORTE_RESPUESTA}.</p>
        </div>

        <Reveal className="grid gap-4 md:grid-cols-3">
          {datos.map(({ Icono, titulo, valor, href }) => {
            const contenido = (
              <>
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3563E9]">
                  <Icono className="size-5" />
                </span>
                <span className="block text-sm font-semibold text-text-muted">{titulo}</span>
                <span className="mt-1 block text-lg font-bold text-text-main">{valor}</span>
              </>
            );
            const clases = "block rounded-2xl border border-border-layout bg-white p-6";
            return href ? (
              <a key={titulo} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`${clases} transition-all hover:-translate-y-0.5 hover:border-[#3563E9]/40 hover:shadow-lg hover:shadow-blue-900/5`}>
                {contenido}
              </a>
            ) : (
              <div key={titulo} className={clases}>{contenido}</div>
            );
          })}
        </Reveal>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={CONTACTO.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#3563E9] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#2951CB]"
          >
            <MessageCircle className="size-5" /> Escribir por WhatsApp
          </a>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 font-semibold text-text-main transition-colors hover:bg-slate-50"
          >
            Enviar un mensaje <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
