-- Ejecutar en Supabase SQL Editor (proyecto vjgemxbrlgacjemunbys)
--
-- Test A/B /contrato vs /contrato-b (src/proxy.ts, hoy apagado con
-- AB_TEST_CONTRATO_B_ENABLED=false): sin esta columna, el drop-off de
-- ambas variantes se mezcla en la misma fila por (session_id, step) y
-- no se puede comparar A vs. B en el panel /admin/funnel.
-- NULL = tráfico de antes de este cambio o de fuera del experimento.

ALTER TABLE funnel_events ADD COLUMN IF NOT EXISTS variant TEXT;

CREATE INDEX IF NOT EXISTS funnel_events_variant_idx ON funnel_events(variant);
