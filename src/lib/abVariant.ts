// Lee la cookie ab_variant que pone src/proxy.ts (httpOnly:false a propósito
// para esto). null mientras el test A/B esté apagado o fuera del experimento.
export function getAbVariant(): 'a' | 'b' | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )ab_variant=(a|b)(?:;|$)/);
  return match ? (match[1] as 'a' | 'b') : null;
}
