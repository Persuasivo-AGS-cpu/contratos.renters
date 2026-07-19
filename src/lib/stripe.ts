import Stripe from 'stripe';
import { getStateCode } from './states';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export const PLAN_PRICES: Record<string, number> = {
  basico: 49900,  // $499 MXN en centavos
};

export const PLAN_NAMES: Record<string, string> = {
  basico: 'Contrato de Arrendamiento — Plan Básico',
};

// Prefijo determinístico: CÓDIGO-AÑO-DDMM (fecha en horario de México). Folio
// final = prefijo + secuencia del día para ese estado (ej. COAH-2026-1807-1,
// el segundo contrato de Coahuila ese mismo día sería COAH-2026-1807-2).
export function getFolioPrefix(estado: string): string {
  const code = getStateCode(estado);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return `${code}-${parts.year}-${parts.day}${parts.month}`;
}

export function generateFolio(estado: string, seq: number): string {
  return `${getFolioPrefix(estado)}-${seq}`;
}
