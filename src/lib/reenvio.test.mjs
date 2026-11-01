import test from 'node:test';
import assert from 'node:assert/strict';
import { matchedEmail, canReissue, REENVIO_COOLDOWN_MS } from './reenvio.ts';

const row = { arrendador_email: 'Dueño@Correo.com', inquilino_email: 'inq@correo.com' };

test('coincide con el correo del arrendador o del inquilino sin importar mayúsculas', () => {
  assert.equal(matchedEmail(row, '  dueño@correo.com '), 'dueño@correo.com');
  assert.equal(matchedEmail(row, 'INQ@correo.com'), 'inq@correo.com');
});

test('un correo ajeno, vacío o que no es texto no coincide', () => {
  assert.equal(matchedEmail(row, 'otro@correo.com'), null);
  assert.equal(matchedEmail(row, ''), null);
  assert.equal(matchedEmail(row, 42), null);
  assert.equal(matchedEmail({ arrendador_email: null, inquilino_email: null }, 'x@y.com'), null);
});

test('respeta el enfriamiento entre reenvíos', () => {
  const now = Date.UTC(2026, 10, 1, 12, 0, 0);
  assert.equal(canReissue(null, now), true);
  assert.equal(canReissue(new Date(now - REENVIO_COOLDOWN_MS + 1000).toISOString(), now), false);
  assert.equal(canReissue(new Date(now - REENVIO_COOLDOWN_MS).toISOString(), now), true);
});
