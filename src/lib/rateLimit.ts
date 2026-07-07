// Rate limiting en memoria por IP. Suficiente para una instancia serverless
// (el mapa se resetea en cold start, pero acota ráfagas dentro de una instancia).
const buckets = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function checkRateLimit(
  bucket: string,
  ip: string,
  limit: number,
  windowMs: number
): boolean {
  let ipMap = buckets.get(bucket);
  if (!ipMap) {
    ipMap = new Map();
    buckets.set(bucket, ipMap);
  }

  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
