import test from 'node:test';
import assert from 'node:assert/strict';
import { ENLACE_VIGENCIA_DIAS } from './compra.ts';
import { TOKEN_TTL_DAYS } from './token.ts';
import { inventoryLabel, INVENTORY_LABELS } from './inventory.ts';

test('la vigencia que se promete es la real del enlace', () => {
  assert.equal(ENLACE_VIGENCIA_DIAS, TOKEN_TTL_DAYS);
});

test('inventario: los artículos de los generadores tienen nombre legible', () => {
  const claves = ['sofas', 'cama_individual', 'cama_matrimonial', 'comedor', 'refrigerador', 'microondas', 'estufa', 'lavadora', 'abanicos', 'climas', 'boiler', 'tv'];
  for (const k of claves) assert.ok(INVENTORY_LABELS[k], k);
  assert.equal(inventoryLabel('cama_matrimonial'), 'Cama matrimonial');
});

test('inventario: una clave desconocida no se imprime con guiones bajos', () => {
  assert.equal(inventoryLabel('mesa_de_centro'), 'Mesa de centro');
});
