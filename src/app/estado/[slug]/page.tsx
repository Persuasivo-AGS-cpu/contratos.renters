import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Scale, Zap, FileText, ShieldCheck } from 'lucide-react';
import { STATES, type StateId, getStateName, getLegalStateName } from '@/lib/states';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.entries(STATES)
    .filter(([, s]) => s.available)
    .map(([slug]) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = STATES[slug as StateId];
  if (!state?.available) return {};
  const name = state.name;
  return {
    title: `Contrato de Arrendamiento en ${name} | Renters`,
    description: `Genera tu contrato de arrendamiento para ${name} en menos de 10 minutos. Redactado por abogados conforme al Código Civil de ${state.legalName}. $499 MXN, listo para firmar.`,
    alternates: { canonical: `/estado/${slug}` },
  };
}

export default async function EstadoPage({ params }: PageProps) {
  const { slug } = await params;
  const state = STATES[slug as StateId];

  if (!state?.available) notFound();

  const name = getStateName(slug);
  const legalName = getLegalStateName(slug);

  const beneficios = [
    `Conforme al Código Civil de ${legalName} vigente`,
    'Redactado y revisado por abogados especializados en arrendamiento',
    'Cláusulas de protección incluidas: deudor solidario, fiador, penalidades',
    'Anexo de inventario si la propiedad está amueblada',
    'PDF profesional listo para imprimir y firmar',
    'Entrega inmediata por correo tras el pago',
  ];

  const faqs = [
    {
      q: `¿El contrato es válido en ${name}?`,
      a: `Sí. La plantilla está redactada conforme al Código Civil de ${legalName} y contiene las cláusulas obligatorias para que el contrato sea plenamente exigible ante los tribunales locales.`,
    },
    {
      q: '¿Cuánto cuesta y qué incluye?',
      a: 'Pago único de $499 MXN con IVA incluido. Incluye el contrato completo personalizado, anexo de inventario opcional, descarga en PDF y envío por correo al arrendador y al inquilino.',
    },
    {
      q: '¿Necesito abogado o notario?',
      a: 'No. El contrato de arrendamiento es válido con la firma de las partes. Las plantillas ya incluyen las cláusulas que un abogado redactaría.',
    },
  ];

  return (
    <div className="flex-1 w-full">
      {/* Hero */}
      <section className="w-full bg-white pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#1a56ff] uppercase tracking-wide mb-6">
            <Scale className="w-3.5 h-3.5" /> Código Civil de {legalName}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-gray-900 tracking-tight leading-tight mb-6">
            Contrato de Arrendamiento en <span className="text-[#1a56ff]">{name}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Genera tu contrato de renta personalizado y legalmente válido para {name} en menos de 10 minutos.
            Redactado por abogados, adaptado a la legislación local. $499 MXN, pago único.
          </p>
          <Link
            href={`/contrato?estado=${slug}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a56ff] hover:bg-[#003ee6] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            Generar mi contrato para {name} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Beneficios */}
      <section className="w-full bg-[#f8f9fa] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-black text-gray-900 text-center mb-10">
            Qué incluye tu contrato para {name}
          </h2>
          <ul className="space-y-4">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#e6f4ea] flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-[#0d944c]" strokeWidth={3} />
                </span>
                <span className="text-gray-700 font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cómo funciona (mini) */}
      <section className="w-full bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <FileText className="w-6 h-6 text-[#1a56ff]" />, t: '1. Llena el formulario', d: 'Datos de la propiedad, arrendador, inquilino y términos. ~6 minutos.' },
            { icon: <Zap className="w-6 h-6 text-[#1a56ff]" />, t: '2. Paga $499 MXN', d: 'Pago único y seguro con tarjeta vía Stripe. IVA incluido.' },
            { icon: <ShieldCheck className="w-6 h-6 text-[#1a56ff]" />, t: '3. Descarga tu PDF', d: 'Contrato listo para firmar, en tu correo al instante.' },
          ].map((s) => (
            <div key={s.t} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F0FE] flex items-center justify-center mb-4">{s.icon}</div>
              <h3 className="font-black text-gray-900 mb-2">{s.t}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[260px]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ local */}
      <section className="w-full bg-[#f8f9fa] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-black text-gray-900 text-center mb-10">
            Preguntas frecuentes — {name}
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full bg-white py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-black text-gray-900 mb-6">
          Tu contrato para {name}, listo hoy
        </h2>
        <Link
          href={`/contrato?estado=${slug}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a56ff] hover:bg-[#003ee6] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          Empezar ahora <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* JSON-LD: producto + FAQ para rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Product',
                name: `Contrato de Arrendamiento — ${name}`,
                description: `Contrato de arrendamiento conforme al Código Civil de ${legalName}, redactado por abogados.`,
                offers: {
                  '@type': 'Offer',
                  price: '499',
                  priceCurrency: 'MXN',
                  availability: 'https://schema.org/InStock',
                },
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
