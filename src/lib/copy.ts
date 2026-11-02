// Textos que se repiten en varias páginas. Sin imports: el test corre con node.
// COPY.autoria requiere aprobación del abogado (compuerta G1 de docs/copy/brief-y-registro.md).
// Si no se aprueba, cambiar SOLO esa línea por 'Plantilla basada en el Código Civil de tu estado'.
export const COPY = {
  autoria: 'Plantilla diseñada por abogados especialistas en temas inmobiliarios',
  insignias: ['Basado en el Código Civil de tu estado', 'Plantilla de abogados especialistas'],
  soloContrato: 'Este contrato es para quien solo necesita el documento.',
  polizaNota:
    'En Nuevo León también ofrecemos póliza jurídica: todos sus paquetes incluyen un contrato personalizado, hecho por los mismos abogados y con la misma lógica que el contrato digital.',
  polizaEnlace: { label: 'Ver póliza jurídica', href: 'https://www.renters.mx/paquetes' },
  diferencia:
    'El contrato en línea es una plantilla digital diseñada por abogados especialistas en temas inmobiliarios, para quien solo necesita el documento. En Nuevo León, la póliza jurídica incluye un contrato personalizado hecho por los mismos abogados, con la misma lógica, además de los servicios de tu paquete. En el resto de los estados ofrecemos solo contratos.',
} as const;
