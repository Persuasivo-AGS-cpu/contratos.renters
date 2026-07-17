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
- `src/components/generator/templates/` — 5 plantillas legales (NuevoLeon/Jalisco/Queretaro/Merida/SanLuisPotosi) + getStateTemplate + pendingFields
- `src/store/useContractStore.ts` — Zustand (persist key `renters-contract-storage`)
- `src/lib/states.ts` — fuente única de estados (name/legalName/code/available)
- `src/lib/stripe.ts` — PLAN_PRICES (solo `basico` 49900), generateFolio
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

## En progreso (2026-07-17)
Rediseño de `/como-funciona`: reemplazar `StepByStepSection` por scrollytelling
(teléfono sticky + pantallazos reales del generador que cruzan por scroll, barra
progreso azul, móvil apilado con fade-in). Spec en
`docs/superpowers/specs/2026-07-17-como-funciona-scrollytelling-design.md`.
Falta: capturar 4 pantallazos móviles del generador + construir componente
`ProcessScrollytelling.tsx` con framer-motion (respetar prefers-reduced-motion).
