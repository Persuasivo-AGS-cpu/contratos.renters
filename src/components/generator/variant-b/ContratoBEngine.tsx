"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useContractStore } from "@/store/useContractStore";
import { STATES, getStateName, getLegalStateName } from "@/lib/states";
import { trackFunnelStep } from "@/lib/funnel";
import { trackGeneratorStep } from "@/lib/analytics";
import { analyzeClabe } from "@/utils/clabeValidator";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { Minus, Plus } from "lucide-react";

// Variante B del generador: un solo scroll continuo (vs. el wizard paso a
// paso de /contrato) que se prueba A/B vía src/proxy.ts. Usa el mismo
// useContractStore y el mismo /api/checkout que la Variante A — cualquier
// dato que capture aquí es 100% compatible con el resto del sistema
// (plantillas legales, PDF, Stripe, Supabase) sin mapeos intermedios.

const ACTIVE_STATES = Object.entries(STATES)
  .filter(([, s]) => s.available)
  .map(([id, s]) => ({ id, ...s }));

const PROPERTY_TYPES: { id: "casa" | "departamento" | "local" | "oficina"; label: string; icon: string }[] = [
  { id: "casa", label: "Casa", icon: "🏠" },
  { id: "departamento", label: "Departamento", icon: "🏢" },
  { id: "local", label: "Local comercial", icon: "🏬" },
  { id: "oficina", label: "Oficina", icon: "💼" },
];

const INVENTORY_ITEMS = [
  { id: "sofas", label: "Sofá" },
  { id: "cama_matrimonial", label: "Cama matrimonial" },
  { id: "cama_individual", label: "Cama individual" },
  { id: "comedor", label: "Comedor" },
  { id: "refrigerador", label: "Refrigerador" },
  { id: "estufa", label: "Estufa / parrilla" },
  { id: "lavadora", label: "Lavadora" },
  { id: "climas", label: "Aire acondicionado" },
];

// Orden de secciones y su mapeo al step numérico 1-7 que espera
// funnel_events (mismo orden que StateStep..SummaryStep de la Variante A;
// varias secciones de esta variante colapsan al mismo step porque la tabla
// real no distingue esa granularidad).
const SECTION_ORDER = [
  "estado",
  "tipo",
  "estatus",
  "inmueble",
  "arrendador",
  "arrendatario",
  "aval",
  "terminos",
  "revision",
] as const;
type SectionId = (typeof SECTION_ORDER)[number];

const SECTION_STEP: Record<SectionId, number> = {
  estado: 1,
  tipo: 2,
  estatus: 2,
  inmueble: 2,
  arrendador: 3,
  arrendatario: 4,
  aval: 6,
  terminos: 5,
  revision: 7,
};

function Chip({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 p-4 border rounded-xl text-left transition-all font-semibold text-sm",
        selected
          ? "border-brand-primary bg-brand-primary/5 text-brand-primary ring-1 ring-brand-primary"
          : "border-border-layout hover:border-brand-primary/50 hover:bg-surface-subtle text-text-main",
        className
      )}
    >
      {children}
    </button>
  );
}

function Filled({ children }: { children: React.ReactNode }) {
  return <span className="bg-brand-primary/10 text-brand-primary font-bold px-1 rounded">{children}</span>;
}

function BlankLine() {
  return <span className="inline-block min-w-[140px] border-b border-gray-400 h-3 align-bottom" />;
}

function Section({
  id,
  step,
  title,
  subtitle,
  registerRef,
  visible,
  done,
  active,
  children,
}: {
  id: SectionId;
  step: number;
  title: string;
  subtitle?: string;
  registerRef: (el: HTMLElement | null) => void;
  visible: boolean;
  done: boolean;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      ref={registerRef}
      id={`seccion-${id}`}
      className={clsx(
        "max-w-xl mx-auto px-6 py-14 transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        done && !active && "opacity-60"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={clsx(
            "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border shrink-0 transition-colors",
            done || active ? "bg-brand-primary border-brand-primary text-white" : "border-border-layout text-text-muted"
          )}
        >
          {step}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Paso {step} de 7</span>
      </div>
      <h2 className="text-2xl font-display font-bold mb-2 text-text-main">{title}</h2>
      {subtitle && <p className="text-text-muted mb-6">{subtitle}</p>}
      {children}
    </section>
  );
}

export function ContratoBEngine() {
  const { contract, updateContract } = useContractStore();
  const searchParams = useSearchParams();

  // "¿Ya tienes inquilino?" no es un campo del store — se deriva de si
  // tenant.pending está prendido. null = todavía no contestó la pregunta.
  const [tenantStatus, setTenantStatus] = useState<"con" | "sin" | null>(
    contract.tenant.pending ? "sin" : contract.tenant.name ? "con" : null
  );
  const [visible, setVisible] = useState<Set<SectionId>>(new Set());
  const [active, setActive] = useState<SectionId | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const sectionRefs = useRef(new Map<SectionId, HTMLElement>());
  const firedSteps = useRef(new Set<number>());

  const registerRef = useCallback(
    (id: SectionId) => (el: HTMLElement | null) => {
      if (el) sectionRefs.current.set(id, el);
      else sectionRefs.current.delete(id);
    },
    []
  );

  // Estado precargado desde ?estado= (mismos anuncios que ya usan /contrato).
  useEffect(() => {
    const estadoParam = searchParams.get("estado");
    if (!estadoParam) return;
    const match = ACTIVE_STATES.find((s) => s.id === estadoParam);
    if (match && match.id !== contract.state) updateContract("state", match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mismo fix que ContractEngine.tsx: property.address.state se sincroniza
  // con el estado elegido en el paso 1 — hasCompleteAddress() del checkout
  // lo exige y de otra forma queda vacío.
  useEffect(() => {
    if (!contract.state) return;
    const legalName = getLegalStateName(contract.state);
    if (contract.property.address.state !== legalName) {
      updateContract("property", { address: { ...contract.property.address, state: legalName } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract.state]);

  // Revelado al hacer scroll + "spotlight" (la sección activa se ve nítida,
  // las completadas se atenúan) — mismo patrón que el mockup original, aquí
  // con IntersectionObserver nativo en vez de manipular clases a mano.
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          let changed = false;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id.replace("seccion-", "") as SectionId;
              if (!next.has(id)) {
                next.add(id);
                changed = true;
              }
            }
          });
          return changed ? next : prev;
        });
      },
      { threshold: 0.15 }
    );

    const spotlightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActive(entry.target.id.replace("seccion-", "") as SectionId);
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    sectionRefs.current.forEach((el) => {
      revealObserver.observe(el);
      spotlightObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
      spotlightObserver.disconnect();
    };
  }, []);

  // El paso 1 ("estado") se cuenta al cargar la página, igual que
  // ContractEngine.tsx en la Variante A (dispara con currentStep=1 al
  // montar). Si dependiera del spotlight por scroll, alguien que aterriza
  // aquí y no baja de inmediato — el hero ocupa buena parte del viewport —
  // nunca disparaba NINGÚN evento: quedaba invisible en funnel_events aunque
  // sí haya recibido la variante B. Esto explicó un sesgo real observado en
  // producción (14 sesiones 'a' vs. 1 'b'), no un problema del sorteo 50/50.
  useEffect(() => {
    if (firedSteps.current.has(1)) return;
    firedSteps.current.add(1);
    trackFunnelStep(1, contract.state || undefined);
    trackGeneratorStep(1, contract.state || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // funnel_events (drop-off real) + GA4/Meta — un solo disparo por step
  // numérico alcanzado, igual que ContractEngine.tsx en la Variante A.
  useEffect(() => {
    if (!active) return;
    const step = SECTION_STEP[active];
    if (firedSteps.current.has(step)) return;
    firedSteps.current.add(step);
    trackFunnelStep(step, contract.state || undefined);
    trackGeneratorStep(step, contract.state || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const addr = contract.property.address;
  const clabeInfo = analyzeClabe(contract.terms.bank_clabe);
  const bankPending = !!contract.terms.bank_details_pending;

  const status = useMemo(() => {
    const landlordIneOk = contract.landlord.id_number_pending || contract.landlord.id_number.length === 18;
    const tenantIneOk = contract.tenant.id_number_pending || contract.tenant.id_number.length === 18;
    return {
      estado: !!contract.state,
      tipo: !!contract.property.type,
      estatus: tenantStatus !== null,
      inmueble: !!(addr.street && addr.ext_num && addr.neighborhood && addr.municipality && addr.zip_code),
      arrendador:
        contract.landlord.name.trim().length > 3 &&
        contract.landlord.email.includes("@") &&
        contract.landlord.phone.length === 10 &&
        contract.landlord.address.trim().length > 5 &&
        landlordIneOk,
      arrendatario:
        tenantStatus === "sin" ||
        (contract.tenant.name.trim().length > 3 &&
          contract.tenant.email.includes("@") &&
          contract.tenant.phone.length === 10 &&
          tenantIneOk),
      aval: !contract.guarantor.includes || contract.guarantor.name.trim().length > 0,
      terminos:
        contract.terms.monthly_rent > 0 &&
        contract.terms.deposit_amount > 0 &&
        contract.terms.lease_start_date !== "" &&
        (bankPending || clabeInfo.isValidChecksum),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, tenantStatus, bankPending, clabeInfo.isValidChecksum]);

  const progressKeys: (keyof typeof status)[] = [
    "estado",
    "tipo",
    "estatus",
    "inmueble",
    "arrendador",
    "arrendatario",
    "aval",
    "terminos",
  ];
  const doneCount = progressKeys.filter((k) => status[k]).length;
  const progressPct = Math.round((doneCount / progressKeys.length) * 100);
  const canCheckout = progressKeys.every((k) => status[k]);

  const selectTenantStatus = (value: "con" | "sin") => {
    setTenantStatus(value);
    if (value === "sin") {
      updateContract("tenant", {
        pending: true,
        name: "",
        email: "",
        phone: "",
        id_number: "",
        id_number_pending: false,
      });
    } else {
      updateContract("tenant", { pending: false });
    }
  };

  const addressLine = [addr.street, addr.ext_num].filter(Boolean).join(" ");
  const fullAddressLine = [addressLine, addr.neighborhood, addr.municipality].filter(Boolean).join(", ");
  const typeLabel = PROPERTY_TYPES.find((t) => t.id === contract.property.type)?.label;
  const inventoryCount = Object.values(contract.property.inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-surface-subtle pb-28">
      {/* HERO */}
      <div className="bg-[#0F1729] text-white px-6 py-14 md:py-20">
        <div className="max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/80 mb-3 block">
            Instrumento legal · Renters
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight max-w-[18ch]">
            Tu contrato de arrendamiento, listo en minutos.
          </h1>
          <p className="text-gray-300 mt-4 max-w-[38ch]">
            Responde unas preguntas simples y mira cómo se arma tu documento legal frente a ti.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["$499 MXN", "< 10 min", `${ACTIVE_STATES.length} estados`].map((b) => (
              <span key={b} className="text-xs font-semibold text-gray-200 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 1. ESTADO */}
      <Section
        id="estado"
        step={1}
        title="¿En qué estado está la propiedad?"
        subtitle="Cargamos la plantilla legal correcta para tu estado."
        registerRef={registerRef("estado")}
        visible={visible.has("estado")}
        done={status.estado}
        active={active === "estado"}
      >
        <div className="grid grid-cols-2 gap-3">
          {ACTIVE_STATES.map((s) => (
            <Chip key={s.id} selected={contract.state === s.id} onClick={() => updateContract("state", s.id)}>
              <div>
                <span className="block">{s.name}</span>
                <span className="block text-[11px] font-mono text-text-muted uppercase mt-0.5">{s.code}</span>
              </div>
            </Chip>
          ))}
        </div>
      </Section>

      {/* 2. TIPO DE PROPIEDAD */}
      <Section
        id="tipo"
        step={2}
        title="¿Qué tipo de propiedad es?"
        registerRef={registerRef("tipo")}
        visible={visible.has("tipo")}
        done={status.tipo}
        active={active === "tipo"}
      >
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((t) => (
            <Chip key={t.id} selected={contract.property.type === t.id} onClick={() => updateContract("property", { type: t.id })}>
              <span>
                {t.icon} {t.label}
              </span>
            </Chip>
          ))}
        </div>
      </Section>

      {/* 3. ESTATUS DEL INQUILINO */}
      <Section
        id="estatus"
        step={2}
        title="¿Ya tienes inquilino?"
        registerRef={registerRef("estatus")}
        visible={visible.has("estatus")}
        done={status.estatus}
        active={active === "estatus"}
      >
        <div className="flex flex-col gap-3">
          <Chip selected={tenantStatus === "con"} onClick={() => selectTenantStatus("con")}>
            ✅ Sí, ya tengo inquilino
          </Chip>
          <Chip selected={tenantStatus === "sin"} onClick={() => selectTenantStatus("sin")}>
            🔍 Aún no, quiero adelantar el contrato
          </Chip>
        </div>
        {tenantStatus === "sin" && (
          <p className="text-sm text-text-muted mt-4 bg-white border border-border-layout rounded-xl p-4">
            Sin problema — dejamos el bloque del inquilino en blanco en el contrato, listo para completarse a mano con
            pluma cuando lo tengas.
          </p>
        )}
      </Section>

      {/* 4. INMUEBLE */}
      <Section
        id="inmueble"
        step={2}
        title="Dirección de la propiedad"
        registerRef={registerRef("inmueble")}
        visible={visible.has("inmueble")}
        done={status.inmueble}
        active={active === "inmueble"}
      >
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-layout shadow-sm">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Calle</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                value={addr.street}
                onChange={(e) => updateContract("property", { address: { ...addr, street: e.target.value } })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Ext.</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                value={addr.ext_num}
                onChange={(e) => updateContract("property", { address: { ...addr, ext_num: e.target.value } })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Int.</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                value={addr.int_num}
                onChange={(e) => updateContract("property", { address: { ...addr, int_num: e.target.value } })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Colonia</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                value={addr.neighborhood}
                onChange={(e) => updateContract("property", { address: { ...addr, neighborhood: e.target.value } })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Municipio</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                value={addr.municipality}
                onChange={(e) => updateContract("property", { address: { ...addr, municipality: e.target.value } })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Código postal</label>
              <input
                type="text"
                maxLength={5}
                className="w-full h-11 px-3 border border-border-layout rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                value={addr.zip_code}
                onChange={(e) => updateContract("property", { address: { ...addr, zip_code: e.target.value.replace(/\D/g, "") } })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Estado</label>
              <input
                type="text"
                disabled
                className="w-full h-11 px-3 border border-border-layout rounded-lg bg-gray-100 text-text-muted text-sm cursor-not-allowed"
                value={contract.state ? getStateName(contract.state) : ""}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-bold text-text-main mb-2">¿Se renta amueblado?</label>
          <div className="grid grid-cols-2 gap-3">
            <Chip
              selected={!contract.property.furnished}
              onClick={() => updateContract("property", { furnished: false, inventory: {} })}
            >
              📦 Sin amueblar
            </Chip>
            <Chip selected={contract.property.furnished} onClick={() => updateContract("property", { furnished: true })}>
              🛋️ Amueblado
            </Chip>
          </div>
        </div>

        {contract.property.furnished && (
          <div className="mt-4 bg-white border border-border-layout rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-text-main">Inventario (protege tu depósito)</p>
              <span className="text-xs font-bold text-white bg-brand-primary px-2.5 py-1 rounded-full">{inventoryCount} artículos</span>
            </div>
            <div className="divide-y divide-border-layout">
              {INVENTORY_ITEMS.map((item) => {
                const qty = contract.property.inventory[item.id] || 0;
                return (
                  <div key={item.id} className="flex items-center justify-between py-2.5">
                    <span className="text-sm font-medium text-text-main">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={qty === 0}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-border-layout text-text-muted disabled:opacity-30"
                        onClick={() =>
                          updateContract("property", { inventory: { ...contract.property.inventory, [item.id]: Math.max(0, qty - 1) } })
                        }
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-4 text-center font-bold text-sm">{qty}</span>
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-brand-primary/30 text-brand-primary bg-brand-primary/5"
                        onClick={() =>
                          updateContract("property", { inventory: { ...contract.property.inventory, [item.id]: qty + 1 } })
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Section>

      {/* 5. ARRENDADOR */}
      <Section
        id="arrendador"
        step={3}
        title="¿Quién es el propietario?"
        registerRef={registerRef("arrendador")}
        visible={visible.has("arrendador")}
        done={status.arrendador}
        active={active === "arrendador"}
      >
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-layout shadow-sm">
          <Field label="Nombre completo">
            <input
              type="text"
              className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              value={contract.landlord.name}
              onChange={(e) => updateContract("landlord", { name: e.target.value })}
            />
          </Field>
          <div>
            <Field label="INE (clave de elector)">
              <input
                type="text"
                maxLength={18}
                disabled={contract.landlord.id_number_pending}
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 uppercase disabled:bg-gray-100 disabled:text-gray-400"
                value={contract.landlord.id_number}
                onChange={(e) => updateContract("landlord", { id_number: e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() })}
              />
            </Field>
            <PendingCheckbox
              checked={!!contract.landlord.id_number_pending}
              onChange={(checked) => updateContract("landlord", { id_number_pending: checked, id_number: checked ? "" : contract.landlord.id_number })}
            />
          </div>
          <Field label="Domicilio">
            <input
              type="text"
              className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="Calle, número, colonia, municipio"
              value={contract.landlord.address}
              onChange={(e) => updateContract("landlord", { address: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Correo">
              <input type="email" className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" value={contract.landlord.email} onChange={(e) => updateContract("landlord", { email: e.target.value })} />
            </Field>
            <Field label="Teléfono">
              <input
                type="tel"
                maxLength={10}
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                value={contract.landlord.phone}
                onChange={(e) => updateContract("landlord", { phone: e.target.value.replace(/\D/g, "") })}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* 6. ARRENDATARIO */}
      <Section
        id="arrendatario"
        step={4}
        title={tenantStatus === "sin" ? "Se llenará después" : "¿Quién va a rentar?"}
        registerRef={registerRef("arrendatario")}
        visible={visible.has("arrendatario")}
        done={status.arrendatario}
        active={active === "arrendatario"}
      >
        {tenantStatus === "sin" ? (
          <p className="text-text-muted bg-white border border-border-layout rounded-xl p-5">
            Como aún no tienes inquilino, dejamos ese espacio en blanco en el contrato — listo para completarlo a mano
            con pluma cuando lo tengas.
          </p>
        ) : (
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-layout shadow-sm">
            <Field label="Nombre completo">
              <input type="text" className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" value={contract.tenant.name} onChange={(e) => updateContract("tenant", { name: e.target.value })} />
            </Field>
            <div>
              <Field label="INE (clave de elector)">
                <input
                  type="text"
                  maxLength={18}
                  disabled={contract.tenant.id_number_pending}
                  className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 uppercase disabled:bg-gray-100 disabled:text-gray-400"
                  value={contract.tenant.id_number}
                  onChange={(e) => updateContract("tenant", { id_number: e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() })}
                />
              </Field>
              <PendingCheckbox
                checked={!!contract.tenant.id_number_pending}
                onChange={(checked) => updateContract("tenant", { id_number_pending: checked, id_number: checked ? "" : contract.tenant.id_number })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Correo">
                <input type="email" className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" value={contract.tenant.email} onChange={(e) => updateContract("tenant", { email: e.target.value })} />
              </Field>
              <Field label="Teléfono">
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  value={contract.tenant.phone}
                  onChange={(e) => updateContract("tenant", { phone: e.target.value.replace(/\D/g, "") })}
                />
              </Field>
            </div>
            <p className="text-xs text-text-muted">
              Su domicilio para este contrato es el inmueble que está rentando — ya lo capturamos arriba, no hace falta repetirlo.
            </p>
          </div>
        )}
      </Section>

      {/* 7. AVAL / FIADOR */}
      <Section
        id="aval"
        step={6}
        title="¿El contrato incluye aval o fiador?"
        registerRef={registerRef("aval")}
        visible={visible.has("aval")}
        done={status.aval}
        active={active === "aval"}
      >
        <div className="flex flex-col gap-3 mb-4">
          <Chip selected={!contract.guarantor.includes} onClick={() => updateContract("guarantor", { includes: false })}>
            🚫 No, no requiere aval
          </Chip>
          <Chip selected={contract.guarantor.includes} onClick={() => updateContract("guarantor", { includes: true })}>
            🖋️ Sí, va a tener aval/fiador
          </Chip>
        </div>
        {contract.guarantor.includes && (
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-layout shadow-sm">
            <Field label="Nombre completo">
              <input type="text" className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" value={contract.guarantor.name} onChange={(e) => updateContract("guarantor", { name: e.target.value })} />
            </Field>
            <Field label="INE (clave de elector)">
              <input
                type="text"
                maxLength={18}
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 uppercase"
                value={contract.guarantor.id_number}
                onChange={(e) => updateContract("guarantor", { id_number: e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() })}
              />
            </Field>
            <Field label="Domicilio">
              <input type="text" className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" value={contract.guarantor.address} onChange={(e) => updateContract("guarantor", { address: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Correo">
                <input type="email" className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" value={contract.guarantor.email} onChange={(e) => updateContract("guarantor", { email: e.target.value })} />
              </Field>
              <Field label="Teléfono">
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  value={contract.guarantor.phone}
                  onChange={(e) => updateContract("guarantor", { phone: e.target.value.replace(/\D/g, "") })}
                />
              </Field>
            </div>
          </div>
        )}
      </Section>

      {/* 8. TÉRMINOS */}
      <Section
        id="terminos"
        step={5}
        title="Renta y condiciones"
        registerRef={registerRef("terminos")}
        visible={visible.has("terminos")}
        done={status.terminos}
        active={active === "terminos"}
      >
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-layout shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Renta mensual (MXN)">
              <input
                type="number"
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                value={contract.terms.monthly_rent || ""}
                onChange={(e) => updateContract("terms", { monthly_rent: parseFloat(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Depósito (MXN)">
              <input
                type="number"
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                value={contract.terms.deposit_amount || ""}
                onChange={(e) => updateContract("terms", { deposit_amount: parseFloat(e.target.value) || 0 })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Día de pago">
              <input
                type="number"
                min={1}
                max={31}
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                value={contract.terms.payment_day || ""}
                onChange={(e) => updateContract("terms", { payment_day: parseInt(e.target.value) || 5 })}
              />
            </Field>
            <Field label="Duración">
              <select
                className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-white"
                value={contract.terms.lease_duration_months}
                onChange={(e) => updateContract("terms", { lease_duration_months: parseInt(e.target.value) || 12 })}
              >
                <option value={6}>6 meses</option>
                <option value={12}>1 año</option>
                <option value={24}>2 años</option>
              </select>
            </Field>
          </div>
          <Field label="Fecha de inicio del contrato">
            <input
              type="date"
              className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              value={contract.terms.lease_start_date}
              onChange={(e) => updateContract("terms", { lease_start_date: e.target.value })}
            />
          </Field>

          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">¿Cómo se va a pagar la renta?</label>
            <div className="grid grid-cols-2 gap-3">
              <Chip selected={contract.terms.payment_method === "efectivo"} onClick={() => updateContract("terms", { payment_method: "efectivo" })}>
                💵 Efectivo
              </Chip>
              <Chip selected={contract.terms.payment_method === "transferencia"} onClick={() => updateContract("terms", { payment_method: "transferencia" })}>
                🏦 Transferencia
              </Chip>
            </div>
          </div>

          <div className="p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-xl space-y-3">
            <p className="text-sm font-bold text-brand-primary">Datos bancarios para recibir el pago</p>
            <p className="text-xs text-text-muted -mt-2">
              Se piden siempre, sin importar el método de pago — quedan como referencia en el contrato.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Banco" className="col-span-1">
                <input
                  type="text"
                  disabled={bankPending}
                  className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:bg-gray-100 disabled:text-gray-400"
                  value={contract.terms.bank_name || ""}
                  onChange={(e) => updateContract("terms", { bank_name: e.target.value })}
                />
              </Field>
              <Field label="CLABE" className="col-span-2">
                <input
                  type="text"
                  disabled={bankPending}
                  className="w-full h-11 px-3.5 border border-border-layout rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 font-mono disabled:bg-gray-100 disabled:text-gray-400"
                  value={clabeInfo.formattedClabe}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 18);
                    const analysis = analyzeClabe(raw);
                    updateContract("terms", {
                      bank_clabe: raw,
                      is_valid_clabe: analysis.isValidChecksum,
                      ...(analysis.bankName && analysis.bankName !== "No identificado" ? { bank_name: analysis.bankName } : {}),
                    });
                  }}
                />
              </Field>
            </div>
            <PendingCheckbox
              label="No tengo estos datos bancarios en este momento. Dejar espacio para completarlos antes de la firma."
              checked={bankPending}
              onChange={(checked) =>
                updateContract("terms", {
                  bank_details_pending: checked,
                  bank_name: checked ? "" : contract.terms.bank_name,
                  bank_account: checked ? "" : contract.terms.bank_account,
                  bank_clabe: checked ? "" : contract.terms.bank_clabe,
                  is_valid_clabe: checked ? false : contract.terms.is_valid_clabe,
                })
              }
            />
          </div>
        </div>
      </Section>

      {/* 9. REVISIÓN */}
      <Section
        id="revision"
        step={7}
        title="Tu contrato está listo"
        subtitle="Revisa los datos. El documento completo se desbloquea al confirmar el pago."
        registerRef={registerRef("revision")}
        visible={visible.has("revision")}
        done={false}
        active={active === "revision"}
      >
        <div className="flex flex-wrap gap-2 mb-5">
          {["✓ Redactado por abogados", "✓ Conforme al código civil", "✓ Válido ante autoridades"].map((b) => (
            <span key={b} className="text-xs font-semibold text-brand-primary bg-brand-primary/10 rounded-full px-3 py-1.5">
              {b}
            </span>
          ))}
        </div>

        <div className="bg-white border border-border-layout rounded-2xl p-6 shadow-sm text-[15px] leading-relaxed space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Contrato de arrendamiento residencial</h3>
          <p>Código Civil para el Estado de <Filled>{contract.state ? getLegalStateName(contract.state) : "[estado]"}</Filled></p>
          <p>
            Contrato que celebran, por una parte <Filled>{contract.landlord.name || "[arrendador]"}</Filled>, a quien se
            denominará &quot;EL ARRENDADOR&quot;; y por la otra{" "}
            {tenantStatus === "sin" ? <BlankLine /> : <Filled>{contract.tenant.name || "[arrendatario]"}</Filled>}, a
            quien se denominará &quot;EL ARRENDATARIO&quot;, respecto del inmueble ubicado en{" "}
            <Filled>{fullAddressLine || "[dirección]"}</Filled>, destinado a uso de <Filled>{typeLabel || "[tipo de propiedad]"}</Filled>.
          </p>
          {contract.property.furnished && (
            <p>
              TERCERA BIS. El inmueble se entrega <Filled>AMUEBLADO{inventoryCount > 0 ? ` (${inventoryCount} artículos en inventario)` : ""}</Filled>.
            </p>
          )}
          <p>
            CUARTA. Renta mensual: <Filled>${(contract.terms.monthly_rent || 0).toLocaleString("es-MX")}</Filled> MXN, pagaderos el día{" "}
            <Filled>{contract.terms.payment_day || 5}</Filled> de cada mes, mediante{" "}
            <Filled>{contract.terms.payment_method === "efectivo" ? "pago en efectivo" : "transferencia electrónica"}</Filled>.
          </p>
          <p>QUINTA. Depósito en garantía: <Filled>${(contract.terms.deposit_amount || 0).toLocaleString("es-MX")}</Filled> MXN.</p>
          <p>SEXTA. Plazo forzoso: <Filled>{contract.terms.lease_duration_months || 12}</Filled> meses.</p>
          <p>
            SÉPTIMA. Fiador y obligado solidario:{" "}
            {!contract.guarantor.includes ? (
              <Filled>No aplica — este contrato no incluye fiador</Filled>
            ) : contract.guarantor.name ? (
              <Filled>{contract.guarantor.name}</Filled>
            ) : (
              <BlankLine />
            )}
          </p>

          <div className="relative rounded-xl overflow-hidden mt-4">
            <div className="p-4 blur-[4px] select-none opacity-60 space-y-2.5">
              <div className="h-2.5 bg-border-layout rounded w-[92%]" />
              <div className="h-2.5 bg-border-layout rounded w-[78%]" />
              <div className="h-2.5 bg-border-layout rounded w-[85%]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/55 text-sm font-semibold text-text-main text-center px-4">
              🔒 3 cláusulas más — Reporte de desperfectos, Servicios, Incumplimiento
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-baseline px-4 py-2.5 rounded-lg text-text-muted text-sm">
            <span>Un despacho tradicional</span>
            <strong className="line-through">$2,500 – $5,000</strong>
          </div>
          <div className="flex justify-between items-baseline px-4 py-2.5 rounded-lg bg-brand-primary/10">
            <span className="font-semibold text-text-main">Tu contrato con Renters</span>
            <strong className="text-brand-primary text-xl">$499 MXN</strong>
          </div>
        </div>
        <p className="text-xs text-text-muted text-center mt-3">Corrección de datos gratis las primeras 24 horas.</p>
      </Section>

      {/* STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F1729]/95 backdrop-blur text-white px-4 py-3 flex items-center justify-between gap-3 border-t border-white/10">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-brand-primary/80 tracking-wide truncate">
            {contract.state ? `Contrato · ${getStateName(contract.state)}` : "Generador de contrato"}
          </p>
          <div className="w-36 h-[3px] bg-white/15 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-brand-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <button
          type="button"
          disabled={!canCheckout}
          onClick={() => setCheckoutOpen(true)}
          className="shrink-0 bg-brand-primary text-white font-bold text-sm px-6 py-3 rounded-full disabled:opacity-35 transition-opacity"
        >
          {canCheckout ? "Pagar y desbloquear — $499 MXN" : "Continuar"}
        </button>
      </div>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function PendingCheckbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="mt-2 flex items-start gap-3 rounded-lg border border-border-layout bg-surface-subtle p-3 text-xs text-text-muted cursor-pointer">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label || "No tengo este dato en este momento. Dejar espacio para completarlo antes de la firma."}</span>
    </label>
  );
}
