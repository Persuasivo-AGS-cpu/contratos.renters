import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

function isAuthenticated(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return false;

  if (!ADMIN_USER || !ADMIN_PASS) return false;
  const base64 = authHeader.slice(6);
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger /admin con Basic Auth
  if (pathname.startsWith('/admin')) {
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
  matcher: ['/admin/:path*', '/sandbox'],
};
