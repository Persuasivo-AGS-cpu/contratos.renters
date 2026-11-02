import type { Attribution } from './attribution';

const SIN_DATO = 'directo / sin dato';

// Etiqueta legible del origen de un contrato o lead, a partir del JSON `attribution`
// que guarda el checkout (ver attribution.ts). Prioridad: utm > fbclid > gclid > referrer.
export function sourceLabel(a: Attribution | null | undefined): string {
  if (!a) return SIN_DATO;

  let base: string;
  if (a.utm_source) base = a.utm_medium ? `${a.utm_source} / ${a.utm_medium}` : a.utm_source;
  else if (a.fbclid) base = 'facebook';
  else if (a.gclid) base = 'google';
  else if (a.referrer) base = a.referrer;
  else base = SIN_DATO;

  // Origen previo en www.renters.mx (anuncio o broker): sin esto una venta que
  // empezó en un anuncio se vería solo como "renters.mx / nav".
  const previo = a.ref_campaign || a.ref_src;
  return previo ? `${base} ← ${previo}` : base;
}

export function summarizeSources(
  rows: { attribution?: Attribution | null }[],
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const label = sourceLabel(row.attribution);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
