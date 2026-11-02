import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACTO } from './contactInfo.ts';

test('el enlace de WhatsApp usa el mismo número que el teléfono visible', () => {
  const digitos = CONTACTO.telefono.replace(/\D/g, '');
  assert.equal(CONTACTO.whatsapp, `https://wa.me/${digitos}`);
});

test('el correo tiene forma válida', () => {
  assert.match(CONTACTO.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
});
