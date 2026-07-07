import type { MetadataRoute } from 'next';
import { STATES } from '@/lib/states';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://contratos.renters.mx';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/contrato`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/como-funciona`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/preguntas-frecuentes`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contacto`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const statePages: MetadataRoute.Sitemap = Object.entries(STATES)
    .filter(([, s]) => s.available)
    .map(([id]) => ({
      url: `${BASE}/estado/${id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...statePages];
}
