import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export const PLAN_PRICES: Record<string, number> = {
  basico: 49900,       // $499 MXN en centavos
  proteccion: 89900,   // $899 MXN
  pack: 199900,        // $1,999 MXN
};

export const PLAN_NAMES: Record<string, string> = {
  basico: 'Contrato de Arrendamiento — Plan Básico',
  proteccion: 'Contrato + Póliza de Protección',
  pack: 'Pack Inmobiliario (5 Contratos)',
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
