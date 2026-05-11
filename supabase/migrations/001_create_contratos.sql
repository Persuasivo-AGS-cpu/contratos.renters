-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/vjgemxbrlgacjemunbys/sql

CREATE TABLE IF NOT EXISTS contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT UNIQUE NOT NULL,
  estado TEXT NOT NULL,
  tipo_propiedad TEXT,
  arrendador_nombre TEXT,
  arrendador_email TEXT,
  inquilino_nombre TEXT,
  inquilino_email TEXT,
  monto_renta NUMERIC,
  deposito NUMERIC,
  duracion_meses INTEGER,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_id TEXT,
  pdf_token UUID UNIQUE DEFAULT gen_random_uuid(),
  contract_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS contratos_stripe_session_id_idx ON contratos(stripe_session_id);
CREATE INDEX IF NOT EXISTS contratos_pdf_token_idx ON contratos(pdf_token);
CREATE INDEX IF NOT EXISTS contratos_arrendador_email_idx ON contratos(arrendador_email);
CREATE INDEX IF NOT EXISTS contratos_inquilino_email_idx ON contratos(inquilino_email);
