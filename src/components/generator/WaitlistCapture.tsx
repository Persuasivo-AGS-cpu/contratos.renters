"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { getStateName } from "@/lib/states";

interface Props {
  estado: string;
  onClose: () => void;
}

export function WaitlistCapture({ estado, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async () => {
    if (!email.includes("@")) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, estado }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
      {status === "done" ? (
        <div className="flex items-center gap-3 text-blue-800">
          <Check className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Listo. Te avisamos en cuanto {getStateName(estado)} esté disponible.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <p className="font-bold text-sm text-gray-900">
              {getStateName(estado)} llega pronto
            </p>
          </div>
          <p className="text-[13px] text-gray-600 mb-3">
            Déjanos tu correo y te avisamos el día que se active — sin spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="tu@correo.com"
              className="flex-1 min-w-0 h-10 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
            />
            <button
              onClick={submit}
              disabled={status === "sending" || !email.includes("@")}
              className="shrink-0 w-full sm:w-auto justify-center px-4 h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Avisarme"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-[12px] text-red-600 mt-2">No se pudo registrar. Intenta de nuevo.</p>
          )}
          <button onClick={onClose} className="text-[12px] text-gray-400 hover:text-gray-600 mt-2">
            Cerrar
          </button>
        </>
      )}
    </div>
  );
}
