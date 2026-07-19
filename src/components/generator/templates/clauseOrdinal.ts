// Ordinales en español para numerar cláusulas de forma dinámica. Las cláusulas
// posteriores a NOVENA (fiador, cláusulas adicionales, tribunales) son
// condicionales, así que su número real depende de cuáles estén presentes —
// numerarlas fijas produce duplicados como dos "DÉCIMA." en el mismo documento.
const ORDINALS = [
  'DÉCIMA',          // 10
  'DÉCIMA PRIMERA',  // 11
  'DÉCIMA SEGUNDA',  // 12
  'DÉCIMA TERCERA',  // 13
  'DÉCIMA CUARTA',   // 14
  'DÉCIMA QUINTA',   // 15
];

export function ordinalClause(n: number): string {
  return ORDINALS[n - 10] ?? `CLÁUSULA ${n}`;
}
