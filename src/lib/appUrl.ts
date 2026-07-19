// URL base de la app. En producción, caer a localhost serviría enlaces muertos
// al cliente que ya pagó (success_url de Stripe, link de descarga de PDF) — mejor
// fallar ruidosamente que entregar una URL rota. En dev sí cae a localhost.
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_APP_URL no está definida en producción');
  }
  return 'http://localhost:3000';
}
