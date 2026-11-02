"use client";

import { useActionState } from "react";
import { enviarPruebaCapi } from "./actions";

export function CapiTestForm() {
  const [result, action, pending] = useActionState(enviarPruebaCapi, null);

  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="codigo"
          required
          placeholder="Código de prueba, p. ej. TEST12345"
          autoComplete="off"
          className="flex-1 h-10 px-3 border border-gray-200 rounded-md text-[13px] font-mono"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-10 px-4 rounded-md bg-gray-900 text-white text-[13px] font-semibold disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Enviar evento de prueba"}
        </button>
      </div>
      {result && (
        <p className={`text-[12px] font-medium ${result.ok ? "text-emerald-700" : "text-red-600"}`} role="status">
          {result.mensaje}
        </p>
      )}
    </form>
  );
}
