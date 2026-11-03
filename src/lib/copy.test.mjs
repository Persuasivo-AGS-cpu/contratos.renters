import test from 'node:test';
import assert from 'node:assert/strict';
import { COPY } from './copy.ts';
import { PROHIBIDAS } from './copyProhibido.ts';

const textos = [COPY.autoria, ...COPY.insignias, COPY.soloContrato, COPY.polizaNota, COPY.diferencia];

test('ningún texto central usa frases prohibidas', () => {
  for (const t of textos) for (const re of PROHIBIDAS) assert.doesNotMatch(t, re, `"${t}" coincide con ${re}`);
});

test('todo lo que habla de póliza dice Nuevo León', () => {
  assert.match(COPY.polizaNota, /Nuevo León/);
  assert.match(COPY.diferencia, /Nuevo León/);
});

test('la diferencia aclara que fuera de Nuevo León solo hay contratos', () => {
  assert.match(COPY.diferencia, /resto de los estados ofrecemos solo contratos/);
});
