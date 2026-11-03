"use client";

import { useState } from "react";

export function ReenviarEnlaceForm() {
  const [folio, setFolio] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/reenviar-enlace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folio, email }),
      });
      if (res.ok) {
        setState("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "No se pudo procesar. Intenta más tarde.");
        setState("error");
      }
    } catch {
      setMessage("No se pudo procesar. Intenta más tarde.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
        Si el folio y el correo coinciden, te enviamos un enlace nuevo. Revisa tu bandeja y la carpeta de
        spam. Si no llega en unos minutos, escríbenos a contacto@renters.mx.
      </div>
    );
  }

  const input = "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500";
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-slate-700">Folio</span>
        <input className={input} value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="NL-12345" maxLength={40} required />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-slate-700">Correo</span>
        <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} required />
      </label>
      {state === "error" && <p className="text-sm text-red-600">{message}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : "Enviarme un enlace nuevo"}
      </button>
    </form>
  );
}
