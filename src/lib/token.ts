// Vigencia del enlace al contrato/PDF, contada desde que se emitió el token
// (pdf_token_issued_at) o, si la fila es anterior a esa columna, desde el pago.
export const TOKEN_TTL_DAYS = 90;

export function tokenCutoff(now = Date.now()): string {
  return new Date(now - TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

// Filtro para PostgREST `.or()`: token emitido después del corte, o sin fecha de
// emisión y pagado después del corte.
export function tokenFreshFilter(cutoff: string): string {
  return `pdf_token_issued_at.gte.${cutoff},and(pdf_token_issued_at.is.null,paid_at.gte.${cutoff})`;
}
