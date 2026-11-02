import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDateEs } from './dates.ts';

test('formatDateEs escribe la fecha en español sin cambiar el día por zona horaria', () => {
  assert.equal(formatDateEs('2026-11-09'), '9 de noviembre de 2026');
  assert.equal(formatDateEs('2027-01-01'), '1 de enero de 2027');
  assert.equal(formatDateEs('2026-12-31'), '31 de diciembre de 2026');
});

test('formatDateEs devuelve igual lo que no es una fecha válida', () => {
  for (const x of ['', 'mañana', '2026-13-01', '2026-11-45', '09/11/2026']) assert.equal(formatDateEs(x), x);
});
