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

test('la cláusula de fiador solo se imprime si se incluye fiador (la pantalla de pago cuenta una menos si no)', () => {
  assert.ok(CLAUSULAS.some((c) => c.titulo === 'FIADOR Y OBLIGADO SOLIDARIO'));
  for (const f of plantillas) {
    const fuente = readFileSync(new URL(f, dir), 'utf8');
    const i = fuente.indexOf('FIADOR Y OBLIGADO SOLIDARIO');
    assert.ok(fuente.slice(Math.max(0, i - 200), i).includes('guarantor.includes'), `${f}: el fiador ya no es condicional`);
  }
});
