import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendContractEmailParams {
  toEmail: string;
  toName: string;
  folio: string;
  estado: string;
  downloadUrl: string;
}

export async function sendContractEmail(params: SendContractEmailParams) {
  const { toEmail, toName, folio, estado, downloadUrl } = params;

  const estadoLabel: Record<string, string> = {
    'nuevo-leon': 'Nuevo León',
    jalisco: 'Jalisco',
    cdmx: 'Ciudad de México',
    edomex: 'Estado de México',
  };

  await transporter.sendMail({
    from: `"Renters.mx — Contratos" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    bcc: process.env.GMAIL_USER, // copia de respaldo a la marca
    subject: `Tu contrato está listo — Folio ${folio}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          ¡Tu contrato está listo!
        </h1>
        <p style="color: #64748b; margin-bottom: 24px;">
          Hola ${toName}, tu contrato de arrendamiento para <strong>${estadoLabel[estado] || estado}</strong> ha sido generado exitosamente.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Folio Digital</p>
          <p style="margin: 0; font-size: 18px; font-weight: 900; color: #0f172a; font-family: monospace;">${folio}</p>
        </div>

        <a href="${downloadUrl}"
           style="display: inline-block; background: #4F46E5; color: white; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 16px; margin-bottom: 24px;">
          Descargar Contrato PDF
        </a>

        <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
          Si tienes problemas para descargar tu contrato, responde este correo y te ayudamos en menos de 24 horas.
          <br/><br/>
          — Equipo Renters.mx
        </p>
      </div>
    `,
  });
}
