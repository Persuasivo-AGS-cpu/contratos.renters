import test from 'node:test';
import assert from 'node:assert/strict';
import { isCronAuthorized } from './cronAuth.ts';

test('con el secreto correcto autoriza', () => {
  assert.equal(isCronAuthorized('Bearer abc', 'abc'), true);
});

test('con otro secreto o sin cabecera rechaza', () => {
  assert.equal(isCronAuthorized('Bearer otro', 'abc'), false);
  assert.equal(isCronAuthorized(null, 'abc'), false);
});

test('sin CRON_SECRET configurado rechaza incluso "Bearer undefined"', () => {
  assert.equal(isCronAuthorized('Bearer undefined', undefined), false);
  assert.equal(isCronAuthorized('Bearer ', ''), false);
});
