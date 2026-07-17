-- Ejecutar en Supabase SQL Editor (proyecto "renters.mkt@gmail.com's Project", ref vjgemxbrlgacjemunbys)
--
-- Drop-off del generador: registra qué paso alcanzó cada sesión anónima de
-- navegador. session_id es un UUID aleatorio guardado en el localStorage del
-- visitante — no hay datos personales. UNIQUE(session_id, step) hace que cada
-- sesión cuente una sola vez por paso, así COUNT por step = sesiones que
-- llegaron a ese paso.

CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  step INTEGER NOT NULL,
  estado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, step)
);

CREATE INDEX IF NOT EXISTS funnel_events_step_idx ON funnel_events(step);
CREATE INDEX IF NOT EXISTS funnel_events_created_at_idx ON funnel_events(created_at);

ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON funnel_events FROM anon, authenticated;
