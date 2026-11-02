import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenCutoff, tokenFreshFilter, TOKEN_TTL_DAYS, isTokenFresh } from './token.ts';

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

test('isTokenFresh usa la fecha de emisión y, sin ella, la del pago', () => {
  const now = Date.UTC(2026, 10, 1);
  assert.equal(isTokenFresh('2026-10-30T00:00:00.000Z', '2026-01-01T00:00:00.000Z', now), true);
  assert.equal(isTokenFresh('2026-05-01T00:00:00.000Z', '2026-10-30T00:00:00.000Z', now), false);
  assert.equal(isTokenFresh(null, '2026-10-30T00:00:00.000Z', now), true);
  assert.equal(isTokenFresh(null, '2026-05-01T00:00:00.000Z', now), false);
  assert.equal(isTokenFresh(null, null, now), false);
});
