import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const maxDuration = 60;

// Ruta local de Chrome para desarrollo — @sparticuz/chromium solo trae el
// binario de Linux que usa Vercel.
const LOCAL_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('contratos')
    .select('folio')
    .eq('pdf_token', token)
    .eq('status', 'paid')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Acceso denegado o contrato no encontrado' }, { status: 403 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let browser;
  try {
    browser = await puppeteer.launch(
      process.env.VERCEL
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
          }
        : { executablePath: LOCAL_CHROME, headless: true }
    );

    const page = await browser.newPage();
    // pdf=1: ImprimirClient no dispara window.print() automático
    await page.goto(`${appUrl}/imprimir?token=${token}&pdf=1`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const pdf = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrato-${data.folio}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[pdf]', err);
    // Fallback: la página de impresión en el navegador sigue funcionando
    return NextResponse.redirect(`${appUrl}/imprimir?token=${token}`);
  } finally {
    await browser?.close().catch(() => {});
  }
}
