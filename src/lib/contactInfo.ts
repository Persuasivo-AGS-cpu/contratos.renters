// Datos de contacto visibles. Correo oficial de soporte confirmado por Abraham (2026-11-02); el horario sigue provisional.
// OJO: el destino del formulario (src/app/api/contact/route.ts) y el Reply-To de los correos de compra (src/lib/email.ts)
// siguen siendo hola@renters.mx; no se cambian sin confirmar que contacto@ es un buzón activo.
export const CONTACTO = {
  email: 'contacto@renters.mx',
  telefono: '+52 81 1061 0111',
  whatsapp: 'https://wa.me/528110610111',
  horario: 'Lunes a viernes · 9:00 a 18:00',
} as const;
