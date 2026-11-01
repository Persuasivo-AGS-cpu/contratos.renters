// Reglas del reenvío del enlace al contrato. Puras para poder probarlas.

// Mínimo entre dos reenvíos del mismo contrato: evita llenar la bandeja del cliente.
export const REENVIO_COOLDOWN_MS = 5 * 60 * 1000;

type ContratoEmails = { arrendador_email: string | null; inquilino_email: string | null };

// Devuelve el correo (en minúsculas) a donde enviar si coincide con alguno de los
// dos del contrato; null si no coincide. Nunca se envía a un correo distinto.
export function matchedEmail(row: ContratoEmails, input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const wanted = input.trim().toLowerCase();
  if (!wanted) return null;
  for (const candidate of [row.arrendador_email, row.inquilino_email]) {
    if (candidate && candidate.trim().toLowerCase() === wanted) return wanted;
  }
  return null;
}

export function canReissue(issuedAt: string | null, now = Date.now()): boolean {
  if (!issuedAt) return true;
  return now - new Date(issuedAt).getTime() >= REENVIO_COOLDOWN_MS;
}
