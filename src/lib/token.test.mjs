import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenCutoff, tokenFreshFilter, TOKEN_TTL_DAYS } from './token.ts';

test('el corte es 90 días antes de la fecha dada', () => {
  const now = Date.UTC(2026, 10, 1);
  assert.equal(TOKEN_TTL_DAYS, 90);
  assert.equal(tokenCutoff(now), '2026-08-03T00:00:00.000Z');
});

test('el filtro acepta token emitido reciente o fila sin emisión pagada reciente', () => {
  assert.equal(
    tokenFreshFilter('2026-08-03T00:00:00.000Z'),
    'pdf_token_issued_at.gte.2026-08-03T00:00:00.000Z,and(pdf_token_issued_at.is.null,paid_at.gte.2026-08-03T00:00:00.000Z)',
  );
});
