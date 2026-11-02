import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sha256, buildPurchaseEvent, sendTestPurchase, TEST_EVENT_CODE_RE } from './metaCapi.ts';

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

test('el código de prueba debe parecerse al de Meta', () => {
  for (const ok of ['TEST12345', 'test98765']) assert.ok(TEST_EVENT_CODE_RE.test(ok), ok);
  for (const mal of ['', '12345', 'TEST', 'PRODUCCION', 'TEST 123', 'TEST12345; DROP']) assert.ok(!TEST_EVENT_CODE_RE.test(mal), mal);
});

test('sendTestPurchase no llama a Meta sin un código de prueba válido', async () => {
  const original = globalThis.fetch;
  let llamadas = 0;
  globalThis.fetch = async () => { llamadas++; return new Response('{}'); };
  try {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = '123';
    process.env.META_CAPI_ACCESS_TOKEN = 'secreto';
    const r = await sendTestPurchase('');
    assert.equal(r.ok, false);
    assert.equal(llamadas, 0);
  } finally {
    globalThis.fetch = original;
  }
});

test('sendTestPurchase manda el código de prueba y el token va en el cuerpo, no en la URL', async () => {
  const original = globalThis.fetch;
  let url = '';
  let body = null;
  globalThis.fetch = async (u, init) => {
    url = String(u);
    body = JSON.parse(init.body);
    return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
  };
  try {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = '123';
    process.env.META_CAPI_ACCESS_TOKEN = 'secreto';
    const r = await sendTestPurchase(' TEST12345 ');
    assert.equal(r.ok, true);
    assert.equal(body.test_event_code, 'TEST12345');
    assert.equal(body.data[0].event_name, 'Purchase');
    assert.match(body.data[0].event_id, /^PRUEBA-CAPI-/);
    // Sin datos de usuario Meta responde 400 Invalid parameter.
    assert.ok(body.data[0].user_data.em?.length === 1);
    assert.ok(body.data[0].user_data.client_user_agent);
    assert.ok(!url.includes('secreto'));
    assert.ok(!r.mensaje.includes('secreto'));
  } finally {
    globalThis.fetch = original;
  }
});

test('sendTestPurchase reporta el error de Meta sin lanzar', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: { message: 'Token inválido', error_user_msg: 'Revisa el token', error_subcode: 33 } }), { status: 400 });
  try {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = '123';
    process.env.META_CAPI_ACCESS_TOKEN = 'secreto';
    const r = await sendTestPurchase('TEST12345');
    assert.equal(r.ok, false);
    assert.match(r.mensaje, /400.*Token inválido.*Revisa el token.*subcódigo 33/);
  } finally {
    globalThis.fetch = original;
  }
});
