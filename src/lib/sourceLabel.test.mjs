import test from 'node:test';
import assert from 'node:assert/strict';
import { sourceLabel, summarizeSources } from './sourceLabel.ts';

test('sin atribución es directo / sin dato', () => {
  assert.equal(sourceLabel(null), 'directo / sin dato');
  assert.equal(sourceLabel(undefined), 'directo / sin dato');
  assert.equal(sourceLabel({}), 'directo / sin dato');
});

test('utm_source con medio', () => {
  assert.equal(sourceLabel({ utm_source: 'renters.mx', utm_medium: 'nav' }), 'renters.mx / nav');
  assert.equal(sourceLabel({ utm_source: 'newsletter' }), 'newsletter');
});

test('añade el origen previo en renters.mx (anuncio o broker)', () => {
  assert.equal(
    sourceLabel({ utm_source: 'renters.mx', utm_medium: 'home', ref_campaign: 'RTR-Brokers', ref_src: 'meta' }),
    'renters.mx / home ← RTR-Brokers',
  );
  assert.equal(sourceLabel({ utm_source: 'renters.mx', ref_src: 'meta' }), 'renters.mx ← meta');
});

test('sin utm usa los ids de clic y luego el referrer; utm manda sobre fbclid', () => {
  assert.equal(sourceLabel({ fbclid: 'abc' }), 'facebook');
  assert.equal(sourceLabel({ gclid: 'abc' }), 'google');
  assert.equal(sourceLabel({ referrer: 'www.google.com' }), 'www.google.com');
  assert.equal(sourceLabel({ utm_source: 'x', fbclid: 'abc' }), 'x');
});

test('summarizeSources cuenta y ordena de mayor a menor, con empate alfabético', () => {
  const rows = [
    { attribution: { utm_source: 'renters.mx', utm_medium: 'nav' } },
    { attribution: null },
    { attribution: { utm_source: 'renters.mx', utm_medium: 'nav' } },
    { attribution: { fbclid: 'z' } },
  ];
  assert.deepEqual(summarizeSources(rows), [
    { label: 'renters.mx / nav', count: 2 },
    { label: 'directo / sin dato', count: 1 },
    { label: 'facebook', count: 1 },
  ]);
  assert.deepEqual(summarizeSources([]), []);
});
