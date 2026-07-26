-- Ejecutar en Supabase SQL Editor (proyecto vjgemxbrlgacjemunbys), junto con
-- 006_funnel_events_variant.sql.
--
-- El drop-off por paso (funnel_events.variant) no basta para decidir un
-- ganador del test A/B — la métrica real es conversión a pago. Sin esta
-- columna no se puede saber si un contrato pagado vino de /contrato o
-- /contrato-b. NULL = tráfico de antes de este cambio o fuera del experimento.

ALTER TABLE contratos ADD COLUMN IF NOT EXISTS variant TEXT;

CREATE INDEX IF NOT EXISTS contratos_variant_idx ON contratos(variant);
