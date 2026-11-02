import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sha256, buildPurchaseEvent } from './metaCapi.ts';

test('sha256 normaliza espacios y mayúsculas antes de hashear', () => {
  const esperado = createHash('sha256').update('test@example.com').digest('hex');
  assert.equal(sha256('  Test@Example.COM '), esperado);
});

test('el Purchase usa el folio como event_id, los centavos como pesos y marca el producto', () => {
  const e = buildPurchaseEvent({
    folio: 'NL-12345',
    amountCentavos: 49900,
    email: 'Dueño@Correo.com',
    eventTime: 1790000000,
    sourceUrl: 'https://contratos.renters.mx/contrato',
    context: { ip: '1.2.3.4', ua: 'Mozilla/5.0', fbp: 'fb.1.1.2', fbc: 'fb.1.1.AbC' },
  });
  assert.equal(e.event_name, 'Purchase');
  assert.equal(e.event_id, 'NL-12345');
  assert.equal(e.action_source, 'website');
  assert.equal(e.event_time, 1790000000);
  assert.deepEqual(e.custom_data, {
    currency: 'MXN',
    value: 499,
    content_name: 'Contrato de arrendamiento',
    content_type: 'product',
  });
  assert.deepEqual(e.user_data, {
    em: [sha256('Dueño@Correo.com')],
    client_ip_address: '1.2.3.4',
    client_user_agent: 'Mozilla/5.0',
    fbp: 'fb.1.1.2',
    fbc: 'fb.1.1.AbC',
  });
});

test('sin correo ni contexto el user_data queda vacío, no con campos undefined', () => {
  const e = buildPurchaseEvent({
    folio: 'X-1', amountCentavos: null, eventTime: 1, sourceUrl: 'https://x', context: null,
  });
  assert.deepEqual(e.user_data, {});
  assert.equal(e.custom_data.value, 0);
});
