"use client";

import { useState } from "react";
import { Send, Lock, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [selectedMotiveId, setSelectedMotiveId] = useState<string>("duda");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const motives = [
    { 
      id: "duda", 
      icon: "💬", 
      label: "Tengo una duda", 
      msgLabel: "Mensaje", 
      msgPlaceholder: "¿En qué podemos ayudarte?" 
    },
    { 
      id: "contrato", 
      icon: "📄", 
      label: "Necesito un contrato especial", 
      msgLabel: "Describe qué tipo de contrato necesitas", 
      msgPlaceholder: "Necesito un contrato para..." 
    },
    { 
      id: "factura", 
      icon: "🧾", 
      label: "Quiero mi factura", 
      msgLabel: "Datos de facturación y número de orden", 
      msgPlaceholder: "RFC, razón social, correo fiscal..." 
    },
    { 
      id: "soporte", 
      icon: "🛠", 
      label: "Soporte técnico", 
      msgLabel: "Describe el problema que tienes", 
      msgPlaceholder: "¿En qué podemos ayudarte?" 
    },
    { 
      id: "otro", 
      icon: "✉️", 
      label: "Otro tema", 
      msgLabel: "Mensaje", 
      msgPlaceholder: "¿En qué podemos ayudarte?" 
    },
  ];

  const activeMotiveInfo = motives.find(m => m.id === selectedMotiveId) || motives[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, motivo: activeMotiveInfo.label, mensaje }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setNombre(""); setCorreo(""); setMensaje("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full bg-[#fcfcfc] text-[#111] py-16 px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col justify-center h-full">
      
      <div className="w-full max-w-xl mx-auto lg:mx-0">
        
        <h2 className="text-3xl md:text-4xl font-display font-black text-[#111] leading-tight tracking-tight mb-3">
          ¿En qué te ayudamos?
        </h2>
        <p className="text-[#4b5563] text-[16px] mb-8 font-medium">
          Selecciona el motivo y cuéntanos más.
        </p>

        {/* Motive Pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {motives.map((motive) => {
            const isActive = selectedMotiveId === motive.id;
            return (
              <button
                key={motive.id}
                onClick={() => setSelectedMotiveId(motive.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all ${
                  isActive 
                    ? "bg-[#0d52ff] border-2 border-[#0d52ff] text-white shadow-md shadow-blue-500/20" 
                    : "bg-white border text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={isActive ? "brightness-0 invert" : ""}>{motive.icon}</span> {motive.label}
              </button>
            );
          })}
        </div>

        {/* Form Fields */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#111]">Nombre</label>
              <input
                type="text"
                required
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56ff] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#111]">Correo electrónico</label>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56ff] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 transition-all duration-300">
            <label className="text-[14px] font-bold text-[#111] transition-all">
              {activeMotiveInfo.msgLabel}
            </label>
            <textarea
              rows={5}
              required
              placeholder={activeMotiveInfo.msgPlaceholder}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#1a56ff] focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          {status === "success" && (
            <div className="flex items-center gap-2 text-[#10b981] font-bold text-[15px]">
              <CheckCircle className="w-5 h-5" /> ¡Mensaje enviado! Te respondemos pronto.
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-500 font-bold text-[15px]">
              <AlertCircle className="w-5 h-5" /> Error al enviar. Intenta de nuevo.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full flex items-center justify-center gap-2 bg-[#0d52ff] hover:bg-[#003ee6] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-[16px] mt-2"
          >
            <Send className="w-5 h-5" />
            {status === "loading" ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>

        {/* Security Note */}
        <p className="mt-6 text-center flex items-center justify-center gap-2 text-gray-500 text-[13px]">
          <Lock className="w-3.5 h-3.5 text-[#eab308]" /> 
          Tu información es privada y nunca se comparte con terceros.
        </p>

      </div>
    </div>
  );
}
