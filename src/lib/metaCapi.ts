import { createHash } from 'node:crypto';

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
  if (input.context?.ip) user_data.client_ip_address = input.context.ip;
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
