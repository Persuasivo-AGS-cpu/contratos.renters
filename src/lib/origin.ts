// Compara orígenes exactos. `startsWith` dejaba pasar
// https://contratos.renters.mx.evil.com.
function originOf(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isOriginAllowed(raw: string | null, allowed: string[]): boolean {
  if (!raw) return true; // sin cabecera: curl o servidor a servidor
  const origin = originOf(raw);
  if (!origin) return false;
  // Una entrada inválida en la lista (p. ej. una variable de entorno mal escrita)
  // se ignora: no debe bloquear al resto.
  return allowed.some((a) => originOf(a) === origin);
}
