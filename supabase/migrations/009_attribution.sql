-- Proyecto Supabase vjgemxbrlgacjemunbys (ver 004_leads.sql).
-- attribution: utm, click ids, referrer y origen previo en renters.mx (ref_*) del
--   primer toque (ver src/lib/attribution.ts).
-- client_context: ip, user agent, fbp y fbc del checkout; solo sirve para enviar el
--   Purchase a la API de Conversiones de Meta. Es dato personal: se borra a los 90
--   días (runPurgeClientContext, en el cron diario) y debe mencionarse en el aviso
--   de privacidad.
-- RLS ya está activado en ambas tablas (002_enable_rls.sql, 004_leads.sql).
-- Aditiva: aplicarla ANTES de desplegar el código que escribe estas columnas.

ALTER TABLE contratos ADD COLUMN IF NOT EXISTS attribution JSONB;
ALTER TABLE contratos ADD COLUMN IF NOT EXISTS client_context JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS attribution JSONB;
