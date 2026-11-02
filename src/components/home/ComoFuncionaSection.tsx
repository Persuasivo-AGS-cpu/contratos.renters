"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Phone } from "@/components/shared/Phone";
import { Reveal } from "@/components/shared/Reveal";
import { getAvailableStatesList } from "@/lib/states";

const PASOS = [
  {
    titulo: "Elige tu estado",
    texto: `Selecciona dónde está la propiedad y cargamos la plantilla que corresponde: ${getAvailableStatesList()}.`,
    imagen: "/images/como-funciona/paso-1.png",
    alt: "Selector de estado en el generador de contrato",
  },
  {
    titulo: "Llena el formulario, sin tecnicismos",
    texto: "Preguntas claras sobre la propiedad, el arrendador, el inquilino y los términos. ¿No tienes la INE o la CLABE a la mano? Márcalo pendiente y complétalo antes de firmar.",
    imagen: "/images/como-funciona/paso-2.png",
    alt: "Formulario de datos del arrendador",
  },
  {
    titulo: "Revisa tu contrato armado",
    texto: "Ves el resumen completo con tus datos exactos antes de pagar. Lo que revisas es lo que recibes.",
    imagen: "/images/como-funciona/paso-3.png",
    alt: "Resumen del contrato antes de pagar",
  },
  {
    titulo: "Paga y recibe tu PDF",
    texto: "Un solo pago de $499 MXN con Stripe, sin suscripción. El PDF llega a tu correo, listo para imprimir y firmar.",
    imagen: "/images/como-funciona/paso-4.png",
    alt: "Pago seguro de $499 MXN con Stripe",
  },
];

export function ComoFuncionaSection() {
  const [activo, setActivo] = useState(0);

  return (
    <section id="como" className="w-full bg-surface-subtle px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#3563E9]">Cómo funciona</div>
          <h2 className="mb-4 font-display text-3xl font-black tracking-tight text-text-main md:text-5xl">
            Cuatro pasos, sin tecnicismos
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-muted">
            Tú marcas el ritmo. Revisas todo antes de pagar y no hay suscripción.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <ol className="space-y-3">
              {PASOS.map((p, i) => (
                <li key={p.titulo}>
                  <button
                    type="button"
                    onClick={() => setActivo(i)}
                    aria-current={i === activo ? "step" : undefined}
                    className={`flex w-full gap-5 rounded-2xl border p-6 text-left transition-all ${
                      i === activo
                        ? "border-[#3563E9]/40 bg-white shadow-xl shadow-blue-900/5"
                        : "border-transparent hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`flex size-10 flex-none items-center justify-center rounded-full text-sm font-bold ${
                        i === activo ? "bg-[#3563E9] text-white" : "bg-[#EEF2FF] text-[#3563E9]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-text-main">{p.titulo}</span>
                      <span className="mt-1 block leading-relaxed text-text-muted">{p.texto}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <Link
              href="/contrato"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3563E9] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2951CB]"
            >
              Generar contrato <ArrowRight className="size-5" />
            </Link>
          </Reveal>

          <div className="hidden justify-center lg:flex">
            <div className="w-full max-w-[300px]">
              <Phone>
                <div className="relative h-full w-full">
                  {PASOS.map((p, i) => (
                    <Image
                      key={p.imagen}
                      src={p.imagen}
                      alt={p.alt}
                      width={390}
                      height={844}
                      sizes="300px"
                      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
                        i === activo ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </Phone>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
