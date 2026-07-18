"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Phone } from "@/components/shared/Phone";
import { BackgroundBlobs } from "@/components/shared/BackgroundBlobs";

const BRAND = "#4D6BFE";

type Step = {
  n: string;
  title: string;
  desc: string;
  bullets: string[];
  image: string;
  alt: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Elige tu estado",
    desc: "Selecciona dónde está la propiedad y cargamos la plantilla legal correcta — Nuevo León, Jalisco, Querétaro, Mérida o San Luis Potosí.",
    bullets: ["Motor legal por estado", "Redactado por abogados"],
    image: "/images/como-funciona/paso-1.png",
    alt: "Selector de estado en el generador de contrato",
  },
  {
    n: "02",
    title: "Llena el formulario, sin tecnicismos",
    desc: "Preguntas claras: propiedad, arrendador, inquilino y términos. ¿No tienes la INE o CLABE a la mano? Márcalo pendiente y complétalo antes de firmar.",
    bullets: ["Preguntas en lenguaje simple", "INE y datos bancarios opcionales"],
    image: "/images/como-funciona/paso-2.png",
    alt: "Formulario de datos del arrendador",
  },
  {
    n: "03",
    title: "Revisa tu contrato armado",
    desc: "Ves el resumen completo con tus datos exactos antes de pagar. Sin sorpresas: lo que revisas es lo que recibes.",
    bullets: ["Resumen claro antes de pagar", "Cláusulas del código civil de tu estado"],
    image: "/images/como-funciona/paso-3.png",
    alt: "Resumen del contrato antes de pagar",
  },
  {
    n: "04",
    title: "Paga seguro y recibe tu PDF",
    desc: "Un solo pago de $499 MXN con Stripe, sin suscripción. Tu contrato en PDF llega al instante a tu correo, listo para imprimir y firmar.",
    bullets: ["Pago único, sin cargos ocultos", "PDF al instante en tu correo"],
    image: "/images/como-funciona/paso-4.png",
    alt: "Checkout seguro de $499 MXN con Stripe",
  },
];

const N = STEPS.length;

// Opacidad de crossfade para la banda `index` a lo largo del scroll (0→1):
// meseta de 1 en el centro de su banda, fade lineal cerca de los bordes.
function useBandOpacity(progress: MotionValue<number>, index: number) {
  const band = 1 / N;
  const center = (index + 0.5) * band;
  const half = band / 2;
  const fade = band * 0.28;
  const isFirst = index === 0;
  const isLast = index === N - 1;

  return useTransform(progress, (v) => {
    if (isFirst && v <= center) return 1;
    if (isLast && v >= center) return 1;
    const dist = Math.abs(v - center);
    if (dist <= half - fade) return 1;
    if (dist >= half) return 0;
    return 1 - (dist - (half - fade)) / fade;
  });
}

/* ---------- Desktop: teléfono sticky + crossfade + barra ---------- */

function DesktopImage({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useBandOpacity(progress, index);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <Image
        src={step.image}
        alt={step.alt}
        width={390}
        height={844}
        className="h-full w-full object-cover object-top"
        sizes="300px"
        priority={index === 0}
      />
    </motion.div>
  );
}

function DesktopText({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useBandOpacity(progress, index);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center">
      <div className="max-w-md">
        <span
          className="mb-5 inline-block rounded-full px-3 py-1 text-[13px] font-black tracking-wider"
          style={{ backgroundColor: `${BRAND}14`, color: BRAND }}
        >
          PASO {step.n}
        </span>
        <h3 className="mb-4 font-display text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-[38px]">
          {step.title}
        </h3>
        <p className="mb-6 text-[18px] leading-relaxed text-slate-600">{step.desc}</p>
        <ul className="space-y-3">
          {step.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: BRAND }}
              />
              <span className="font-medium text-slate-700">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function DesktopScrolly() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [4, -4]);

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${N * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <BackgroundBlobs progress={scrollYProgress} />
        <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center gap-12 px-8">
          {/* Texto (crossfade, altura fija) */}
          <div className="relative h-[440px]">
            {STEPS.map((s, i) => (
              <DesktopText key={s.n} step={s} index={i} progress={scrollYProgress} />
            ))}
          </div>

          {/* Barra de progreso vertical */}
          <div className="relative h-[440px] w-1 rounded-full bg-slate-200">
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top rounded-full"
              style={{ backgroundColor: BRAND, scaleY: scrollYProgress }}
            />
          </div>

          {/* Teléfono con pantallazos en crossfade, leve tilt 3D atado al scroll */}
          <div className="flex w-full justify-center" style={{ perspective: 1200 }}>
            <motion.div className="w-full max-w-[300px]" style={{ rotateY, rotateX }}>
              <Phone>
                {STEPS.map((s, i) => (
                  <DesktopImage key={s.n} step={s} index={i} progress={scrollYProgress} />
                ))}
              </Phone>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Móvil / reduced-motion: apilado ---------- */

function StackedStep({ step, animate }: { step: Step; animate: boolean }) {
  const inner = (
    <>
      <div className="flex justify-center">
        <Phone>
          <Image
            src={step.image}
            alt={step.alt}
            width={390}
            height={844}
            className="h-full w-full object-cover object-top"
            sizes="260px"
          />
        </Phone>
      </div>
      <div className="mx-auto mt-8 max-w-md text-center">
        <span
          className="mb-4 inline-block rounded-full px-3 py-1 text-[12px] font-black tracking-wider"
          style={{ backgroundColor: `${BRAND}14`, color: BRAND }}
        >
          PASO {step.n}
        </span>
        <h3 className="mb-3 font-display text-2xl font-black leading-tight tracking-tight text-slate-900">
          {step.title}
        </h3>
        <p className="text-[16px] leading-relaxed text-slate-600">{step.desc}</p>
      </div>
    </>
  );

  if (!animate) return <div className="py-10">{inner}</div>;

  return (
    <motion.div
      className="py-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {inner}
    </motion.div>
  );
}

function Stacked({ animate, hideOnDesktop }: { animate: boolean; hideOnDesktop: boolean }) {
  return (
    <div className={`${hideOnDesktop ? "lg:hidden " : ""}px-6`}>
      <div className="mx-auto max-w-md">
        {STEPS.map((s) => (
          <StackedStep key={s.n} step={s} animate={animate} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Sección ---------- */

export function ProcessScrollytelling() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="w-full bg-[#f8f9fa] py-20 md:py-28">
      <div className="mx-auto mb-6 max-w-[1180px] px-6 text-center lg:px-8 lg:text-left">
        <span
          className="inline-block rounded-full px-3 py-1 text-[13px] font-black tracking-wider"
          style={{ backgroundColor: `${BRAND}14`, color: BRAND }}
        >
          EL PROCESO
        </span>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-[44px] lg:mx-0">
          De formulario a contrato firmable, sin abogados de por medio
        </h2>
      </div>

      {prefersReduced ? (
        <Stacked animate={false} hideOnDesktop={false} />
      ) : (
        <>
          <DesktopScrolly />
          <Stacked animate hideOnDesktop />
        </>
      )}
    </section>
  );
}
