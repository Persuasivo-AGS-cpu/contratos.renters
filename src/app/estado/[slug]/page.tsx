export default function StatePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex-1 py-20 px-6 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-display font-bold mb-4 capitalize">
        Contrato de Arrendamiento en {params.slug.replace('-', ' ')}
      </h1>
      <p className="text-text-muted text-lg">
        Plantilla dinámicamente optimizada para SEO. Aquí se inyectarán las condiciones legales del estado de {params.slug.replace('-', ' ')}.
      </p>
    </div>
  );
}
