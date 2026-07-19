# Plan de auditoría integral — contratos.renters.mx

**Objetivo:** encontrar bugs reales antes de que lleguen a producción (Stripe LIVE,
clientes reales). Cubre seguridad, backend, frontend/tecnología, UX/UI, integridad
de datos. Diseñado para ejecutarse **en una sola pasada por una IA** — o repartido
en subagentes paralelos, uno por track (los tracks no comparten estado).

**Este documento es el prompt ejecutable.** Un agente lo lee y produce el reporte
de findings sin más contexto. No requiere la conversación previa.

---

## Cómo ejecutar (una IA, un movimiento)

1. Lee `PROJECT_MAP.md` en la raíz (stack, rutas, tablas, convenciones).
2. Recorre los 6 tracks de abajo **en orden de severidad** (Track 1 = más crítico).
3. Para cada check: abre el/los archivo(s), verifica la hipótesis, decide
   CONFIRMADO / DESCARTADO / DUDOSO. No inventes — si no puedes probar el bug con
   una ruta de fallo concreta (inputs → resultado incorrecto), márcalo DUDOSO.
4. **No apliques fixes durante la auditoría.** Solo reporta. Cualquier cambio que
   toque pago, webhook, RLS, cron o entrega de PDF se confirma con el humano antes.
5. Cierre: `npx tsc --noEmit` y `npm run build` deben seguir verdes (la auditoría
   no debe dejar el árbol roto).

### Fan-out opcional (más rápido)
Despachar 1 subagente por track (6 en paralelo). Cada uno devuelve su lista de
findings en el formato de salida de abajo. El hilo principal los consolida y
ordena por severidad. Los tracks son independientes — no hay estado compartido.

---

## Rúbrica de severidad

| Nivel | Criterio | Ejemplo en este proyecto |
|---|---|---|
| **P0 Crítico** | Cobro sin entrega, fuga de datos, cualquiera puede leer/alterar datos ajenos, contrato legalmente inválido servido | Insert de Supabase que falla silencioso tras cobrar; RLS ausente; folio duplicado; cláusula legal errónea por estado |
| **P1 Alto** | Bloquea conversión, pierde dinero/datos recuperables, XSS/injección con impacto acotado | Checkout rechaza payload válido; PDF cae a fallback en prod; email rebota |
| **P2 Medio** | Robustez, edge cases, privacidad no crítica | Polling infinito en /success; CLABE en localStorage sin expirar |
| **P3 Bajo** | Limpieza, dead code, inconsistencia de copy | Componentes huérfanos; listas de estados hardcodeadas |

Reporta P0/P1 siempre. P2/P3 solo si son reales y accionables.

---

## Track 1 — Seguridad (P0 primero)

**Objetivo:** nadie puede leer/alterar datos ajenos, cobrar sin entregar, ni
inyectar. Secretos no expuestos.

Archivos: `src/proxy.ts`, `src/app/api/**/route.ts`, `supabase/migrations/*.sql`,
`src/lib/supabase*.ts`, `next.config.ts`.

Checks:
- **RLS real, no solo declarada.** ¿Todas las tablas (`contratos`, `waitlist`,
  `leads`, `funnel_events`) tienen RLS `ENABLED` *y* políticas que niegan al rol
  `anon`? Una tabla con RLS on pero política `USING (true)` es igual de abierta.
  Verificar que la anon key solo pueda insertar lo que debe, nunca `SELECT *`.
- **IDOR en entrega de PDF.** `/api/pdf`, `/api/download`, `/imprimir`,
  `pdf_token`. ¿El token es no adivinable (UUID) y único por contrato? ¿Se puede
  pedir el PDF de otro contrato manipulando el parámetro? ¿El endpoint valida
  pago antes de servir el documento completo?
- **Integridad de pago.** `src/app/api/checkout/route.ts` +
  `src/app/api/webhook/route.ts`. ¿El monto se fija server-side (`PLAN_PRICES`) y
  NO se confía en un precio del cliente? ¿El webhook verifica la firma de Stripe?
  ¿Es idempotente (doble webhook = un solo contrato/email)? ¿El `pending→paid`
  no se puede forzar desde el cliente?
- **Folio único bajo carrera.** Nueva lógica `CÓDIGO-AÑO-DDMM-secuencia`
  (`generateFolio` + `getFolioPrefix` en `stripe.ts`, secuencia en checkout).
  Hipótesis a probar: dos checkouts del mismo estado, mismo día, casi simultáneos
  → ¿pueden obtener la misma secuencia entre el `count` y el insert? Hay retry de
  5 intentos, ¿es suficiente o la ventana sigue abierta? ¿El `UNIQUE(folio)` de
  la tabla es la última línea de defensa y el error se maneja ANTES de cobrar?
- **Inyección / XSS.** `/api/contact`, `/api/lead`, `/api/waitlist`. ¿Entradas
  escapadas antes de ir a email/DB? ¿`additional_clauses` del contrato (texto
  libre del usuario) se renderiza sin sanitizar en la plantilla o el PDF?
- **Secretos.** ¿Alguna `SUPABASE_SERVICE_ROLE_KEY` / `STRIPE_SECRET_KEY` /
  `META_ACCESS_TOKEN` referenciada en código cliente (`"use client"`) o expuesta
  vía `NEXT_PUBLIC_*`? Grep de claves sensibles en bundles de cliente.
- **/admin.** `src/proxy.ts` Basic Auth. ¿Protege TODAS las rutas `/admin/*`
  incluyendo API? ¿Timing-safe la comparación? ¿`/sandbox` bloqueado en prod?
- **CORS.** ¿`/api/*` restringido al origen propio, no `*`?

---

## Track 2 — Backend / API / Datos (P0-P1)

Archivos: `src/app/api/**`, `src/lib/{stripe,email,cronTasks,weeklyReport}.ts`,
`src/lib/supabase*.ts`.

Checks:
- **Errores de DB nunca silenciosos.** Todo `.insert/.update/.select` de Supabase:
  ¿se captura `{ error }`? Foco en checkout (insert antes de exponer `session.url`)
  y webhook (update de 0 filas no truena en Supabase — ¿se detecta?).
- **Money math.** `monto_pagado` en centavos, `monto_renta` en pesos. ¿Alguna
  suma/formato mezcla unidades? ¿Ingreso del admin = suma real de `monto_pagado`,
  no `count × 499`? ¿Redondeos que pierdan centavos?
- **Cron.** `/api/cron/daily` (único, Vercel Hobby máx 2). ¿`CRON_SECRET`
  verificado? ¿El reporte semanal dispara solo lunes (`getUTCDay()===1`) — zona
  horaria correcta (UTC vs México puede correr el "lunes")? ¿recover-pending y
  review-request no re-envían al mismo contrato dos veces (idempotencia)?
- **Email.** `src/lib/email.ts`. ¿`replyTo: hola@renters.mx` en los 5 envíos?
  ¿Falla de Resend se propaga o se traga? ¿HTML de email escapa nombres del
  usuario?
- **PDF en prod.** `/api/pdf` + `next.config.ts` `outputFileTracingIncludes`.
  ¿El binario de `@sparticuz/chromium` se incluye en el bundle de Vercel o el
  endpoint cae al fallback `/imprimir`? (bug histórico).
- **Validación server-side de checkout.** `validateContractForCheckout`. ¿Campos
  obligatorios completos? ¿INE/CLABE solo saltables con su flag `*_pending`?
  ¿`property.address.state` se persiste (bug histórico que bloqueaba TODOS los
  checkouts)?

---

## Track 3 — Frontend / Tecnología (P1-P2)

Archivos: `src/components/**`, `src/store/useContractStore.ts`,
`src/app/**/page.tsx`, `next.config.ts`.

Checks:
- **Next.js 16 (breaking changes).** Leer `node_modules/next/dist/docs/` ante la
  duda. ¿`async` params/searchParams manejados con await? ¿`"use client"` solo
  donde hace falta? ¿Server/client boundary correcto (no importar server-only en
  cliente)?
- **Zustand persist.** Key `renters-contract-storage`. Bug histórico: estado
  persistido con `currentStep` alto hace que efectos step-specific no corran.
  ¿Hay lógica que asuma montaje en cierto paso? ¿Datos sensibles (INE, CLABE)
  quedan en localStorage tras pagar sin `resetContract()`?
- **Hidratación.** ¿Algún componente lee `localStorage`/`window`/`Date.now()` en
  render inicial y causa mismatch server/client?
- **framer-motion perf.** `ProcessScrollytelling`, `HeroSection`, `Reveal`,
  `BackgroundBlobs`, `CountUp`. ¿Solo animan `transform`/`opacity`? ¿Respetan
  `prefers-reduced-motion` (fallback estático)? ¿`useScroll`/loops se limpian?
  ¿`CountUp` cancela su `requestAnimationFrame` en unmount?
- **Fuente única de estados.** `src/lib/states.ts`. Verificar que NO reaparezcan
  arrays de estados duplicados (bug recurrente). Grep de listas hardcodeadas de
  estados fuera de `states.ts`.
- **Dead code.** Componentes huérfanos (`StepByStepSection`, ¿otros?). No rompen,
  pero reportar para limpieza.

---

## Track 4 — UX / UI / Accesibilidad (P1-P2)

Aplicar la skill `ui-ux-pro-max` (Quick Reference §1-§8). Archivos: todo
`src/components/**` con interacción, los `page.tsx`.

Checks:
- **Estados de formulario (generador 7 pasos).** ¿Labels visibles (no
  placeholder-only)? ¿Errores junto al campo? ¿Botón de submit deshabilitado +
  spinner durante async? ¿Validación en blur, no en cada tecla?
- **Responsive.** Probar 375 / 768 / 1440. ¿Sin scroll horizontal? ¿Touch targets
  ≥44px (el botón "Guardar" del generador tuvo bug de caerse fuera del box en
  S24 Ultra)? ¿El teléfono sticky del scrollytelling no rompe en mobile?
- **Contraste AA.** Texto sobre el hero dark `#0a0f1c`, texto sobre imágenes de
  StateCards. ≥4.5:1.
- **Loading/empty/error.** `/success` — bug histórico: polling infinito si el
  webhook nunca llega. ¿Hay tope de reintentos + mensaje de fallback? ¿Estados
  vacíos en admin (0 ventas) se ven bien?
- **reduced-motion end-to-end.** Con la preferencia activa, ¿home y /como-funciona
  se ven estáticos y legibles, sin scroll-jacking?
- **Navegación.** ¿Estado activo del navbar correcto? ¿Links muertos? (FaqSection
  tuvo 2 botones sin acción). ¿Foco tras cambio de ruta?

---

## Track 5 — Integridad legal del contrato (P0 específico del dominio)

**Único al negocio: un contrato con la cláusula/estado equivocado es un producto
defectuoso vendido.** Archivos: `src/components/generator/templates/*` (6
plantillas), `getStateTemplate.tsx`, `ContractPreview.tsx`, `src/lib/states.ts`.

Checks:
- **Cada estado carga SU plantilla.** ¿`getStateTemplate` mapea los 6 estados
  correctamente y el `default` (Nuevo León) nunca se sirve por error a otro
  estado? (bug histórico: 3 estados caían a Nuevo León).
- **Citas legales por estado.** ¿Cada plantilla cita el Código Civil correcto y
  los artículos correctos (ej. Coahuila: derecho del tanto arts. 2708-2710,
  jurisdicción Saltillo)? ¿Ninguna plantilla quedó con el texto de otro estado
  por copy-paste?
- **Mérida = Yucatán.** `legalName` difiere del `name`. ¿El contrato usa
  `getLegalStateName` (Yucatán) en el texto legal y `getStateName` (Mérida) en
  UI? Verificar que no se cruce.
- **Folio en documento.** `ContractPreview.tsx` — ¿usa `getStateCode()` (bug
  recién arreglado: usaba `substring(0,2)`, "NU" en vez de "NL")? ¿El código del
  preview coincide con el folio real que genera checkout?
- **Paywall.** Preview trunca tras cláusula CUARTA. ¿Las cláusulas bloqueadas NO
  existen en el DOM del navegador sin pago (no solo ocultas con CSS)?
- **Campos pendientes.** INE/CLABE marcados "pendiente para firma" → ¿la plantilla
  imprime líneas en blanco correctas, no `undefined` ni datos de otro contrato?

---

## Track 6 — Build / Deploy / Config (P1-P2)

Archivos: `next.config.ts`, `vercel.json`/crons, `package.json`, `src/proxy.ts`,
`sitemap.ts`, `robots.txt`, `layout.tsx` (metadata).

Checks:
- `npx tsc --noEmit` y `npm run build` limpios (ignorar el warning conocido
  "Failed to load dynamic font for ✓" del opengraph-image).
- **Vercel Hobby: máx 2 crons.** ¿Cuántos crons declarados? (debe ser 1).
- **SEO.** ¿`sitemap.ts` incluye los 6 estados? ¿`generateStaticParams` de
  `/estado/[slug]` cubre los disponibles? ¿metadata/OG sin listas de estados
  desfasadas? ¿JSON-LD válido?
- **Env vars.** ¿Alguna referencia a env var no documentada en PROJECT_MAP?
  ¿Defaults peligrosos (ej. `NEXT_PUBLIC_APP_URL` cayendo a localhost en prod)?

---

## Formato de salida (obligatorio)

Un reporte único, findings ordenados por severidad (P0 arriba). Por finding:

```
### [P0|P1|P2|P3] <título corto>
- **Archivo:** ruta:línea
- **Track:** 1-6
- **Bug:** qué está mal (1-2 frases)
- **Ruta de fallo:** inputs/estado concretos → resultado incorrecto observable
- **Veredicto:** CONFIRMADO | DUDOSO
- **Fix propuesto:** 1 frase (NO aplicar aún; solo describir)
```

Cierre del reporte:
- Tabla resumen: conteo por severidad.
- Los 3 findings que arreglaría primero y por qué.
- Confirmar que `tsc`/`build` siguen verdes tras la auditoría (no se tocó código).

**Regla de honestidad:** cero findings inventados. Si un track sale limpio, dilo.
Un DUDOSO bien explicado vale más que un CONFIRMADO falso.
