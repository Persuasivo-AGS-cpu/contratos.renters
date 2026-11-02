import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { CONTRATOS_MENU } from './contratosNav.ts';

const DIR = 'src/components/home';
const fuentes = readdirSync(DIR)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => readFileSync(`${DIR}/${f}`, 'utf8'))
  .join('\n');

test('los ids del menú son únicos', () => {
  const ids = CONTRATOS_MENU.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada item apunta a /#id', () => {
  for (const item of CONTRATOS_MENU) assert.equal(item.href, `/#${item.id}`);
});

test('cada ancla del menú existe como id en una sección de la home', () => {
  for (const item of CONTRATOS_MENU) {
    assert.match(fuentes, new RegExp(`id="${item.id}"`), `falta id="${item.id}" en ${DIR}`);
  }
});
