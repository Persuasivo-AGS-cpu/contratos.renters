import { CORRECCION_GRATIS_HORAS, ENLACE_VIGENCIA_DIAS } from "@/lib/compra";
import { getAvailableStatesList } from "@/lib/states";
import { DudasAccordion, type Duda } from "./DudasAccordion";

const DUDAS: Duda[] = [
  {
    q: "¿Cuánto tarda?",
    a: "Tú marcas el ritmo: son preguntas sobre la propiedad, el arrendador, el inquilino y los términos, y puedes dejar pendientes la INE y la CLABE. Al pagar, el PDF te llega por correo.",
  },
  {
    q: "¿Para qué estados está disponible?",
    a: `Disponible en ${getAvailableStatesList()}. Ciudad de México y Estado de México: próximamente.`,
  },
  {
    q: "¿Cómo pago?",
    a: "Con tarjeta de crédito o débito, procesada por Stripe. Es un solo pago de $499 MXN, IVA incluido, sin suscripción.",
  },
  {
    q: "¿Puedo corregir datos después de comprar?",
    a: `Sí, sin costo durante las primeras ${CORRECCION_GRATIS_HORAS} horas. Responde al correo con tu contrato y lo ajustamos.`,
  },
  {
    q: "¿Qué recibo y por cuánto tiempo puedo descargarlo?",
    a: `Un PDF por correo, con un enlace de descarga que dura ${ENLACE_VIGENCIA_DIAS} días. Si lo necesitas de nuevo, puedes pedir que te reenviemos el enlace.`,
    accion: { label: "Reenviar mi enlace", href: "/reenviar-enlace" },
  },
];

export function DudasRapidasSection() {
  return (
    <section id="dudas" className="w-full bg-surface-clean px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#3563E9]">Dudas rápidas</div>
          <h2 className="mb-3 font-display text-3xl font-black tracking-tight text-text-main md:text-[40px]">
            Lo que más preguntan antes de comprar
          </h2>
        </div>
        <DudasAccordion items={DUDAS} />
        <p className="mt-8 text-center">
          <a
            href="https://www.renters.mx/preguntas-frecuentes?tema=contratos"
            className="font-semibold text-[#3563E9] hover:underline"
          >
            Ver todas las preguntas →
          </a>
        </p>
      </div>
    </section>
  );
}
