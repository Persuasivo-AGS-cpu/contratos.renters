import test from 'node:test';
import assert from 'node:assert/strict';
import { isOriginAllowed } from './origin.ts';

const allowed = ['https://contratos.renters.mx', 'http://localhost:3000'];

test('acepta el origen exacto y rutas dentro de él (referer)', () => {
  assert.equal(isOriginAllowed('https://contratos.renters.mx', allowed), true);
  assert.equal(isOriginAllowed('https://contratos.renters.mx/contrato?x=1', allowed), true);
});

test('rechaza dominios que solo empiezan igual', () => {
  assert.equal(isOriginAllowed('https://contratos.renters.mx.evil.com', allowed), false);
  assert.equal(isOriginAllowed('https://contratos.renters.mxx', allowed), false);
});

test('rechaza otros orígenes y valores inválidos; sin cabecera pasa', () => {
  assert.equal(isOriginAllowed('https://evil.com', allowed), false);
  assert.equal(isOriginAllowed('no-es-url', allowed), false);
  assert.equal(isOriginAllowed(null, allowed), true);
});

test('una entrada inválida en la lista permitida no bloquea las demás', () => {
  assert.equal(isOriginAllowed('https://contratos.renters.mx', ['no-es-url', 'https://contratos.renters.mx']), true);
  assert.equal(isOriginAllowed('https://evil.com', ['no-es-url']), false);
});
