import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTRATOS_MENU } from './contratosNav.ts';

test('los ids del menú son únicos', () => {
  const ids = CONTRATOS_MENU.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada item apunta a /#id', () => {
  for (const item of CONTRATOS_MENU) assert.equal(item.href, `/#${item.id}`);
});
