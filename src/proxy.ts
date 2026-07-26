import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

// Test A/B — Generador de Contrato: variante A (/contrato, actual) vs.
// variante B (/contrato-b, flujo tipo scroll). Asignación 50/50 persistida
// en cookie para que el mismo visitante siga viendo la misma variante.
// Activado: app/contrato-b/page.tsx ya existe y funnel_events/contratos ya
// tienen la columna variant (migraciones 006/007) para poder comparar A vs B.
const AB_TEST_CONTRATO_B_ENABLED = true;
const AB_COOKIE_NAME = 'ab_variant';
const AB_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function handleContratoAbTest(req: NextRequest): NextResponse {
  // Override manual para pruebas/soporte: /contrato?forceVariant=b — no pisa
  // la cookie real, así no interfiere con la asignación 50/50 del experimento.
  const forced = req.nextUrl.searchParams.get('forceVariant');
  const existing = req.cookies.get(AB_COOKIE_NAME)?.value;
  const variant: 'a' | 'b' =
    forced === 'a' || forced === 'b'
      ? forced
      : existing === 'a' || existing === 'b'
        ? existing
        : Math.random() < 0.5 ? 'a' : 'b';

  let response: NextResponse;
  if (variant === 'b') {
    // Reescribe internamente hacia /contrato-b sin cambiar la URL que ve el
    // usuario, así los anuncios y links compartidos (con ?estado=... incluido,
    // preservado automáticamente al clonar la URL completa) no se rompen.
    const url = req.nextUrl.clone();
    url.pathname = '/contrato-b';
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }

  if (!existing && !forced) {
    response.cookies.set(AB_COOKIE_NAME, variant, {
      maxAge: AB_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // el JS del cliente necesita leerla para taggear funnel_events
    });
  }

  return response;
}

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

  if (AB_TEST_CONTRATO_B_ENABLED && pathname === '/contrato') {
    return handleContratoAbTest(req);
  }

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
  matcher: ['/admin/:path*', '/sandbox', '/api/:path*', '/contrato'],
};
