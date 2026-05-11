import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export const PLAN_PRICES: Record<string, number> = {
  basico: 49900,  // $499 MXN en centavos
};

export const PLAN_NAMES: Record<string, string> = {
  basico: 'Contrato de Arrendamiento — Plan Básico',
};

export function generateFolio(estado: string): string {
  const stateCode: Record<string, string> = {
    'nuevo-leon': 'NL',
    jalisco: 'JAL',
    cdmx: 'CDMX',
    edomex: 'EDO',
  };
  const code = stateCode[estado] || 'XX';
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${code}-${year}-${rand}`;
}
