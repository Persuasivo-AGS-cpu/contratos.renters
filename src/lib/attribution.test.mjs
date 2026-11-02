import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAttribution, sanitizeAttribution, cleanString } from './attribution.ts';

const base = { search: '', referrer: '', ownHost: 'contratos.renters.mx', landing: '/' };

test('sin parámetros ni referrer externo no hay atribución', () => {
  assert.equal(parseAttribution(base), null);
});

test('captura utm, fbclid, referrer externo y landing', () => {
  const r = parseAttribution({
    ...base,
    search: '?utm_source=renters.mx&utm_medium=nav&utm_campaign=puerta-contratos&fbclid=AbC123',
    referrer: 'https://www.renters.mx/paquetes?x=1',
    landing: '/estado/jalisco',
  });
  assert.deepEqual(r, {
    utm_source: 'renters.mx',
    utm_medium: 'nav',
    utm_campaign: 'puerta-contratos',
    fbclid: 'AbC123',
    referrer: 'www.renters.mx',
    landing: '/estado/jalisco',
  });
});

test('conserva el origen previo en renters.mx (ref_*)', () => {
  const r = parseAttribution({
    ...base,
    search: '?utm_source=renters.mx&utm_medium=home&ref_src=meta&ref_campaign=RTR-Brokers&ref_content=V2&otro=1',
  });
  assert.equal(r.ref_src, 'meta');
  assert.equal(r.ref_campaign, 'RTR-Brokers');
  assert.equal(r.ref_content, 'V2');
  assert.equal(r.otro, undefined);
});

test('el referrer propio no cuenta', () => {
  assert.equal(
    parseAttribution({ ...base, referrer: 'https://contratos.renters.mx/contrato' }),
    null,
  );
});

test('un referrer externo solo ya es atribución, y guarda solo el host', () => {
  const r = parseAttribution({ ...base, referrer: 'https://www.google.com/search?q=contrato' });
  assert.deepEqual(r, { referrer: 'www.google.com', landing: '/' });
});

test('un referrer inválido se ignora sin lanzar', () => {
  assert.equal(parseAttribution({ ...base, referrer: 'no-es-url' }), null);
});

test('los valores se recortan a 200 caracteres', () => {
  const r = parseAttribution({ ...base, search: `?utm_source=${'a'.repeat(500)}` });
  assert.equal(r.utm_source.length, 200);
});

test('sanitizeAttribution descarta claves desconocidas y tipos no string', () => {
  assert.deepEqual(
    sanitizeAttribution({ utm_source: 'x', evil: 'y', gclid: 5, fbclid: '  ' }),
    { utm_source: 'x' },
  );
  assert.equal(sanitizeAttribution(null), null);
  assert.equal(sanitizeAttribution([]), null);
  assert.equal(sanitizeAttribution('texto'), null);
  assert.equal(sanitizeAttribution({}), null);
});

test('cleanString recorta y devuelve undefined si queda vacío', () => {
  assert.equal(cleanString('  hola '), 'hola');
  assert.equal(cleanString('   '), undefined);
  assert.equal(cleanString(3), undefined);
});
