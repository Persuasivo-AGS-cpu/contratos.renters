// Frases que no deben aparecer en el copy del sitio (ver docs/copy/brief-y-registro.md).
// Cada una es una promesa absoluta o una afirmación sin sustento. Se prueban sin distinguir mayúsculas.
export const PROHIBIDAS: RegExp[] = [
  /legalmente\s+v[aá]lid/i,
  /v[aá]lid[oa]s?\s+ante/i,
  /plenamente\s+exigible/i,
  /redactad[oa]s?\s+(y\s+validad[oa]s?\s+)?por\s+abogados/i,
  /validad[oa]s?\s+por\s+abogados/i,
  /abogados\s+expertos/i,
  /protecci[oó]n\s+legal\s+certificada/i,
  /asegura\s+tu\s+patrimonio/i,
  /protege\s+tu\s+patrimonio/i,
  /sin\s+despachos/i,
  /te\s+blinda/i,
  /cobranza\s+y\s+desalojo\s+incluidos/i,
  /contrato\s+legal\b/i,
  /\bPDF\s+legal\b/i,
  /100\s?%\s+protegid/i,
  /es\s+v[aá]lido\s+con/i,
  /cl[aá]usulas\s+que\s+un\s+abogado/i,
  /~\s?\d+\s+minutos/i,
  /entrega\s+inmediata/i,
  /en\s+tu\s+correo\s+al\s+instante/i,
];
