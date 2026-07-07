import { Resend } from "resend";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, escapeHtml } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

// Máx 3 mensajes por IP por 10 minutos
const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FIELD = 200;
const MAX_MESSAGE = 5000;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit("contact", ip, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en unos minutos." }, { status: 429 });
  }

  try {
    const { nombre, correo, motivo, mensaje } = await req.json();

    if (!nombre || !correo || !mensaje) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    if (
      typeof nombre !== "string" || typeof correo !== "string" ||
      typeof mensaje !== "string" || (motivo && typeof motivo !== "string") ||
      nombre.length > MAX_FIELD || correo.length > MAX_FIELD ||
      (motivo?.length ?? 0) > MAX_FIELD || mensaje.length > MAX_MESSAGE
    ) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const safeNombre = escapeHtml(nombre);
    const safeCorreo = escapeHtml(correo);
    const safeMotivo = escapeHtml(motivo || "Sin motivo");
    const safeMensaje = escapeHtml(mensaje);

    await resend.emails.send({
      from: "Renters Contratos <contacto@contratos.renters.mx>",
      to: "hola@renters.mx",
      replyTo: correo,
      subject: `[Contacto] ${safeMotivo} — ${safeNombre}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${safeNombre}</p>
        <p><strong>Correo:</strong> ${safeCorreo}</p>
        <p><strong>Motivo:</strong> ${safeMotivo}</p>
        <hr/>
        <p><strong>Mensaje:</strong></p>
        <p>${safeMensaje.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 });
  }
}
