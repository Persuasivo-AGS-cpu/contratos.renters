-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/vjgemxbrlgacjemunbys/sql
-- (proyecto "renters.mkt@gmail.com's Project" — org Renters.mx)

-- Captura temprana de email en el paso 1 del generador. Un lead que abandona
-- antes del checkout no existe en `contratos`; esta tabla lo hace recuperable.
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  estado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON leads FROM anon, authenticated;
