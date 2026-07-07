import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://contratos.renters.mx';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/imprimir', '/sandbox', '/success', '/mis-contratos'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
