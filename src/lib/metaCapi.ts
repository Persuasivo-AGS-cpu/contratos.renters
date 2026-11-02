import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

// Verificar la versión vigente en https://developers.facebook.com/docs/graph-api/changelog
// antes de desplegar; META_GRAPH_VERSION permite cambiarla sin tocar el código.
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v24.0';

export function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export type CapiContext = { ip?: string; ua?: string; fbp?: string; fbc?: string };

export type PurchaseInput = {
  folio: string;
  amountCentavos: number | null;
  email?: string | null;
  eventTime: number; // segundos Unix
  sourceUrl: string;
  context?: CapiContext | null;
};

export const CONTRACT_CONTENT_NAME = 'Contrato de arrendamiento';

export function buildPurchaseEvent(input: PurchaseInput) {
  const user_data: Record<string, unknown> = {};
  if (input.email) user_data.em = [sha256(input.email)];
  // getClientIp devuelve 'unknown' sin x-forwarded-for; Meta rechaza (400) una IP que no lo es.
  if (input.context?.ip && isIP(input.context.ip)) user_data.client_ip_address = input.context.ip;
  if (input.context?.ua) user_data.client_user_agent = input.context.ua;
  if (input.context?.fbp) user_data.fbp = input.context.fbp;
  if (input.context?.fbc) user_data.fbc = input.context.fbc;

  return {
    event_name: 'Purchase',
    event_time: input.eventTime,
    event_id: input.folio, // el navegador usa el mismo folio: Meta deduplica
    action_source: 'website',
    event_source_url: input.sourceUrl,
    user_data,
    // El Pixel es compartido con la póliza y la investigación: content_name
    // distingue las compras de contratos.
    custom_data: {
      currency: 'MXN',
      value: (input.amountCentavos ?? 0) / 100,
      content_name: CONTRACT_CONTENT_NAME,
      content_type: 'product',
    },
  };
}

export async function sendPurchase(input: PurchaseInput): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.warn('[capi] falta NEXT_PUBLIC_META_PIXEL_ID o META_CAPI_ACCESS_TOKEN: Purchase no enviado');
    return;
  }

  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // El token va en el cuerpo, no en la URL, para que no aparezca en logs.
    body: JSON.stringify({
      data: [buildPurchaseEvent(input)],
      access_token: token,
      ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) console.error('[capi] Meta respondió', res.status, await res.text());
}

// Código de la pestaña "Probar eventos" de Meta (p. ej. TEST12345). Sin código válido no se envía nada:
// un Purchase de prueba sin él quedaría como venta real en las métricas.
export const TEST_EVENT_CODE_RE = /^TEST[A-Z0-9]{3,20}$/i;

export type TestResult = { ok: boolean; mensaje: string };

export async function sendTestPurchase(testEventCode: string): Promise<TestResult> {
  const code = testEventCode.trim();
  if (!TEST_EVENT_CODE_RE.test(code)) {
    return { ok: false, mensaje: 'Código de prueba inválido. Cópialo de Meta → Probar eventos (empieza con TEST).' };
  }
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return { ok: false, mensaje: 'Falta NEXT_PUBLIC_META_PIXEL_ID o META_CAPI_ACCESS_TOKEN en Vercel.' };
  }

  const event = buildPurchaseEvent({
    folio: `PRUEBA-CAPI-${Date.now()}`,
    amountCentavos: 49900,
    eventTime: Math.floor(Date.now() / 1000),
    sourceUrl: 'https://contratos.renters.mx/admin/ajustes',
    // Meta rechaza (400 Invalid parameter) un evento sin ningún dato de usuario.
    email: 'prueba-capi@renters.mx',
    // Meta pide IP y user agent en eventos de sitio web; 203.0.113.0/24 es un rango reservado para documentación.
    context: { ip: '203.0.113.10', ua: 'Renters admin (prueba CAPI)' },
  });

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event], access_token: token, test_event_code: code }),
      signal: AbortSignal.timeout(8000),
    });
    const body = (await res.json().catch(() => ({}))) as {
      events_received?: number;
      error?: { message?: string; error_user_msg?: string; error_subcode?: number };
    };
    if (!res.ok) {
      const e = body.error;
      const detalle = [e?.message ?? 'sin detalle', e?.error_user_msg, e?.error_subcode ? `subcódigo ${e.error_subcode}` : null]
        .filter(Boolean)
        .join(' · ');
      return { ok: false, mensaje: `Meta respondió ${res.status}: ${detalle}` };
    }
    return {
      ok: (body.events_received ?? 0) > 0,
      mensaje: `Meta recibió ${body.events_received ?? 0} evento(s). Revísalo en Probar eventos (folio ${event.event_id}).`,
    };
  } catch (err) {
    return { ok: false, mensaje: `No se pudo contactar a Meta: ${err instanceof Error ? err.message : 'error desconocido'}` };
  }
}
