import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { PROHIBIDAS } from './copyProhibido.ts';

// Fuera del test: el documento legal (plantillas del contrato), las páginas legales y los archivos que
// definen o prueban las frases prohibidas.
const EXCLUIDOS = [
  join('src', 'components', 'generator', 'templates') + sep,
  join('src', 'app', 'terminos') + sep,
  join('src', 'app', 'privacidad') + sep,
  join('src', 'lib', 'copyProhibido.ts'),
  join('src', 'lib', 'copy.ts'),
];

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivos(p);
    return /\.(ts|tsx)$/.test(n) ? [p] : [];
  });
}

test('ningún archivo de src/ usa frases prohibidas', () => {
  const hallazgos = [];
  for (const f of archivos('src')) {
    if (EXCLUIDOS.some((e) => f === e || f.startsWith(e))) continue;
    const lineas = readFileSync(f, 'utf8').split('\n');
    lineas.forEach((l, i) => {
      for (const re of PROHIBIDAS) if (re.test(l)) hallazgos.push(`${f}:${i + 1}  ${re}  →  ${l.trim().slice(0, 90)}`);
    });
  }
  assert.equal(hallazgos.length, 0, `\n${hallazgos.join('\n')}\n`);
});
