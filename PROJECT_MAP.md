# Mapa del Proyecto — contratos.renters.mx

Generador de contratos de arrendamiento. SPA Next.js. Usuario elige estado →
llena formulario (7 pasos) → paga $499 MXN (Stripe) → recibe PDF legal.
Side-business de Renters.mx (empresa madre, vende pólizas jurídicas en NL).

## Stack
Next.js 16.2.6 (App Router, Turbopack) · React 19 · Tailwind v4 · Zustand 5
(persist) · framer-motion 12 · Stripe (live) · Supabase · Resend · puppeteer-core
+ @sparticuz/chromium (PDF). Deploy: Vercel (Hobby, team `abrahamgarzasolis-7575s-projects`,
proyecto `contratos-renters`). Dominio: contratos.renters.mx.

## Supabase — UN SOLO proyecto
`vjgemxbrlgacjemunbys` (org "Renters.mx ORG."). NO confundir: hubo un huérfano
`dcnmrpcifsvskkozxwyz` ya borrado. El MCP de Supabase de esta cuenta ya apunta
al correcto — se pueden correr queries directas (execute_sql).
Tablas: `contratos` (contract_data JSONB + columnas planas + monto_pagado centavos),
`waitlist` (CDMX/Edomex), `leads` (captura temprana), `funnel_events`
(session_id+step, UNIQUE(session_id,step)). Todas con RLS on, service_role bypassa.

## Rutas / archivos clave
- `src/app/contrato/page.tsx` — el generador (ContractEngine + ContractPreview)
- `src/components/generator/ContractEngine.tsx` — wizard 7 pasos, tracking, sincroniza address.state
- `src/components/generator/steps/` — StateStep, PropertyStep, LandlordStep, TenantStep, TermsStep, LegalStep, SummaryStep
- `src/components/generator/templates/` — 6 plantillas legales (NuevoLeon/Jalisco/Queretaro/Merida/SanLuisPotosi/Coahuila) + getStateTemplate + pendingFields
- `src/store/useContractStore.ts` — Zustand (persist key `renters-contract-storage`)
- `src/lib/states.ts` — fuente única de estados (name/legalName/code/available)
- `src/lib/stripe.ts` — PLAN_PRICES (solo `basico` 49900), generateFolio
  (formato `CÓDIGO-AÑO-DDMM-secuencia`, ej. `COAH-2026-1807-1` = 1er contrato
  de Coahuila ese día; secuencia calculada en checkout/route.ts contando
  folios existentes con ese prefijo + retry ante carrera)
- `src/lib/email.ts` — Resend; FROM contratos@contratos.renters.mx, replyTo hola@renters.mx
- `src/lib/weeklyReport.ts` + `src/lib/cronTasks.ts` — lógica de crons
- `src/proxy.ts` — Basic Auth /admin, CORS /api, bloqueo /sandbox

## API (`src/app/api/`)
checkout (crea sesión Stripe + insert; valida campos server-side), webhook
(pending→paid idempotente + notif venta + entrega), pdf (Chromium headless),
download, contact, lead, waitlist, track-step, cron/daily (único cron:
recover-pending + review-request + reporte semanal lunes).

## Admin (`/admin`, Basic Auth)
5 pestañas: Visión General, Transacciones, Contratos (+editor `[id]`),
Embudo (`funnel`), Lista de Espera, Ajustes.

## Env vars (Vercel prod)
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_SUPABASE_URL/ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NEXT_PUBLIC_APP_URL, ADMIN_USER/PASSWORD,
CRON_SECRET, NEXT_PUBLIC_META_PIXEL_ID=3112545048883151, NEXT_PUBLIC_GA_ID=G-CCNTXSB8SF,
SALE_NOTIFICATION_EMAIL=abrahamgarza.solis@gmail.com (también recibe reporte semanal).
REPORT_EMAIL (opcional — destino del reporte semanal; si falta, cae a
SALE_NOTIFICATION_EMAIL). NEXT_PUBLIC_APP_URL es obligatoria en prod: las rutas
checkout/pdf/download ahora fallan ruidosamente si falta (antes caían a localhost).

## Feature: INE/CLABE opcional
INE arrendador/inquilino y datos bancarios pueden marcarse "pendiente para firma"
(flags `id_number_pending`, `bank_details_pending`). Checkout valida server-side:
obligatorios estado/dirección/nombres/emails/teléfonos/domicilio/renta/depósito/
duración/fecha/día pago; INE/CLABE solo saltables con su flag.

## Convenciones
- Push a `main` = deploy auto a producción (Stripe LIVE, clientes reales). Confirmar antes.
- Cambios de esquema Supabase: correr SQL en dashboard del proyecto correcto (el usuario los corre).
- Verificar en prod tras deploy (curl/Chrome MCP). Typecheck+build antes de commit.
- Vercel Hobby: máx 2 crons (hoy usa 1). CLI sin login persistente.

## Hecho (2026-07-17): scrollytelling /como-funciona
`StepByStepSection` (fotos stock) reemplazado por
`src/components/como-funciona/ProcessScrollytelling.tsx`. Desktop (≥1024px):
teléfono sticky + 4 pantallazos reales del generador en crossfade + barra de
progreso vertical `#4D6BFE`, ligada a `useScroll`. Móvil: apilado con
`whileInView` fade-in, sin sticky. `useReducedMotion` → estático. Assets en
`public/images/como-funciona/paso-{1..4}.png` (capturados con Puppeteer +
store de Zustand seedeado, ver git log — script no se conservó en el repo).
Spec: `docs/superpowers/specs/2026-07-17-como-funciona-scrollytelling-design.md`
(sección "Estado" al final documenta bug encontrado/arreglado).
Bug de paso encontrado en el camino: `CheckoutModal.tsx` mostraba el slug crudo
(`NUEVO-LEON`) en vez de `getStateName()` → corregido.
Verificado en Chrome headless a 1440px/375px + reduced-motion, build limpio.

## Hecho (2026-07-18): agregar estado Coahuila de Zaragoza
6º estado activo. `src/lib/states.ts` es la fuente única — agregar un estado
ahí auto-conecta dropdown del generador, `sitemap.ts`, página `/estado/[slug]`
completa (hero+beneficios+FAQ+JSON-LD) y `generateFolio` (prefijo `COAH-`).
Nuevo `CoahuilaTemplate.tsx` (mismo patrón condensado que Querétaro/SLP) con
citas legales reales: Código Civil de Coahuila de Zaragoza, derecho del tanto
(arts. 2708-2710), jurisdicción Tribunales de Saltillo.
**Deuda técnica encontrada y corregida:** había 7 archivos con listas de
estados hardcodeadas en copy (no leían de `states.ts`) — `layout.tsx`,
`terminos/page.tsx`, `FaqSection.tsx`, `FaqEngine.tsx`,
`ProcessScrollytelling.tsx`, y 2 arrays **duplicados** de `STATES` en
`HeroSection.tsx` y `StateCards.tsx` (ahora ambos derivan de `STATES` —
el próximo estado que se agregue no debería volver a arrastrar esto).
También arreglado: `ContractPreview.tsx` mostraba folio con
`state.substring(0,2)` en vez de `getStateCode()` (ej. Nuevo León mostraba
"NU-" no "NL-") — bug preexistente en los 6 estados, no solo Coahuila.
SQL: no se necesitó migración — `contratos.estado` es `TEXT` libre, sin CHECK
constraint/enum.
Imagen `public/images/states/coahuila.png`: recortada de un mockup que el
usuario pasó (tenía texto de card "horneado" en la foto — se recortó con
PIL para dejar solo la foto, sin duplicar el texto que ya pone StateCards.tsx).
