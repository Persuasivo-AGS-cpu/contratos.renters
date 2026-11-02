-- Vigencia del enlace al contrato (90 días, ver src/lib/token.ts).
-- pdf_token_issued_at: cuándo se emitió el token vigente. Lo escribe el webhook al
-- cobrar y /api/reenviar-enlace al rotar el token. Las filas anteriores quedan en
-- NULL y su vigencia se cuenta desde paid_at (tokenFreshFilter), así que no hace
-- falta rellenar nada. Migración aditiva: aplicarla ANTES de desplegar el código.
ALTER TABLE contratos ADD COLUMN IF NOT EXISTS pdf_token_issued_at TIMESTAMPTZ;
