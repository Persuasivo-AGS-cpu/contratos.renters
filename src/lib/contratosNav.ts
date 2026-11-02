// Submenú de "Contratos". Cada id debe existir como id="..." en una sección de src/components/home
// (contratosNav.test.mjs lo comprueba). Sin imports: el test corre con node, sin alias de Next.
export const CONTRATOS_MENU = [
  { id: 'resumen', label: 'Resumen de contratos', description: 'Contrato personalizado por estado, desde $499', href: '/#resumen' },
  { id: 'como', label: 'Cómo funciona', description: 'Llenas tus datos y descargas el PDF para firmar', href: '/#como' },
  { id: 'estados', label: 'Estados', description: 'Dónde está disponible hoy', href: '/#estados' },
  { id: 'precio', label: 'Precio', description: '$499 MXN, IVA incluido', href: '/#precio' },
  { id: 'dudas', label: 'Dudas rápidas', description: 'Lo que más preguntan antes de comprar', href: '/#dudas' },
  { id: 'soporte', label: 'Soporte', description: 'WhatsApp y correo, de lunes a viernes', href: '/#soporte' },
] as const;

export type ContratosMenuId = (typeof CONTRATOS_MENU)[number]['id'];
