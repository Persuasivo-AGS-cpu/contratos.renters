# Revisión de copy (contratos.renters.mx y www.renters.mx) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que un visitante entienda en menos de 10 segundos qué es el contrato en línea, qué es la póliza jurídica, cuál le toca (según su estado y su necesidad) y que ninguna frase prometa más de lo que se puede sostener hoy.

**Architecture:** (1) Un brief de mensajes y un registro de afirmaciones como fuente de verdad (documentos). (2) Los textos repetidos viven en un solo archivo (`src/lib/copy.ts`) y una lista de frases prohibidas (`src/lib/copyProhibido.ts`) que un test recorre sobre todo `src/`, para que no vuelvan a entrar promesas absolutas. (3) Se reescriben los textos archivo por archivo con reemplazos exactos. (4) Los cambios de www.renters.mx van en el otro repositorio, en su propio PR. (5) Se valida con una prueba de comprensión con personas reales, no solo con tests.

**Tech Stack:** Next.js 16 / React 19 / Tailwind v4 (contratos), Vite + React (www), tests con `node --test`, navegador integrado para la verificación.

---

## Hechos de negocio que este plan toma como verdad (dados por Abraham)

1. El **contrato en línea** (contratos.renters.mx, $499 MXN) es una plantilla digital diseñada por abogados especialistas en temas inmobiliarios. Se vende en **6 estados** (Nuevo León, Jalisco, Querétaro, Mérida, San Luis Potosí, Coahuila de Zaragoza). Es para quien **solo necesita el documento**.
2. La **póliza jurídica** se vende **solo en Nuevo León**. **Todo paquete** de póliza incluye un contrato personalizado para el inmueble, hecho por los mismos abogados y con la misma lógica que el contrato digital.
3. En el resto de los estados **solo se venden contratos**.
4. Datos de compra verificables hoy: `src/lib/compra.ts` (90 días de enlace, 24 horas de corrección gratis, soporte en "menos de 1 día").

## Compuertas de decisión (bloquean tareas concretas)

| # | Decisión | Quién | Bloquea | Mientras tanto |
|---|---|---|---|---|
| G1 | Aprobar la frase de autoría: *"Plantilla diseñada por abogados especialistas en temas inmobiliarios"* | Abogado de Abraham | Mezclar (Task 11) | Va en un solo lugar (`COPY.autoria`); si no se aprueba, se cambia esa línea por *"Plantilla basada en el Código Civil de tu estado"* |
| G2 | Correo y horario oficiales de soporte (`hola@renters.mx`, 9:00–18:00 son provisionales) | Abraham | Nada del copy nuevo | Se usan los provisionales de `src/lib/contactInfo.ts` |
| G3 | Fuente de las cifras de www: "+500 propiedades protegidas", "98% casos resueltos", "24/7" | Abraham | Task 8 Step 1 | Se reemplazan por datos verificables (Nuevo León, 3 paquetes, 30% de comisión) |
| G4 | Qué servicios incluye **cada** paquete (para poder decir "incluye X") | Abraham | Solo si se quiere enumerar servicios | El copy dice "los servicios de tu paquete" sin enumerar |

## Fuera de alcance

- Unificar las dos páginas de contacto; legales (aviso de privacidad y términos) duplicados.
- Rediseño visual. Solo texto, y dos componentes mínimos para el aviso de póliza.
- Textos dentro de las plantillas del contrato (`src/components/generator/templates/`): son el documento legal, no marketing.

---

## Mapa de archivos

**contratos.renters.mx** (`/Users/abrahamgarza/Documents/Persuasivo/03-Paginas-Clientes/web-contratos-seguridad`)

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `docs/copy/brief-y-registro.md` | Crear | Brief de mensajes + registro de afirmaciones |
| `src/lib/copyProhibido.ts` | Crear | Lista de frases prohibidas |
| `src/lib/copyClaims.test.mjs` | Crear | Recorre `src/` y falla si aparece una frase prohibida |
| `src/lib/copy.ts` | Crear | Textos repetidos (autoría, póliza, diferencia) |
| `src/lib/copy.test.mjs` | Crear | Los textos de `copy.ts` no usan frases prohibidas y dicen "Nuevo León" |
| `src/components/home/PolizaNota.tsx` | Crear | Aviso "póliza solo en Nuevo León" reutilizable |
| `src/app/layout.tsx`, `src/app/opengraph-image.tsx` | Modificar | Metadescripción e imagen social |
| `src/components/home/CtaSection.tsx`, `PricingSection.tsx`, `DudasRapidasSection.tsx` | Modificar | Cierre, precio (+ aviso de póliza), pregunta nueva |
| `src/components/layout/Footer.tsx` | Modificar | Descripción del pie |
| `src/app/estado/[slug]/page.tsx` | Modificar | Texto, FAQ y datos estructurados por estado (+ FAQ de póliza en Nuevo León) |
| `src/app/success/page.tsx` | Modificar | Aviso de póliza tras la compra |
| `src/components/checkout/CheckoutModal.tsx`, `PurchaseValue.tsx`, `src/components/generator/steps/SummaryStep.tsx`, `src/components/generator/variant-b/ContratoBEngine.tsx` | Modificar | Copy dentro del flujo de compra |
| `docs/copy/prueba-comprension.md` | Crear | Guion y criterio de la prueba con personas |

**www.renters.mx** (`/Users/abrahamgarza/Documents/Persuasivo/Proyectos/renters-mx-sitio`)

| Archivo | Acción |
|---|---|
| `src/components/organisms/HeroSection/HeroSection.jsx` | Modificar (subtítulo y 3 cifras) |
| `src/components/organisms/FAQSection/FAQSection.jsx` | Modificar (respuesta 1) |
| `src/components/organisms/Footer/Footer.jsx` | Modificar |
| `src/pages/Paquetes.jsx` | Modificar (título y orden de la tarjeta "solo el contrato") |

---

### Task 0: Preparación

**Files:** ninguno

- [ ] **Step 1: Rama limpia desde `main`**

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/03-Paginas-Clientes/web-contratos-seguridad
git fetch origin
git status --short
git switch -c feat/copy-claro origin/main
git branch --unset-upstream
git branch --show-current
```
Expected: `git status --short` puede mostrar planes sin versionar (`docs/superpowers/plans/…`); nada más. Si hay cambios sin guardar en archivos de `src/`, detenerse y avisar. Última línea: `feat/copy-claro`.

- [ ] **Step 2: Línea base verde**

```bash
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```
Expected: `fail 0`.

---

### Task 1: Brief de mensajes y registro de afirmaciones

**Files:**
- Create: `docs/copy/brief-y-registro.md`

- [ ] **Step 1: Crear el documento con este contenido exacto**

```markdown
# Brief de mensajes y registro de afirmaciones

## La idea en una línea
**El contrato es el documento. La póliza jurídica es el documento más el respaldo legal durante la renta.**

## Qué es cada cosa
| | Contrato en línea | Póliza jurídica |
|---|---|---|
| Dónde se vende | contratos.renters.mx | www.renters.mx |
| Estados | Nuevo León, Jalisco, Querétaro, Mérida, San Luis Potosí y Coahuila de Zaragoza | Solo Nuevo León |
| Para quién | Quien solo necesita el documento | Quien además quiere respaldo legal durante la renta |
| Qué incluye | Contrato personalizado por estado, PDF para firmar, enlace de descarga 90 días, corrección gratis 24 h | Un contrato personalizado (mismos abogados, misma lógica) más los servicios de su paquete |
| Precio | $499 MXN, IVA incluido | Según paquete |

## Reglas de redacción
1. Decir **qué es**, **para quién es** y **dónde aplica**. Si algo solo aplica en Nuevo León, la frase dice "Nuevo León".
2. La póliza **no se menciona** a quien está en otro estado, salvo la frase de la pregunta "¿Qué diferencia hay…?", que aclara que fuera de Nuevo León solo hay contratos.
3. Nada de absolutos: no "legalmente válido", "válido ante autoridades", "100% protegido", "redactado por abogados" sin la frase aprobada, "te blinda", "sin despachos costosos", "cobranza y desalojo incluidos".
4. Nada de cifras sin fuente. Un dato se publica solo si existe un registro de dónde sale.
5. Nada de promesas de factura. Nada de "no compartimos tus datos con terceros".
6. Tiempo: no prometer "menos de X minutos" como garantía; un cliente real tardó 31 minutos.
7. Las frases de autoría usan `COPY.autoria` (src/lib/copy.ts): se cambian en un solo lugar.

## Vocabulario
| Usar | Evitar |
|---|---|
| contrato en línea, plantilla, contrato personalizado | contrato legal, contrato blindado |
| póliza jurídica (solo Nuevo León) | seguro de arrendamiento, garantía, fianza |
| basado en el Código Civil de [estado] | conforme / válido ante tribunales |
| respaldo legal durante la renta | "protección total" |

## Registro de afirmaciones
| Afirmación | Dónde está hoy | Estado | Acción |
|---|---|---|---|
| "Legalmente válido" | layout.tsx, opengraph-image.tsx, estado/[slug] (texto) | Absoluta, pendiente de abogado | Reemplazar por "basado en el Código Civil de [estado]" |
| "Redactado por abogados" / "Validado por abogados expertos" | estado/[slug], opengraph-image, PurchaseValue, ContratoBEngine | Autoría; pendiente de G1 | Reemplazar por `COPY.autoria` |
| "Plenamente exigible ante los tribunales locales" | estado/[slug] (FAQ) | Absoluta | Reemplazar |
| "Te blinda en papel… cobranza y desalojo incluidos" | success/page.tsx | Absoluta; depende del paquete (G4) | Reemplazar |
| "Protege / asegura tu patrimonio" | CtaSection, PricingSection, Footer | Promesa absoluta | Reemplazar |
| "Contrato legal completo", "PDF legal", "Contrato Legal" | PricingSection, SummaryStep, CheckoutModal | Ambigua | Reemplazar |
| "Un despacho tradicional: $2,500–$5,000" | (ya retirado) | Sin sustento | No volver a usar |
| "+500 propiedades protegidas en México" | www HeroSection | Sin fuente (G3); póliza solo en NL | Reemplazar o documentar fuente |
| "98% casos resueltos exitosamente" | www HeroSection | Sin fuente (G3) | Reemplazar o documentar fuente |
| "Respaldo legal 24/7", "Asesoría 24/7 incluida" | www HeroSection | Sin sustento (G3) | Reemplazar |
| "Póliza… garantiza el cumplimiento" | www FAQSection | Absoluta | Reemplazar |
| "…en México" (póliza) | www Paquetes (título), Footer | Engañosa: póliza solo en NL | Cambiar a "Nuevo León" |
| "Menos de 6 minutos" | Héroe de contratos (estadística) | Promedio sin dato | Reportar; no tocar en este plan |
| Datos de compra: 90 días, 24 horas, menos de 1 día | `src/lib/compra.ts` | Verificado (el test compara con la vigencia real) | Mantener |
```

- [ ] **Step 2: Commit**

```bash
git add docs/copy/brief-y-registro.md
git commit -m "docs(copy): brief de mensajes y registro de afirmaciones" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Frases prohibidas y test que recorre `src/` (se escribe primero; debe fallar)

**Files:**
- Create: `src/lib/copyProhibido.ts`
- Create: `src/lib/copyClaims.test.mjs`

- [ ] **Step 1: Lista de frases prohibidas** (sin imports, para que corra con node)

`src/lib/copyProhibido.ts`:
```ts
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
];
```

- [ ] **Step 2: Test que recorre todo `src/`**

`src/lib/copyClaims.test.mjs`:
```js
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
```

- [ ] **Step 3: Correr y ver que falla**

Run: `npm test 2>&1 | grep -E "src/|fail"`
Expected: FAIL con hallazgos en estos archivos (la lista final puede variar en una o dos líneas): `src/app/layout.tsx`, `src/app/opengraph-image.tsx`, `src/app/estado/[slug]/page.tsx`, `src/app/success/page.tsx`, `src/components/checkout/CheckoutModal.tsx`, `src/components/checkout/PurchaseValue.tsx`, `src/components/generator/steps/SummaryStep.tsx`, `src/components/generator/variant-b/ContratoBEngine.tsx`, `src/components/home/CtaSection.tsx`, `src/components/home/PricingSection.tsx`, `src/components/layout/Footer.tsx`. **No hacer commit todavía**: el commit va en la Task 7, cuando el test ya pasa, para que ningún commit deje la suite en rojo.

---

### Task 3: Textos centrales y aviso de póliza

**Files:**
- Create: `src/lib/copy.ts`, `src/lib/copy.test.mjs`, `src/components/home/PolizaNota.tsx`

- [ ] **Step 1: Test que falla**

`src/lib/copy.test.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { COPY } from './copy.ts';
import { PROHIBIDAS } from './copyProhibido.ts';

const textos = [COPY.autoria, ...COPY.insignias, COPY.soloContrato, COPY.polizaNota, COPY.diferencia];

test('ningún texto central usa frases prohibidas', () => {
  for (const t of textos) for (const re of PROHIBIDAS) assert.doesNotMatch(t, re, `"${t}" coincide con ${re}`);
});

test('todo lo que habla de póliza dice Nuevo León', () => {
  assert.match(COPY.polizaNota, /Nuevo León/);
  assert.match(COPY.diferencia, /Nuevo León/);
});

test('la diferencia aclara que fuera de Nuevo León solo hay contratos', () => {
  assert.match(COPY.diferencia, /resto de los estados ofrecemos solo contratos/);
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npm test 2>&1 | grep -E "copy.ts|ERR_MODULE|fail"`
Expected: FAIL — `Cannot find module ... copy.ts`.

- [ ] **Step 3: Crear `src/lib/copy.ts`**

```ts
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
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npm test 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: los 3 tests de `copy.test.mjs` pasan; el de `copyClaims` sigue fallando (se arregla en las Tasks 4–6).

- [ ] **Step 5: Crear el aviso reutilizable**

`src/components/home/PolizaNota.tsx`:
```tsx
import { ArrowRight } from "lucide-react";
import { COPY } from "@/lib/copy";

export function PolizaNota({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-border-layout bg-white p-5 text-left ${className}`}>
      <p className="mb-2 text-sm font-semibold text-text-main">{COPY.soloContrato}</p>
      <p className="text-sm leading-relaxed text-text-muted">{COPY.polizaNota}</p>
      <a
        href={COPY.polizaEnlace.href}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3563E9] hover:underline"
      >
        {COPY.polizaEnlace.label} <ArrowRight className="size-4" />
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Tipos y commit** (solo archivos nuevos; el test de claims sigue sin commitear)

```bash
npx tsc --noEmit && echo TSC_OK
git add src/lib/copy.ts src/lib/copy.test.mjs src/components/home/PolizaNota.tsx
git commit -m "feat(copy): textos centrales y aviso de póliza solo Nuevo León" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Superficies principales (metadatos, imagen social, precio, cierre, pie, dudas)

**Files:** `src/app/layout.tsx`, `src/app/opengraph-image.tsx`, `src/components/home/CtaSection.tsx`, `PricingSection.tsx`, `DudasRapidasSection.tsx`, `src/components/layout/Footer.tsx`

Antes de cada reemplazo, confirmar que el texto viejo existe una sola vez (`grep -c`); si no coincide exactamente, **detenerse y reportar** en vez de improvisar. Usar este helper de Python para todos los reemplazos de la tarea (guardar en `/tmp/reemplazar.py` fuera del repo):

```python
import sys
path, old, new = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(path, encoding='utf-8').read()
assert s.count(old) == 1, f"{path}: el texto viejo aparece {s.count(old)} veces: {old[:60]}"
open(path, 'w', encoding='utf-8').write(s.replace(old, new, 1))
print("ok", path)
```

- [ ] **Step 1: `layout.tsx` (metadescripción)**

Viejo: `Genera tu contrato de arrendamiento personalizado y legalmente válido para ${getAvailableStatesList()}. Basado en el Código Civil estatal. Listo para firmar en minutos. $499 MXN.`
Nuevo: `Genera tu contrato de arrendamiento personalizado para ${getAvailableStatesList()}. Plantilla basada en el Código Civil de cada estado. Revísalo antes de pagar y descárgalo en PDF para firmar. $499 MXN.`

- [ ] **Step 2: `opengraph-image.tsx`**

1. Viejo: `legalmente válidos en minutos` → Nuevo: `por estado, listos para firmar`
2. Viejo: `✓ Redactado por abogados` → Nuevo: `✓ Basado en el Código Civil`

- [ ] **Step 3: `CtaSection.tsx`**

Viejo: `Protege tu patrimonio hoy` → Nuevo: `Genera tu contrato hoy`

- [ ] **Step 4: `Footer.tsx`**

Viejo: `El motor de generación legal que asegura tu patrimonio sin complicaciones ni despachos costosos.`
Nuevo: `Contratos de arrendamiento personalizados por estado: los llenas en línea y descargas el PDF.`

- [ ] **Step 5: `PricingSection.tsx`** (4 cambios)

1. Viejo: `"Contrato legal completo",` → Nuevo: `"Contrato de arrendamiento personalizado",`
2. Viejo: `Inversión que protege tu patrimonio` → Nuevo: `Un precio, sin suscripción`
3. Viejo: `import { Reveal } from "@/components/shared/Reveal";` → Nuevo:
```tsx
import { Reveal } from "@/components/shared/Reveal";
import { PolizaNota } from "./PolizaNota";
```
4. Viejo (el final de la sección):
```tsx
      </Reveal>
    </section>
```
Nuevo:
```tsx
      </Reveal>

      <div className="mx-auto mt-10 max-w-md">
        <PolizaNota />
      </div>
    </section>
```

- [ ] **Step 6: `DudasRapidasSection.tsx`** (sexta pregunta)

1. Viejo: `import { getAvailableStatesList } from "@/lib/states";` → Nuevo:
```tsx
import { getAvailableStatesList } from "@/lib/states";
import { COPY } from "@/lib/copy";
```
2. Viejo:
```tsx
    accion: { label: "Reenviar mi enlace", href: "/reenviar-enlace" },
  },
];
```
Nuevo:
```tsx
    accion: { label: "Reenviar mi enlace", href: "/reenviar-enlace" },
  },
  {
    q: "¿Qué diferencia hay entre el contrato y la póliza jurídica?",
    a: COPY.diferencia,
    accion: { label: COPY.polizaEnlace.label, href: COPY.polizaEnlace.href },
  },
];
```

- [ ] **Step 7: Verificar y commit**

```bash
npx tsc --noEmit && echo TSC_OK
git add src/app/layout.tsx src/app/opengraph-image.tsx src/components/home src/components/layout/Footer.tsx
git commit -m "feat(copy): metadatos, precio, cierre, pie y dudas sin promesas absolutas; aviso de póliza solo Nuevo León" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```
Expected: `TSC_OK`. `git status` limpio salvo `copyProhibido.ts`, `copyClaims.test.mjs` y planes sin versionar.

---

### Task 5: Páginas por estado y página de éxito

**Files:** `src/app/estado/[slug]/page.tsx`, `src/app/success/page.tsx`

- [ ] **Step 1: Agregar el import en `estado/[slug]/page.tsx`**

```bash
python3 - <<'EOF'
p = 'src/app/estado/[slug]/page.tsx'
lineas = open(p, encoding='utf-8').read().split('\n')
ultimo = max(i for i, l in enumerate(lineas) if l.startswith('import '))
lineas.insert(ultimo + 1, "import { COPY } from '@/lib/copy';")
open(p, 'w', encoding='utf-8').write('\n'.join(lineas))
print('import agregado tras la línea', ultimo + 1)
EOF
```

- [ ] **Step 2: Reemplazos en `estado/[slug]/page.tsx`** (con el helper de la Task 4; 7 cambios)

1. Metadescripción. Viejo: ``Genera tu contrato de arrendamiento para ${name} en menos de 6 minutos. Redactado por abogados conforme al Código Civil de ${state.legalName}. $499 MXN, listo para firmar.``
   Nuevo: ``Genera tu contrato de arrendamiento para ${name}. Plantilla basada en el Código Civil de ${state.legalName}. $499 MXN, listo para firmar.``
2. Viejo: ``    `Conforme al Código Civil de ${legalName} vigente`,`` → Nuevo: ``    `Basado en el Código Civil de ${legalName}`,``
3. Viejo: `    'Redactado y revisado por abogados especializados en arrendamiento',` → Nuevo: `    COPY.autoria,`
4. FAQ de validez. Viejo (las 3 líneas del primer elemento):
```tsx
    {
      q: `¿El contrato es válido en ${name}?`,
      a: `Sí. La plantilla está redactada conforme al Código Civil de ${legalName} y contiene las cláusulas obligatorias para que el contrato sea plenamente exigible ante los tribunales locales.`,
    },
```
   Nuevo:
```tsx
    {
      q: `¿El contrato aplica en ${name}?`,
      a: `Es una plantilla basada en el Código Civil de ${legalName}. Si tu caso tiene condiciones especiales, te recomendamos consultarlo con un abogado.`,
    },
    ...(slug === 'nuevo-leon'
      ? [{ q: '¿Y la póliza jurídica?', a: `${COPY.soloContrato} ${COPY.polizaNota}` }]
      : []),
```
5. Texto del héroe. Viejo (2 líneas):
```tsx
            Genera tu contrato de renta personalizado y legalmente válido para {name} en menos de 6 minutos.
            Redactado por abogados, adaptado a la legislación local. $499 MXN, pago único.
```
   Nuevo:
```tsx
            Genera tu contrato de renta personalizado para {name}. {COPY.autoria}, basada en el Código Civil de {legalName}.
            $499 MXN, pago único.
```
6. Datos estructurados. Viejo: ``description: `Contrato de arrendamiento conforme al Código Civil de ${legalName}, redactado por abogados.`,`` → Nuevo: ``description: `Contrato de arrendamiento basado en el Código Civil de ${legalName}.`,``

- [ ] **Step 3: `success/page.tsx` (aviso de póliza solo Nuevo León, ya condicionado a folio `NL-`)**

Agregar el import igual que el Step 1 (`import { COPY } from '@/lib/copy';` o con comillas dobles si el archivo las usa; verificar con `grep -n "^import" src/app/success/page.tsx | head -3`). Reemplazos:
1. Viejo: `Da el siguiente paso: protégete si tu inquilino no paga` → Nuevo: `¿Necesitas respaldo, no solo el documento?`
2. Viejo (3 líneas del párrafo):
```tsx
                Tu contrato te blinda en papel. Con la <strong className="text-slate-900">Póliza Jurídica de Renters</strong>,
                si tu inquilino deja de pagar, nosotros lo gestionamos por ti — cobranza y desalojo incluidos.
                Escríbenos y te contamos cómo funciona.
```
   Nuevo:
```tsx
                Tu contrato ya está listo. En Nuevo León también ofrecemos la <strong className="text-slate-900">Póliza Jurídica de Renters</strong>,
                que incluye un contrato personalizado y los servicios de tu paquete.
                Escríbenos y te contamos qué incluye cada uno.
```
   (`COPY` no se usa en este bloque, por lo que **no** hace falta el import; omitirlo si TypeScript avisa de import sin uso.)

- [ ] **Step 4: Verificar y commit**

```bash
npx tsc --noEmit && echo TSC_OK
git add "src/app/estado/[slug]/page.tsx" src/app/success/page.tsx
git commit -m "feat(copy): páginas por estado y aviso de póliza tras la compra sin promesas absolutas" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Copy dentro del flujo de compra

**Files:** `src/components/checkout/CheckoutModal.tsx`, `PurchaseValue.tsx`, `src/components/generator/steps/SummaryStep.tsx`, `src/components/generator/variant-b/ContratoBEngine.tsx`

- [ ] **Step 1: `CheckoutModal.tsx`** (con el helper)
1. Viejo: `'Contrato legal + Póliza de Protección'` → Nuevo: `'Contrato + Póliza de Protección'`
2. Viejo: `Desbloquear Contrato Legal — ` → Nuevo: `Tu contrato de arrendamiento — `

- [ ] **Step 2: `PurchaseValue.tsx`**
1. Agregar `import { COPY } from "@/lib/copy";` tras la última línea `import` (mismo script de Python de la Task 5 Step 1 con esa ruta y comillas dobles).
2. Viejo: `, conforme al Código Civil de {legalStateName}.` → Nuevo: `, basado en el Código Civil de {legalStateName}.`
3. Viejo: `<span>Redactado y validado por abogados expertos en el tema.</span>` → Nuevo: `<span>{COPY.autoria}.</span>`

- [ ] **Step 3: `SummaryStep.tsx`**
Viejo: `se creará un PDF legal basado en la plantilla de <strong>{getStateName(contract.state)}</strong>, conforme al Código Civil de {getLegalStateName(contract.state).toUpperCase()}.`
Nuevo: `se creará tu contrato en PDF, basado en la plantilla de <strong>{getStateName(contract.state)}</strong> y en el Código Civil de {getLegalStateName(contract.state).toUpperCase()}.`

- [ ] **Step 4: `ContratoBEngine.tsx`**
1. Agregar `import { COPY } from "@/lib/copy";` tras la última línea `import`.
2. Viejo: `{["✓ Redactado por abogados", "✓ Conforme al código civil", "✓ Validado por abogados expertos"].map((b) => (`
   Nuevo: `{COPY.insignias.map((b) => (`
   y en la línea siguiente (`<span key={b} …>`) el contenido `{b}` pasa a `✓ {b}`: viejo `              {b}\n            </span>` → nuevo `              ✓ {b}\n            </span>`.

- [ ] **Step 5: Verificar y commit**

```bash
npx tsc --noEmit && echo TSC_OK
git add src/components/checkout src/components/generator/steps/SummaryStep.tsx src/components/generator/variant-b/ContratoBEngine.tsx
git commit -m "feat(copy): flujo de compra sin promesas absolutas" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: El test de frases prohibidas pasa

**Files:** `src/lib/copyProhibido.ts`, `src/lib/copyClaims.test.mjs` (creados en la Task 2)

- [ ] **Step 1: Correr todo**

```bash
npm test 2>&1 | grep -E "src/|^ℹ (pass|fail)"
npx tsc --noEmit && echo TSC_OK
```
Expected: `fail 0`. Si el test de claims aún lista hallazgos, corregir cada uno con el mismo criterio del brief (no ampliar la lista de excluidos para "hacer pasar" el test; un hallazgo en marketing se reescribe).

- [ ] **Step 2: Build con claves falsas** (solo en la línea de comando; no crear `.env`)

```bash
RESEND_API_KEY=re_fake STRIPE_SECRET_KEY=sk_test_fake STRIPE_WEBHOOK_SECRET=whsec_fake NEXT_PUBLIC_SUPABASE_URL=https://fake.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=fake SUPABASE_SERVICE_ROLE_KEY=fake npm run build 2>&1 | tail -8
```
Expected: compila y lista las rutas incluyendo `/` y `/estado/[slug]`.

- [ ] **Step 3: Commit del test**

```bash
git add src/lib/copyProhibido.ts src/lib/copyClaims.test.mjs
git commit -m "test(copy): ningún archivo de src usa frases prohibidas" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Copy de www.renters.mx (otro repositorio, PR aparte)

**Files:** en `/Users/abrahamgarza/Documents/Persuasivo/Proyectos/renters-mx-sitio`: `HeroSection.jsx`, `FAQSection.jsx`, `Footer.jsx`, `Paquetes.jsx` (rutas completas en el mapa)

- [ ] **Step 1: Rama y línea base**

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/Proyectos/renters-mx-sitio
git fetch origin && git status --short
git switch -c feat/copy-claro origin/main && git branch --unset-upstream
npm test 2>&1 | tail -5
```
Expected: sin cambios previos en `src/`; los tests existentes pasan (si el repo no tiene script `test`, anotarlo y seguir).

- [ ] **Step 2: Héroe** (`src/components/organisms/HeroSection/HeroSection.jsx`; usar el helper de la Task 4 desde esa carpeta)

Si en la compuerta **G3** Abraham entregó fuente para "+500" y "98%", saltar los cambios 2–3 y solo documentar la fuente en `docs/copy/brief-y-registro.md` del repo de contratos. Si no, aplicar:
1. Viejo: `Investigación de inquilino, contrato personalizado y respaldo legal 24/7 ante impagos o controversias.` → Nuevo: `Investigación de inquilino, contrato personalizado y respaldo legal ante impagos o controversias en Nuevo León.`
2. Viejo:
```jsx
              <strong>+500</strong>
              <span>Propiedades protegidas en<br/>México</span>
```
   Nuevo:
```jsx
              <strong>Nuevo León</strong>
              <span>Dónde ofrecemos<br/>la póliza jurídica</span>
```
3. Viejo:
```jsx
              <strong>98%</strong>
              <span>Casos resueltos<br/>exitosamente</span>
```
   Nuevo:
```jsx
              <strong>3</strong>
              <span>Paquetes de<br/>póliza jurídica</span>
```
4. Viejo:
```jsx
              <strong>24/7</strong>
              <span>Asesoría jurídica<br/>incluida</span>
```
   Nuevo:
```jsx
              <strong>30%</strong>
              <span>Comisión fija<br/>para asesores</span>
```
   Antes de aplicar el cambio 3, comprobar el número de paquetes: `grep -n "Básico\|Pro\b\|Premium" src/pages/Paquetes.jsx | head`. Si no son exactamente 3, poner el número real.

- [ ] **Step 3: Pregunta 1 del FAQ** (`FAQSection.jsx`)
Viejo: `Una póliza jurídica es un instrumento legal que garantiza el cumplimiento de las obligaciones del inquilino, protegiendo al arrendador ante falta de pago, daños al inmueble o negativas de desocupación.`
Nuevo: `Una póliza jurídica es un servicio de respaldo legal para el arrendador: según el paquete, incluye investigación del inquilino, contrato personalizado, asesoría jurídica y gestión ante falta de pago, daños al inmueble o negativa de desocupación. Hoy se ofrece en Nuevo León.`

- [ ] **Step 4: Pie** (`Footer.jsx`)
Viejo: `La nueva infraestructura de certeza para el arrendamiento inmobiliario en México.`
Nuevo: `Póliza jurídica en Nuevo León y contratos de arrendamiento en 6 estados.`

- [ ] **Step 5: Título de Paquetes** (`src/pages/Paquetes.jsx` línea ~104)
Viejo: `<h1 className="paquetes-title">Pólizas Jurídicas de<br/>Arrendamiento en México</h1>`
Nuevo: `<h1 className="paquetes-title">Pólizas Jurídicas de<br/>Arrendamiento en Nuevo León</h1>`

- [ ] **Step 6: Subir la tarjeta "Solo el contrato"**

```bash
grep -n -i "solo el contrato\|<FAQSection\|paquetes-grid\|Generar mi contrato" src/pages/Paquetes.jsx
```
Mover el bloque JSX completo que contiene "Solo el contrato" (la `<section>` o `<div>` que lo envuelve, de su apertura a su cierre) para que quede **inmediatamente después del bloque de tarjetas de paquetes y antes de `<FAQSection />`**. Cambiar en esa tarjeta su frase de apoyo a: `Para quien solo necesita el documento. Se vende en 6 estados.` Verificar el resultado en el navegador (Task 9) porque el orden visual depende de los estilos.

- [ ] **Step 7: Verificar y commit**

```bash
npm run build 2>&1 | tail -5
git add -A src
git commit -m "feat(copy): póliza solo en Nuevo León y cifras sin fuente retiradas" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```
Expected: build sin errores. `git status` no debe incluir archivos fuera de `src/`.

---

### Task 9: Verificación en navegador (ambos sitios)

**Files:** ninguno

- [ ] **Step 1: Levantar contratos en local** (claves falsas solo en la línea de comando)

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/03-Paginas-Clientes/web-contratos-seguridad
RESEND_API_KEY=re_fake STRIPE_SECRET_KEY=sk_test_fake STRIPE_WEBHOOK_SECRET=whsec_fake NEXT_PUBLIC_SUPABASE_URL=https://fake.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=fake SUPABASE_SERVICE_ROLE_KEY=fake npx next dev -p 3100
```

- [ ] **Step 2: Barrido automático de frases en cada ruta**

En el navegador integrado, abrir cada ruta de la lista y ejecutar este JS en la consola; debe imprimir `{"hallazgos":[]}`:
```js
const P=[/legalmente\s+v[aá]lid/i,/v[aá]lid[oa]s?\s+ante/i,/plenamente\s+exigible/i,/redactad[oa]s?\s+por\s+abogados/i,/validad[oa]s?\s+por\s+abogados/i,/abogados\s+expertos/i,/asegura\s+tu\s+patrimonio/i,/protege\s+tu\s+patrimonio/i,/sin\s+despachos/i,/te\s+blinda/i,/contrato\s+legal\b/i,/\bPDF\s+legal\b/i];
JSON.stringify({ruta:location.pathname,hallazgos:P.filter(r=>r.test(document.body.innerText)).map(String)})
```
Rutas de contratos: `/`, `/estado/nuevo-leon`, `/estado/jalisco`, `/contrato`, `/contrato?estado=nuevo-leon` (avanzar hasta el resumen), `/contacto`. Para www, en producción o en su servidor local: `/`, `/paquetes`, `/servicios`, `/preguntas-frecuentes`.

- [ ] **Step 3: Comprobación del mensaje por estado**

1. `/#precio` (cualquier estado): debe verse la nota "Este contrato es para quien solo necesita el documento. En Nuevo León también ofrecemos póliza jurídica…" bajo la tarjeta de $499.
2. `/#dudas`: la sexta pregunta existe y su respuesta termina en "En el resto de los estados ofrecemos solo contratos."
3. `/estado/nuevo-leon`: FAQ "¿Y la póliza jurídica?" visible. `/estado/jalisco`: **no** aparece ninguna mención de póliza en el FAQ.
4. www `/paquetes`: el título dice "en Nuevo León" y la tarjeta "Solo el contrato" queda arriba de las preguntas.
5. Sin desbordes a 375 px de ancho en `/` y `/paquetes`.

- [ ] **Step 4: Detener el servidor** y anotar en el PR qué filas pasaron y cuáles no se pudieron verificar.

---

### Task 10: Prueba de comprensión con personas

**Files:**
- Create: `docs/copy/prueba-comprension.md`

- [ ] **Step 1: Crear el guion**

```markdown
# Prueba de comprensión del mensaje contrato vs póliza

**Quién:** 5 personas que no conozcan Renters (propietarios o asesores inmobiliarios), idealmente 3 de fuera de Nuevo León y 2 de Nuevo León.
**Cómo:** mostrar en el celular 10 segundos la sección Precio de contratos.renters.mx (`/#precio`), taparla y preguntar. No explicar nada antes ni durante.

## Preguntas (anotar la respuesta textual)
1. ¿Qué venden aquí?
2. ¿Qué te llevas por $499?
3. ¿Esto es lo mismo que una póliza jurídica? ¿En qué se diferencia?
4. Si vives en Jalisco, ¿puedes contratar la póliza? (correcta: no, solo hay contrato)
5. Si vives en Nuevo León y quieres respaldo legal, ¿qué harías? (correcta: ver la póliza)

## Criterio de éxito
- Preguntas 1, 2, 4 y 5 correctas en al menos 4 de 5 personas.
- La pregunta 3: al menos 3 de 5 explican que la póliza incluye el contrato y suma respaldo.
- Si alguna persona de fuera de Nuevo León cree que puede comprar la póliza, el texto de `COPY.polizaNota` se reescribe y se repite la prueba con otras 3 personas.

## Registro
| Persona | Estado | P1 | P2 | P3 | P4 | P5 | Frase que no entendió |
|---|---|---|---|---|---|---|---|
```

- [ ] **Step 2: Commit**

```bash
git add docs/copy/prueba-comprension.md
git commit -m "docs(copy): guion y criterio de la prueba de comprensión" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: Aplicar la prueba sobre el deploy de preview** con las 5 personas, llenar la tabla en el PR y ajustar `src/lib/copy.ts` si el criterio no se cumple (un cambio en `COPY` actualiza todas las páginas a la vez).

---

### Task 11: PRs y revisión legal (sin mezclar)

**Files:** ninguno

- [ ] **Step 1: PR de contratos**

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/03-Paginas-Clientes/web-contratos-seguridad
git push -u origin feat/copy-claro
gh pr create --base main --head feat/copy-claro --title "Copy claro: contrato vs póliza y sin promesas absolutas" --body "$(cat <<'EOF'
## Qué cambia
- Mensaje único: el contrato es el documento; la póliza jurídica (solo Nuevo León) es el documento más respaldo.
- Textos repetidos en `src/lib/copy.ts`; frases prohibidas en `src/lib/copyProhibido.ts` con un test que recorre todo `src/`.
- Reescritos: metadatos, imagen social, precio, cierre, pie, dudas rápidas (+ pregunta contrato vs póliza), páginas por estado, aviso tras la compra y copy del flujo de compra.
- Brief y registro de afirmaciones en `docs/copy/`.

## Antes de mezclar (compuerta G1)
El abogado debe aprobar la frase de `COPY.autoria`: "Plantilla diseñada por abogados especialistas en temas inmobiliarios". Si no la aprueba, se cambia esa línea por "Plantilla basada en el Código Civil de tu estado".

## No verificado
Prueba de comprensión con personas (Task 10) y deploy de preview.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: PR de www** (mismo patrón, desde `/Users/abrahamgarza/Documents/Persuasivo/Proyectos/renters-mx-sitio`, rama `feat/copy-claro`, indicando si G3 entregó fuente o se retiraron las cifras).

- [ ] **Step 3: Paquete para el abogado.** Enviar `docs/copy/brief-y-registro.md` y la lista de textos nuevos (`src/lib/copy.ts`) para aprobación. **No mezclar ninguno de los dos PR sin: (a) aprobación de G1, (b) prueba de comprensión cumplida y (c) tu "mezcla" explícita.**

---

## Auto-revisión

**Cobertura de lo pedido**
- "Revisar el copy de la página": inventario con archivo y línea (registro, Task 1) y test automático sobre todo `src/` (Tasks 2, 7).
- "Transmitir las ideas correctas": brief con la idea en una línea (Task 1), textos centrales (Task 3), aviso de póliza en Precio, Dudas y página de Nuevo León (Tasks 3–5), copy de www (Task 8).
- "Sin confundir": regla de Nuevo León en cada mención de póliza (test lo exige, Task 3) y prueba con personas con criterio medible (Task 10).
- Promesas absolutas pendientes de abogado: lista ejecutable (Task 2), compuertas G1–G4.

**Placeholders:** ninguno; los pasos con condición (Task 8 Step 2 y Step 6) traen las dos salidas y el comando para decidir.

**Consistencia de nombres:** `COPY.autoria`, `COPY.insignias`, `COPY.soloContrato`, `COPY.polizaNota`, `COPY.polizaEnlace`, `COPY.diferencia` definidos en la Task 3 y usados igual en las Tasks 4–6; `PROHIBIDAS` definido en la Task 2 y usado en `copy.test.mjs` (Task 3) y `copyClaims.test.mjs`.

**Riesgos y lo que no verifiqué**
- Los reemplazos exactos salen de leer `origin/main` hoy; si cambió algún archivo, el helper falla a propósito en vez de improvisar.
- No leí el resto de `Paquetes.jsx`: el movimiento de la tarjeta "Solo el contrato" (Task 8 Step 6) se confirma visualmente.
- No sé si hay textos de marketing fuera de `src/` (correos en plantillas externas, Meta Ads, WhatsApp). Este plan cubre solo los dos sitios.
- La frase de autoría del texto aprobado depende de G1; el plan está armado para cambiarla en un solo archivo.
- La cifra "3 paquetes" del héroe de www se confirma en el Step 2 antes de aplicarse.
