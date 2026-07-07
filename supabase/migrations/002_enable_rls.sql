-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/vjgemxbrlgacjemunbys/sql
--
-- Toda la app accede a `contratos` exclusivamente vía supabaseAdmin (service_role),
-- que SIEMPRE bypassa RLS. El cliente anon (NEXT_PUBLIC_SUPABASE_ANON_KEY) está
-- expuesto en el browser y hoy no tiene RLS de por medio: cualquiera puede leer
-- la tabla completa vía REST (PostgREST) usando esa key pública.
--
-- Esto activa RLS sin policies = deny-by-default para anon/authenticated.
-- service_role sigue funcionando sin cambios.

ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;

-- (Opcional, recomendado) bloquea explícitamente incluso si algún día se
-- otorgan privilegios de tabla a anon/authenticated por error.
REVOKE ALL ON contratos FROM anon, authenticated;
