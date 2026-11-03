// Datos de contacto visibles. hola@renters.mx es el correo oficial para toda comunicación (confirmado por Abraham, 2026-11-02);
// el horario sigue provisional. El formulario (src/app/api/contact/route.ts) y el Reply-To de los correos de compra
// (src/lib/email.ts) ya usan el mismo correo.
export const CONTACTO = {
  email: 'hola@renters.mx',
  telefono: '+52 81 1061 0111',
  whatsapp: 'https://wa.me/528110610111',
  horario: 'Lunes a viernes · 9:00 a 18:00',
} as const;
