-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/vjgemxbrlgacjemunbys/sql

-- 1. Lista de espera para estados no disponibles (CDMX, Edomex)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  estado TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (email, estado)
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON waitlist FROM anon, authenticated;

-- 2. Monto real cobrado (centavos MXN, desde session.amount_total de Stripe).
--    El dashboard de admin suma esta columna en vez de count * precio-hardcodeado.
ALTER TABLE contratos ADD COLUMN IF NOT EXISTS monto_pagado INTEGER;

-- Backfill de pagados existentes: todos fueron plan básico $499
UPDATE contratos SET monto_pagado = 49900 WHERE status = 'paid' AND monto_pagado IS NULL;
