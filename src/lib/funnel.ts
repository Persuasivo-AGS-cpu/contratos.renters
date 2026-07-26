// Medición de drop-off del generador. Un id anónimo por navegador (localStorage)
// identifica la sesión sin datos personales.

import { getAbVariant } from './abVariant';

const SID_KEY = 'renters_funnel_sid';

function getFunnelSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    let sid = localStorage.getItem(SID_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return null;
  }
}

// Fire-and-forget: nunca debe romper ni frenar el generador.
export function trackFunnelStep(step: number, estado?: string) {
  const session_id = getFunnelSessionId();
  if (!session_id) return;
  fetch('/api/track-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, step, estado: estado || null, variant: getAbVariant() }),
    keepalive: true,
  }).catch(() => {});
}
