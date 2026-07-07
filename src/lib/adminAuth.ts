// Verificación de Basic Auth reutilizable. El proxy ya protege /admin/*,
// pero las Server Actions deben re-verificar por su cuenta (defensa en
// profundidad — un cambio de matcher en proxy no debe abrir mutaciones).
export function isAdminAuthorized(authHeader: string | null): boolean {
  if (!authHeader?.startsWith('Basic ')) return false;
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) return false;
  const [u, p] = Buffer.from(authHeader.slice(6), 'base64').toString().split(':');
  return u === user && p === pass;
}
