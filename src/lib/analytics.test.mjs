import test from 'node:test';
import assert from 'node:assert/strict';
import { trackUpsellClick } from './analytics.ts';

test('trackUpsellClick no falla sin window', () => {
  assert.doesNotThrow(() => trackUpsellClick('poliza-nl', 'NL-1'));
});

test('trackUpsellClick avisa a GA4 y al Pixel con destino y folio', () => {
  const llamadas = [];
  globalThis.window = {
    gtag: (...a) => llamadas.push(['gtag', ...a]),
    fbq: (...a) => llamadas.push(['fbq', ...a]),
  };
  try {
    trackUpsellClick('poliza-nl', 'NL-1');
  } finally {
    delete globalThis.window;
  }
  assert.deepEqual(llamadas, [
    ['gtag', 'event', 'select_promotion', { promotion_name: 'poliza-nl', transaction_id: 'NL-1' }],
    ['fbq', 'trackCustom', 'ClickUpsell', { destino: 'poliza-nl', content_name: 'Contrato de arrendamiento' }],
  ]);
});
