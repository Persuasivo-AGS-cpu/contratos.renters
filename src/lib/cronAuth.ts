// Falla cerrado: sin CRON_SECRET configurado nadie se autentica (antes, la
// cabecera `Bearer undefined` pasaba).
export function isCronAuthorized(authHeader: string | null, secret: string | undefined): boolean {
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}
