// Tracking de eventos hacia GA4 y Meta Pixel. No-op si no están cargados.

type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
  window.fbq?.('trackCustom', name, params);
}

// Eventos estándar del funnel — nombres compatibles con GA4 ecommerce y
// eventos estándar de Meta (mejor optimización de pauta que eventos custom).
export function trackGeneratorStep(step: number, state?: string) {
  trackEvent('generator_step', { step, state });
}

export function trackBeginCheckout(state: string, plan: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'begin_checkout', {
    currency: 'MXN', value: 499, items: [{ item_name: plan, item_category: state }],
  });
  window.fbq?.('track', 'InitiateCheckout', { currency: 'MXN', value: 499 });
}

export function trackPurchase(folio: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'purchase', {
    transaction_id: folio, currency: 'MXN', value: 499,
  });
  window.fbq?.('track', 'Purchase', { currency: 'MXN', value: 499 });
}
