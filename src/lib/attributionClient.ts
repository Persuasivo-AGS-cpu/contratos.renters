import { parseAttribution, sanitizeAttribution, cleanString, type Attribution } from './attribution';

const KEY = 'renters_attribution';
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

// Primer toque: si ya hay una atribución vigente no se sobrescribe.
export function captureAttribution(): void {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const { ts } = JSON.parse(raw) as { ts?: unknown };
      if (typeof ts === 'number' && Date.now() - ts < MAX_AGE_MS) return;
    }
    const found = parseAttribution({
      search: location.search,
      referrer: document.referrer,
      ownHost: location.hostname,
      landing: location.pathname,
    });
    if (found) localStorage.setItem(KEY, JSON.stringify({ a: found, ts: Date.now() }));
  } catch {
    // storage bloqueado o JSON dañado: sin atribución, pero nunca se rompe la página
  }
}

export function getAttribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return sanitizeAttribution((JSON.parse(raw) as { a?: unknown }).a);
  } catch {
    return null;
  }
}

// Cookies que escribe el Pixel de Meta; mejoran la coincidencia del evento de servidor.
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  const read = (name: string) =>
    cleanString(document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.slice(name.length + 1));
  return { fbp: read('_fbp'), fbc: read('_fbc') };
}
