# Diseño: Sección scrollytelling en /como-funciona

## Contexto

La página `/como-funciona` explica cómo se genera un contrato. Hoy su sección
central (`StepByStepSection`) usa **fotos stock genéricas** (gente en cafés,
oficinas) que no muestran el producto real ni transmiten lo joven/dinámico/fácil
de la marca. El objetivo: reemplazar esa sección con un **scrollytelling** —
inspirado en el patrón de Konfío (konfio.mx) — donde un mockup de teléfono
permanece fijo mientras el usuario scrollea y los pantallazos reales del
generador van cambiando por paso, con una barra de progreso vertical.

Konfío lo hace con video-scrubbing (video cuyo `currentTime` avanza con el
scroll). Se descartó por 2 razones: requiere producir un video de alta calidad
(no existe) y pesa en móvil de gama baja — **la mayoría del tráfico viene de
Meta Ads en móvil**. En su lugar usamos pantallazos reales + framer-motion:
más ligero, muestra el producto de verdad, sin assets costosos.

## Alcance

Reemplazar **solo** el componente `StepByStepSection`. El resto de
`/como-funciona` (`HeroProcessSection`, `ProcessFeaturesSection`,
`FinalCtaProcessSection`) no se toca.

## Los 4 momentos

Narrativa condensada (la actual tiene 4 pasos; se conservan pero se cuentan
mostrando el producto):

| # | Título | Descripción corta | Pantallazo |
|---|--------|-------------------|-----------|
| 1 | Elige tu estado y llena el formulario | Preguntas claras, sin tecnicismos. En minutos capturas todo. | Selector de estado / formulario |
| 2 | Tu contrato se arma en tiempo real | Motor legal por estado; ves el documento formarse conforme escribes. | Preview del contrato |
| 3 | Pagas seguro — $499, pago único | Sin suscripción, sin cargos ocultos. Stripe. | Modal de checkout |
| 4 | Recibes tu PDF listo para firmar | Al instante en tu correo, listo para imprimir y firmar. | Pantalla "¡Pago exitoso!" |

## Diseño visual

### Desktop (≥1024px)
- Grid de 2 columnas dentro de un contenedor alto (~4× viewport) que define el
  recorrido de scroll.
- **Columna derecha: mockup de teléfono `sticky`** (top centrado). Dentro, los
  4 pantallazos apilados en absoluto; solo uno visible a la vez vía **crossfade**
  (`opacity`), controlado por la posición de scroll de la sección.
- **Columna izquierda:** los 4 bloques de texto (título + descripción + bullets).
  El bloque activo (el que corresponde al pantallazo visible) está a `opacity 1`;
  los demás atenuados (`opacity ~0.4`). Transición suave.
- **Barra de progreso vertical** entre columnas, en azul de marca `#4D6BFE`
  (no el morado de Konfío). Se llena de 0→100% a lo largo de la sección
  (`scaleY` con `transformOrigin: top`).
- El teléfono con una ligera inclinación 3D opcional (perspectiva sutil), sin
  exagerar.

### Móvil (<1024px) — crítico para el tráfico
- **Sin sticky, sin scroll-scrubbing** (pesado y propenso a mareo). Los 4 pasos
  se **apilan verticalmente**: cada uno = pantallazo (dentro de un marco de
  teléfono más chico o tarjeta) + texto debajo.
- Cada paso hace **fade + slide-in corto al entrar en viewport**
  (`whileInView`, una sola vez), con stagger leve entre pantallazo y texto.
- Barra de progreso no aplica en móvil (o versión horizontal simple opcional).

## Reglas de UX aplicadas (de la skill ui-ux-pro-max)

- **`prefers-reduced-motion`**: si está activo, render estático — los 4 pasos
  visibles sin crossfade ni sticky ni fades; scroll normal. (Scroll-jacking y
  parallax causan náuseas; regla severidad Alta.)
- **Solo `transform`/`opacity`** en toda animación — nunca width/height/top/left
  (evita repaints). Crossfade = opacity; barra = scaleY; entradas = translateY.
- **`fade-crossfade`**: reemplazo de contenido en el mismo contenedor (el
  teléfono) usa crossfade, no corte duro.
- **Easing:** `ease-out` para entradas. Duraciones 200–400ms.
- **No scroll-jacking:** el usuario scrollea normal; la animación *responde* al
  scroll (no lo secuestra ni lo frena).
- **Máx 1–2 elementos animados por vista** (el pantallazo que cruza + la barra).
- **Contraste/legibilidad:** texto activo `slate-900`, atenuado con opacidad
  suficiente para seguir siendo legible (no gris-sobre-gris ilegible).
- **`image-dimension`:** los pantallazos declaran width/height (next/image) para
  no causar layout shift.

## Assets

Capturar **4 pantallazos reales del generador en viewport móvil (375px)** para
que quepan limpios en el marco del teléfono:
1. `/contrato` — selector de estado / formulario
2. Generador con preview del contrato armándose
3. Modal de checkout ($499)
4. `/success` — "¡Pago exitoso!"

Se guardan en `public/images/como-funciona/` (nombres tipo `paso-1.png` …
`paso-4.png`). Optimizados (WebP si posible). Reemplazan las fotos stock
(`step1_latin_laptop…` etc. quedan sin uso; no se borran en este cambio).

## Tecnología

- **framer-motion** (ya instalado, `^12.38.0`). `useScroll` + `useTransform`
  para desktop (crossfade + barra ligados al progreso de scroll de la sección);
  `whileInView` para las entradas móviles.
- Hook `useReducedMotion` de framer-motion para el fallback estático.
- next/image para los pantallazos.
- Tailwind, siguiendo los patrones del sitio.

## Archivos

- **Nuevo:** `src/components/como-funciona/ProcessScrollytelling.tsx` — la sección.
- **Nuevo (opcional):** `src/components/como-funciona/PhoneMock.tsx` — el marco de
  teléfono reutilizable, si conviene aislarlo.
- **Modificar:** `src/app/como-funciona/page.tsx` — cambiar `<StepByStepSection />`
  por `<ProcessScrollytelling />`.
- **Nuevos assets:** `public/images/como-funciona/paso-{1..4}.png`.
- `StepByStepSection.tsx` queda huérfano (no se borra en este cambio; se puede
  limpiar después).

## Verificación

- `npx tsc --noEmit` y `npm run build` limpios.
- Revisar en el navegador (Chrome MCP) a **1440px (desktop)** y **375px (móvil)**:
  - Desktop: el teléfono se queda sticky, los pantallazos cruzan por paso, la
    barra azul se llena, el texto activo se resalta.
  - Móvil: los 4 pasos apilados con fade-in, sin sticky, fluido.
- Probar con **reduced-motion activo** (DevTools → Rendering → Emulate CSS
  prefers-reduced-motion) — debe verse estático y legible, sin animación.
- Confirmar cero layout shift al cargar los pantallazos.
- Afinar timing del crossfade (1–2 iteraciones esperadas).

## Estado: implementado (2026-07-17)

Construido tal cual el spec, con estos detalles de la implementación real:

- **Assets:** los 4 pantallazos se capturaron con Puppeteer headless + Chrome
  del sistema, seedeando `localStorage['renters-contract-storage']` con un
  contrato de ejemplo (Nuevo León, INE del arrendador marcada "pendiente") y
  navegando a `/contrato` en viewport 390×844. El script de captura era
  temporal (`scripts/capture-screens.mjs`) y se borró tras generar los PNG;
  si hay que recapturar (cambia el diseño del generador), reconstruirlo desde
  este mismo patrón — store shape en `src/store/useContractStore.ts`.
- **Crossfade (`useBandOpacity`):** la primera versión usaba
  `useTransform(progress, [inputs...], [outputs...])` con arrays de
  keyframes (una banda por paso, con `isFirst`/`isLast` para los extremos).
  **Esto produjo opacidades incorrectas en producción** — el inline style
  decía `opacity:1` pero `getComputedStyle` devolvía valores intermedios
  (ej. `0.21` cuando debía ser `1`), verificado con Puppeteer + wheel-scroll
  real (no fue artefacto del script de verificación). No se encontró la causa
  raíz exacta (sospecha: interacción entre keyframes con inputs que comparten
  límites exactos entre paso y paso, o el path de animación acelerada por
  hardware de framer-motion). **Fix:** reescribir `useBandOpacity` como
  transform funcional (`useTransform(progress, v => ...)`) en vez de arrays
  de keyframes — mismo resultado visual (meseta + fade lineal en los bordes),
  cero ambigüedad de rangos. Si se toca esta función, preferir la forma
  funcional sobre keyframes array-based.
- **`overflow-hidden` en la `<section>` rompía `position: sticky`** del
  teléfono (bug clásico: un ancestro con `overflow` distinto de `visible`
  corta el contexto de sticky). Se quitó `overflow-hidden` de la sección.
- **Bug de paso encontrado y arreglado:** `CheckoutModal.tsx` mostraba
  `contract.state.toUpperCase()` (slug crudo, ej. `NUEVO-LEON`) en vez del
  nombre legible. Ahora usa `getStateName()` de `src/lib/states.ts`.
- Verificado: `tsc --noEmit` limpio, `npm run build` limpio, Chrome headless
  a 1440px (desktop, crossfade + barra confirmados paso a paso) y 375px
  (móvil, stacked fade-in confirmado), `prefers-reduced-motion: reduce`
  confirmado (scrolly no se monta, fallback estático apilado sí).
- `StepByStepSection.tsx` sigue en el repo sin usarse (huérfano), tal como
  preveía el spec — no se borró en este cambio.
