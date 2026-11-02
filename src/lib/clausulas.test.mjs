import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { CLAUSULAS } from './clausulas.ts';

const dir = new URL('../components/generator/templates/', import.meta.url);
const plantillas = readdirSync(dir).filter((f) => f.endsWith('Template.tsx') && f !== 'getStateTemplate.tsx');

test('hay una plantilla por estado y 10 cláusulas', () => {
  assert.equal(plantillas.length, 6);
  assert.equal(CLAUSULAS.length, 10);
});

test('cada plantilla trae todas las cláusulas que se prometen en la pantalla de pago', () => {
  for (const f of plantillas) {
    const fuente = readFileSync(new URL(f, dir), 'utf8');
    for (const c of CLAUSULAS) {
      assert.ok(fuente.includes(c.titulo), `${f} no contiene "${c.titulo}"`);
    }
  }
});

test('las plantillas ya no imprimen claves internas del inventario', () => {
  for (const f of plantillas) {
    assert.ok(!readFileSync(new URL(f, dir), 'utf8').includes('labelMap'), f);
  }
});
