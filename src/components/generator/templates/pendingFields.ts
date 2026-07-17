export const PENDING_LINE = '______________________________';

export function pendingText(value: string | undefined, pending: boolean | undefined, fallback = PENDING_LINE) {
  return pending ? PENDING_LINE : value || fallback;
}

export function pendingIneText(value: string | undefined, pending: boolean | undefined) {
  return pending ? `Clave de elector: ${PENDING_LINE}` : value || '';
}
