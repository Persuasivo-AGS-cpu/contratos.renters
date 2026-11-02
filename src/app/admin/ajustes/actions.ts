'use server';

import { headers } from 'next/headers';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { sendTestPurchase, type TestResult } from '@/lib/metaCapi';

// Envía un Purchase de prueba a Meta con el token del servidor, solo hacia el panel "Probar eventos".
export async function enviarPruebaCapi(_prev: TestResult | null, formData: FormData): Promise<TestResult> {
  const hdrs = await headers();
  if (!isAdminAuthorized(hdrs.get('authorization'))) {
    throw new Error('No autorizado');
  }
  return sendTestPurchase(String(formData.get('codigo') ?? ''));
}
