'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthorized } from '@/lib/adminAuth';

// Reinicia la vigencia (90 días) del enlace actual de un contrato pagado. No rota el
// token: el cliente conserva su mismo enlace. Es una acción explícita del administrador.
export async function renewTokenValidity(id: string): Promise<void> {
  const hdrs = await headers();
  if (!isAdminAuthorized(hdrs.get('authorization'))) {
    throw new Error('No autorizado');
  }

  const { error } = await supabaseAdmin
    .from('contratos')
    .update({ pdf_token_issued_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'paid');

  if (error) {
    console.error('[admin] renewTokenValidity falló:', error);
    throw new Error('No se pudo renovar la vigencia');
  }
  revalidatePath('/admin/contratos');
  revalidatePath(`/admin/contratos/${id}`);
}
