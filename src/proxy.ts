import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://contratos.renters.mx',
].filter((v): v is string => Boolean(v));

function isAuthenticated(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return false;

  if (!ADMIN_USER || !ADMIN_PASS) return false;
  const base64 = authHeader.slice(6);
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

// Stripe llama /api/webhook server-to-server (sin Origin de browser);
// la firma de Stripe ya lo autentica, así que no se valida Origin aquí.
function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get('origin') ?? req.headers.get('referer');
  if (!origin) return true; // llamadas no-browser (curl, server-to-server)
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/webhook')) {
    if (!isOriginAllowed(req)) {
      return NextResponse.json({ error: 'Origin no permitido' }, { status: 403 });
    }
  }

  // Los iconos del panel (favicon / apple-touch-icon) deben ser públicos para
  // que el navegador los cargue al instalar /admin como web app. No son datos
  // sensibles y no exponen contenido del panel.
  const isAdminIcon = pathname === '/admin/icon' || pathname === '/admin/apple-icon';

  // Proteger /admin con Basic Auth
  if (pathname.startsWith('/admin') && !isAdminIcon) {
    if (!isAuthenticated(req)) {
      return new NextResponse('Acceso denegado', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Renters Admin"',
        },
      });
    }
  }

  // Bloquear /sandbox en producción
  if (pathname.startsWith('/sandbox') && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/sandbox', '/api/:path*'],
};
