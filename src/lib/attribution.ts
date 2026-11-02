// Atribución de primer toque: utm, ids de clic, referrer externo y el origen previo
// en www.renters.mx (ref_*, que manda la tarjeta de contratos).
// Sin imports de '@/' para poder probarse con `node --test`.

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref_src?: string;
  ref_campaign?: string;
  ref_content?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing?: string;
};

const KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'ref_src', 'ref_campaign', 'ref_content',
  'fbclid', 'gclid', 'referrer', 'landing',
] as const;

const MAX_LEN = 200;

export function cleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().slice(0, MAX_LEN);
  return trimmed || undefined;
}

// Se usa en el servidor sobre lo que manda el navegador: nunca se confía en el cliente.
export function sanitizeAttribution(input: unknown): Attribution | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of KEYS) {
    const value = cleanString(source[key]);
    if (value) out[key] = value;
  }
  return Object.keys(out).length ? out : null;
}

export function parseAttribution(opts: {
  search: string;
  referrer: string;
  ownHost: string;
  landing: string;
}): Attribution | null {
  const params = new URLSearchParams(opts.search);

  let referrer: string | undefined;
  try {
    const host = opts.referrer ? new URL(opts.referrer).hostname : '';
    if (host && host !== opts.ownHost) referrer = host; // solo el host: la ruta puede traer datos
  } catch {
    // referrer inválido: se ignora
  }

  const found = sanitizeAttribution({
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
    ref_src: params.get('ref_src'),
    ref_campaign: params.get('ref_campaign'),
    ref_content: params.get('ref_content'),
    fbclid: params.get('fbclid'),
    gclid: params.get('gclid'),
    referrer,
  });
  if (!found) return null; // visita directa: no hay nada que atribuir

  return sanitizeAttribution({ ...found, landing: opts.landing });
}
