import { Resend } from 'resend';
import { getStateName } from './states';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Renters.mx <contratos@contratos.renters.mx>';

interface SendContractEmailParams {
  toEmail: string;
  toName: string;
  folio: string;
  estado: string;
  downloadUrl: string;
}

export async function sendContractEmail(params: SendContractEmailParams) {
  const { toEmail, toName, folio, estado, downloadUrl } = params;

  const { error } = await resend.emails.send({
    from: FROM,
    to: toEmail,
    bcc: 'renters.mx@gmail.com',
    subject: `Tu contrato está listo — Folio ${folio}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          ¡Tu contrato está listo!
        </h1>
        <p style="color: #64748b; margin-bottom: 24px;">
          Hola ${toName}, tu contrato de arrendamiento para
          <strong>${getStateName(estado)}</strong>
          ha sido generado y pagado exitosamente.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 6px; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Folio Digital</p>
          <p style="margin: 0; font-size: 20px; font-weight: 900; color: #0f172a; font-family: monospace;">${folio}</p>
        </div>

        <a href="${downloadUrl}"
           style="display: inline-block; background: #4F46E5; color: #fff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 16px; margin-bottom: 24px;">
          Descargar Contrato PDF
        </a>

        <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; line-height: 1.6;">
          Si tienes problemas para descargar tu contrato, responde este correo y te ayudamos en menos de 24 horas.<br/><br/>
          — Equipo Renters.mx
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

interface SendRecoveryEmailParams {
  toEmail: string;
  toName: string;
  folio: string;
  estado: string;
}

interface SendSaleNotificationParams {
  folio: string;
  estado: string;
  montoCentavos: number | null;
  arrendadorNombre: string | null;
  arrendadorEmail: string | null;
}

// Reporte interno (embudo/ventas semanales). El endpoint arma el HTML; esta
// función solo lo envía. Destino: REPORT_EMAIL, luego SALE_NOTIFICATION_EMAIL.
export async function sendReportEmail(subject: string, html: string) {
  const to =
    process.env.REPORT_EMAIL ||
    process.env.SALE_NOTIFICATION_EMAIL ||
    'renters.mx@gmail.com';

  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

// Notificación interna al dueño en cada venta pagada. Destino configurable con
// SALE_NOTIFICATION_EMAIL; por defecto el correo del negocio.
export async function sendSaleNotification(params: SendSaleNotificationParams) {
  const { folio, estado, montoCentavos, arrendadorNombre, arrendadorEmail } = params;
  const to = process.env.SALE_NOTIFICATION_EMAIL || 'renters.mx@gmail.com';
  const monto = ((montoCentavos ?? 49900) / 100).toLocaleString('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
  });

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `💰 Nueva venta ${monto} — ${folio}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <h1 style="font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 16px;">
          💰 Nueva venta confirmada
        </h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #334155;">
          <tr><td style="padding: 8px 0; color: #94a3b8;">Monto</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${monto} MXN</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Folio</td><td style="padding: 8px 0; font-family: monospace; text-align: right;">${folio}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Estado</td><td style="padding: 8px 0; text-align: right;">${getStateName(estado)}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Cliente</td><td style="padding: 8px 0; text-align: right;">${arrendadorNombre || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Correo</td><td style="padding: 8px 0; text-align: right;">${arrendadorEmail || '—'}</td></tr>
        </table>
        <a href="https://contratos.renters.mx/admin/contratos"
           style="display: inline-block; margin-top: 24px; background: #0f172a; color: #fff; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px;">
          Ver en el panel
        </a>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

interface SendReviewRequestEmailParams {
  toEmail: string;
  toName: string;
  folio: string;
}

// Día 3-4 post-pago: pedir reseña. Las respuestas alimentan testimonios
// reales con consentimiento (los actuales del sitio no son verificables y
// son riesgo de compliance en pauta).
export async function sendReviewRequestEmail(params: SendReviewRequestEmailParams) {
  const { toEmail, toName, folio } = params;

  const { error } = await resend.emails.send({
    from: FROM,
    to: toEmail,
    bcc: 'renters.mx@gmail.com',
    subject: '¿Cómo te fue con tu contrato? — 1 minuto',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <h1 style="font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          ¿Cómo te fue, ${toName}?
        </h1>
        <p style="color: #64748b; margin-bottom: 20px; line-height: 1.6;">
          Hace unos días generaste tu contrato de arrendamiento con nosotros (folio ${folio}).
          ¿Nos cuentas en una línea cómo fue tu experiencia? Responde directamente este correo.
        </p>
        <p style="color: #64748b; margin-bottom: 20px; line-height: 1.6;">
          Tu opinión nos ayuda a mejorar — y si nos das permiso, nos encantaría
          compartirla para que otros propietarios se animen a proteger su patrimonio.
        </p>
        <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
          — Equipo Renters.mx
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

// Recuperación de checkout abandonado: el formulario quedó completo pero el
// pago no se realizó. Los datos siguen en el localStorage del navegador del
// usuario, así que el CTA lo regresa al generador.
export async function sendRecoveryEmail(params: SendRecoveryEmailParams) {
  const { toEmail, toName, folio, estado } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contratos.renters.mx';

  const { error } = await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Tu contrato de arrendamiento quedó a un paso — ${getStateName(estado)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          Tu contrato quedó guardado
        </h1>
        <p style="color: #64748b; margin-bottom: 24px;">
          Hola ${toName}, completaste todos los datos de tu contrato de arrendamiento para
          <strong>${getStateName(estado)}</strong> (folio ${folio}), pero el pago no se concretó.
          Tu información sigue guardada en tu navegador: solo falta el último paso.
        </p>

        <a href="${appUrl}/contrato"
           style="display: inline-block; background: #4F46E5; color: #fff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 16px; margin-bottom: 24px;">
          Completar mi contrato
        </a>

        <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; line-height: 1.6;">
          Si tuviste algún problema con el pago o tienes dudas, responde este correo y te ayudamos.<br/><br/>
          — Equipo Renters.mx
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
