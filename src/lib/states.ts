// `name` = nombre comercial (lo que el usuario selecciona y ve en UI).
// `legalName` = entidad cuyo Código Civil aplica (solo difiere en Mérida → Yucatán).
export const STATES = {
  'nuevo-leon': { name: 'Nuevo León', legalName: 'Nuevo León', code: 'NL', available: true },
  jalisco: { name: 'Jalisco', legalName: 'Jalisco', code: 'JAL', available: true },
  queretaro: { name: 'Querétaro', legalName: 'Querétaro', code: 'QRO', available: true },
  merida: { name: 'Mérida', legalName: 'Yucatán', code: 'MER', available: true },
  'san-luis-potosi': { name: 'San Luis Potosí', legalName: 'San Luis Potosí', code: 'SLP', available: true },
  coahuila: { name: 'Coahuila de Zaragoza', legalName: 'Coahuila de Zaragoza', code: 'COAH', available: true },
  cdmx: { name: 'Ciudad de México', legalName: 'Ciudad de México', code: 'CDMX', available: false },
  edomex: { name: 'Estado de México', legalName: 'Estado de México', code: 'EDO', available: false },
} as const;

export type StateId = keyof typeof STATES;

// Nombre comercial — usar en UI/selección/emails.
export function getStateName(state: string): string {
  return STATES[state as StateId]?.name ?? '[ESTADO SELECCIONADO]';
}

// Entidad legal cuyo Código Civil aplica — usar en el texto del contrato.
export function getLegalStateName(state: string): string {
  return STATES[state as StateId]?.legalName ?? '[ESTADO SELECCIONADO]';
}

export function getStateCode(state: string): string {
  return STATES[state as StateId]?.code ?? 'XX';
}

// Estados disponibles como lista en prosa ("A, B, C y D") para copy/SEO/FAQ.
// Fuente única — al agregar un estado a STATES, todos los textos se actualizan.
export function getAvailableStatesList(): string {
  const names = Object.values(STATES)
    .filter((s) => s.available)
    .map((s) => s.name);
  return new Intl.ListFormat('es-MX', { style: 'long', type: 'conjunction' }).format(names);
}
