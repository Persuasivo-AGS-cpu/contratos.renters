# Estados Contratos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activar Jalisco, Querétaro, Mérida y San Luis Potosí como estados disponibles en el generador, actualizar el hero dropdown y la sección StateCards para reflejar la cobertura, y generar imágenes coherentes con la línea gráfica existente para cada nuevo estado.

**Architecture:** Cada estado tiene su propio template React (clone de `NuevoLeonTemplate`) con el estado correcto hardcodeado en la cláusula del Código Civil y en la ciudad de firma. Un helper `getStateTemplate(state)` centraliza el switch de plantillas. `ContractPreview` e `ImprimirClient` lo consumen para eliminar el hardcode de `NuevoLeonTemplate`. El hero dropdown pre-selecciona el estado en el generador vía URL param `?estado=`. El formulario existente ya tiene TODOS los campos necesarios — solo hay que mapearlos.

**Tech Stack:** Next.js, React, TypeScript, Zustand, Tailwind CSS, FAL AI (generación de imágenes)

---

## Análisis de Contratos — Hallazgos Clave

### Campos en los 4 contratos → ya existen en el store

| Placeholder en .docx | Campo del store | Path completo |
|---|---|---|
| `[NOMBRE DEL ARRENDADOR]` | `landlord.name` | `c.landlord.name` |
| `[NOMBRE DEL ARRENDATARIO]` | `tenant.name` | `c.tenant.name` |
| `[NOMBRE DE CALLE Y NUMERO, COLONIA, MUNICIPIO, ESTADO Y CODIGO POSTAL]` | `property.address` | `formattedPropertyAddress` |
| `[NUMERO DE CUENTA]` | `terms.bank_account` | `c.terms.bank_account` |
| `[NUMERO DE CUENTA CLABE]` | `terms.bank_clabe` | `c.terms.bank_clabe` |
| `[NOMBRE DE BANCO]` | `terms.bank_name` | `c.terms.bank_name` |

### Campos adicionales ya en store (implícitos en las cláusulas)

| Cláusula | Campos usados |
|---|---|
| CUARTA — Renta | `monthly_rent`, `lease_duration_months`, `payment_day` |
| QUINTA — Depósito | `deposit_amount` |
| SEXTA — Plazo | `lease_duration_months`, `lease_start_date`, `early_termination_penalty_months` |
| NOVENA — Mora | `late_penalty_percent` |
| Declaración I.g | `landlord.address` |
| Declaración II.h | `tenant.address` |
| DÉCIMA — Fiador | `guarantor.*` |
| Cierre firma | `landlord.id_number`, `tenant.id_number` |

### Diferencias por estado (los únicos cambios vs NuevoLeonTemplate)

| Estado | Texto en cláusula Código Civil | Ciudad de firma |
|---|---|---|
| Jalisco | `...Código Civil vigente en el estado de Jalisco...` | `GUADALAJARA, JALISCO, MÉXICO` |
| Querétaro | `...Código Civil vigente en el estado de Querétaro...` | `QUERÉTARO, QUERÉTARO, MÉXICO` |
| Mérida | `...Código Civil vigente en el estado de Yucatán...` | `MÉRIDA, YUCATÁN, MÉXICO` |
| San Luis Potosí | `...Código Civil vigente en el estado de San Luis Potosí...` | `SAN LUIS POTOSÍ, SAN LUIS POTOSÍ, MÉXICO` |

---

## Mapa de Archivos

| Acción | Archivo | Responsabilidad |
|---|---|---|
| **Modificar** | `src/store/useContractStore.ts` | Agregar `'queretaro' \| 'merida' \| 'san-luis-potosi'` al type union |
| **Crear** | `src/components/generator/templates/JaliscoTemplate.tsx` | Template Jalisco — Código Civil Jalisco + firma Guadalajara |
| **Crear** | `src/components/generator/templates/QueretaroTemplate.tsx` | Template Querétaro — Código Civil Querétaro + firma Querétaro |
| **Crear** | `src/components/generator/templates/MeridaTemplate.tsx` | Template Mérida — Código Civil Yucatán + firma Mérida |
| **Crear** | `src/components/generator/templates/SanLuisPotosiTemplate.tsx` | Template SLP — Código Civil SLP + firma SLP |
| **Crear** | `src/components/generator/templates/getStateTemplate.tsx` | Helper: `state` → componente React correcto |
| **Modificar** | `src/components/generator/ContractPreview.tsx` | Usar `getStateTemplate` + `getStateName` para 4 nuevos estados |
| **Modificar** | `src/app/imprimir/ImprimirClient.tsx` | Usar `getStateTemplate` en lugar de `NuevoLeonTemplate` hardcodeado |
| **Modificar** | `src/components/generator/steps/StateStep.tsx` | Jalisco → `available: true`; agregar QRO, MER, SLP como `available: true` |
| **Modificar** | `src/components/home/StateCards.tsx` | Activar Jalisco; agregar QRO, MER, SLP |
| **Generar** | `public/images/states/queretaro.png` | Imagen arquitectónica Querétaro — misma línea gráfica que NL y JAL |
| **Generar** | `public/images/states/merida.png` | Imagen arquitectónica Mérida/Yucatán |
| **Generar** | `public/images/states/san-luis-potosi.png` | Imagen arquitectónica SLP |
| **Modificar** | `src/components/home/HeroSection.tsx` | Dropdown: activar JAL/QRO/MER/SLP; link dinámico con `?estado=`; actualizar stat "NL" |
| **Modificar** | `src/components/generator/steps/StateStep.tsx` | Leer `?estado=` de URL y pre-seleccionar estado al montar |

---

## Task 1: Actualizar type union en el store

**Files:**
- Modify: `src/store/useContractStore.ts:5`

- [ ] **Step 1: Cambiar el tipo de `state`**

```typescript
// Línea 5 de useContractStore.ts — reemplazar:
state: 'nuevo-leon' | 'jalisco' | 'cdmx' | 'edomex' | '';

// Por:
state: 'nuevo-leon' | 'jalisco' | 'queretaro' | 'merida' | 'san-luis-potosi' | 'cdmx' | 'edomex' | '';
```

- [ ] **Step 2: Verificar que TypeScript no rompe nada**

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/Antigravity/The_Hub/ClientsVault/Contratos/web-contratos
npx tsc --noEmit
```
Expected: sin errores nuevos relacionados al type `state`.

- [ ] **Step 3: Commit**

```bash
git add src/store/useContractStore.ts
git commit -m "feat: add queretaro, merida, san-luis-potosi to ContractState type union"
```

---

## Task 2: Crear JaliscoTemplate.tsx

**Files:**
- Create: `src/components/generator/templates/JaliscoTemplate.tsx`

La única diferencia vs `NuevoLeonTemplate` son:
1. La cláusula `DÉCIMA` (o la que menciona Código Civil) lleva "Jalisco"
2. La cláusula de cierre lleva "GUADALAJARA, JALISCO, MÉXICO"

- [ ] **Step 1: Crear el archivo**

```tsx
// src/components/generator/templates/JaliscoTemplate.tsx
"use client";

import { useContractStore } from "@/store/useContractStore";
import { formatCurrencyText } from "@/utils/numberToWords";

export function JaliscoTemplate() {
  const { contract } = useContractStore();
  const c = contract;

  const rentText = formatCurrencyText(c.terms.monthly_rent);
  const depositText = formatCurrencyText(c.terms.deposit_amount);

  const formatAddress = (addr: typeof c.property.address) => {
    if (!addr || !addr.street) return null;
    return `${addr.street} ${addr.ext_num}${addr.int_num ? ` Int. ${addr.int_num}` : ''}, Col. ${addr.neighborhood}, ${addr.municipality}, C.P. ${addr.zip_code}, ${addr.state}`;
  };
  const formattedPropertyAddress = formatAddress(c.property.address);

  const propertyLabelMap: Record<string, string> = {
    casa: 'CASA-HABITACIÓN',
    departamento: 'DEPARTAMENTO',
    local: 'LOCAL COMERCIAL',
    oficina: 'OFICINA',
  };
  const propertyUsageMap: Record<string, string> = {
    casa: 'USO HABITACIONAL',
    departamento: 'USO HABITACIONAL',
    local: 'USO COMERCIAL',
    oficina: 'USO COMUNICACIÓN / OFICINA',
  };

  const propertyLabel = propertyLabelMap[c.property.type] || 'CASA-HABITACIÓN';
  const propertyUsage = propertyUsageMap[c.property.type] || 'USO HABITACIONAL';

  return (
    <div className="text-[10px] md:text-[11px] text-gray-800 leading-relaxed space-y-4 text-justify font-serif print:text-black">
      <div className="text-center font-bold mb-8">
        <h2 className="text-sm">C O N T R A T O &nbsp; D E &nbsp; A R R E N D A M I E N T O</h2>
      </div>

      <p>
        CONTRATO DE ARRENDAMIENTO QUE CELEBRAN, POR UNA PARTE, <span className="font-bold">{c.landlord.name || '___________________________'}</span>, A QUIEN EN LO SUCESIVO EN TÉRMINOS DEL PRESENTE CONTRATO SE LE DENOMINARÁ <span className="font-bold">"EL ARRENDADOR"</span>; POR LA OTRA PARTE, <span className="font-bold">{c.tenant.name || '___________________________'}</span>, A QUIEN EN LO SUCESIVO EN TÉRMINOS DEL PRESENTE CONTRATO SE LE DENOMINARÁ <span className="font-bold">"EL ARRENDATARIO"</span>{c.guarantor.includes && (<>; Y POR UNA TERCERA PARTE, <span className="font-bold">{c.guarantor.name || '___________________________'}</span>, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ <span className="font-bold">"EL FIADOR"</span></>)}; EN LOS TÉRMINOS QUE SE PRECISARÁN EN EL PRESENTE INSTRUMENTO LEGAL, "LAS PARTES" FORMALIZARÁN EL PRESENTE CONTRATO CONFORME A LAS SIGUIENTES DECLARACIONES y CLÁUSULAS:
      </p>

      <div className="text-center font-bold mt-6 mb-4">
        <h3>D E C L A R A C I O N E S</h3>
      </div>

      <p className="font-bold">I.- Declara "EL ARRENDADOR":</p>
      <div className="pl-4 space-y-2">
        <p>a) Que cuenta con plena capacidad legal para obligarse y que desea llevar a cabo el presente acto.</p>
        <p>b) Que es propietario y tiene en legítima propiedad, posesión y pleno dominio el inmueble ubicado en <span className="font-bold">{formattedPropertyAddress || '___________________________'}</span>, que en lo sucesivo se le denominará "EL INMUEBLE".</p>
        <p>c) Que no tiene conocimiento alguno sobre si "EL ARRENDATARIO" se encuentra o ha estado involucrado, directa o indirectamente, en la comisión de delitos, particularmente aquellos que establece la Ley Nacional De Extinción De Dominio y los que menciona La Constitución Política de Los Estados Unidos Mexicanos, por lo que hasta donde es de su conocimiento "EL ARRENDATARIO" se dedica exclusivamente a la realización de actividades lícitas.</p>
        <p>d) Que al no conocer sobre la realización de ninguno de los hechos ilícitos y delitos a los que se refieren la Ley Nacional De Extinción De Dominio por parte de "EL ARRENDATARIO", actúa con absoluta buena fe en la celebración de este Contrato.</p>
        <p>e) Que es su deseo y voluntad dar en arrendamiento a "EL ARRENDATARIO" "EL INMUEBLE" para uso exclusivamente de <span className="font-bold uppercase">{propertyLabel}</span>.</p>
        <p>f) Que "EL INMUEBLE" incluye instalaciones eléctricas, sanitarias, mismo que se recibe en condiciones de uso normal.</p>
        <p>g) Que su domicilio convencional para oír y recibir notificaciones, en el ubicado <span className="font-bold">{c.landlord.address || '___________________________'}</span>.</p>
      </div>

      <p className="font-bold mt-4">II.- Declara "EL ARRENDATARIO":</p>
      <div className="pl-4 space-y-2">
        <p>a) Que tiene plena capacidad legal para obligarse y que desea llevar a cabo el presente acto.</p>
        <p>b) Que conoce perfectamente "EL INMUEBLE" descrito en las declaraciones de "EL ARRENDADOR" y que desea llevar a cabo el presente contrato de arrendamiento.</p>
        <p>c) Que por así convenir a sus intereses es su deseo y está dispuesto a tomar en arrendamiento "EL INMUEBLE" que se describe en la declaración I inciso "b" de conformidad con los términos y condiciones establecidos en el presente contrato. Que en sus actividades jamás ha incurrido en la comisión de delito alguno, incluyendo los que establece la Ley Nacional De Extinción De Dominio y los que establece La Constitución Política de Los Estados Unidos Mexicanos.</p>
        <p>d) Que los recursos que destina y/o destinará al pago de la Renta y la constitución del Depósito provienen y/o provendrán de fuentes lícitas.</p>
        <p>e) Que es su deseo e intención celebrar el presente Contrato de arrendamiento y arrendar "EL INMUEBLE" a "EL ARRENDADOR" en los términos y bajo las condiciones que establece el presente Contrato, asegurando que todas sus declaraciones, manifestaciones y garantías hechas en el presente instrumento son verdaderas, precisas y ciertas.</p>
        <p>f) Que señala para todo efecto legal su domicilio convencional a fin de oír y recibir notificaciones el ubicado en <span className="font-bold">{c.tenant.address || formattedPropertyAddress || '___________________________'}</span>.</p>
      </div>

      <p>"LAS PARTES" reconocen la personalidad con que comparecen, deciden sujetar el presente contrato al tenor de las siguientes:</p>

      <div className="text-center font-bold mt-8 mb-4">
        <h3>C L Á U S U L A S</h3>
      </div>

      <p><span className="font-bold">PRIMERA. - ARRENDAMIENTO.</span> En este acto y por medio del presente instrumento "EL ARRENDADOR" otorgan el uso y goce temporal a "EL ARRENDATARIO" de "EL INMUEBLE", mismo que se encuentra en buenas condiciones generales, y cumple con los requisitos de salubridad e higiene necesarios para su debida utilización, mismo que en este acto acepta.</p>

      <p><span className="font-bold">SEGUNDA. - DESTINO DEL BIEN ARRENDADO.</span> "EL ARRENDATARIO" destinará el inmueble arrendado, única y exclusivamente para <span className="font-bold uppercase">{propertyUsage}</span>, por lo que en ningún caso y por ningún motivo "EL ARRENDATARIO" podrán ampliar o variar el giro antes mencionado sin la previa autorización por escrito de "EL ARRENDADOR".</p>

      <p><span className="font-bold">TERCERA. - LIMITACIONES DEL INMUEBLE A SUBARRENDAMIENTO, CESIÓN Y TRASPASO.</span> "EL ARRENDATARIO" no podrá bajo ningún motivo o causa subarrendar todo o parte de "EL INMUEBLE" arrendado, así como ceder o traspasar total o parcialmente los derechos y obligaciones derivadas del presente contrato, salvo que "EL ARRENDADOR" dé su consentimiento en forma escrita.</p>

      <p><span className="font-bold">CUARTA. - IMPORTE DE LAS RENTAS Y FORMAS DE PAGO.</span> El importe que fijan ambas "LAS PARTES" de mutuo acuerdo por concepto de pensión rentaría y cuota de mantenimiento para "EL INMUEBLE" objeto de este contrato será la cantidad de <span className="font-bold">${c.terms.monthly_rent} ({rentText || '____________ PESOS 00/100 M.N.'}) MENSUALES</span> por cada uno de los <span className="font-bold">{c.terms.lease_duration_months} MESES</span> de vigencia del presente Contrato, a pagar el día <span className="font-bold">{c.terms.payment_day} de cada mes</span>, mismos que se realizará mediante transferencia electrónica al banco denominado <span className="font-bold">{c.terms.bank_name || '___________'}</span>, cuenta <span className="font-bold">{c.terms.bank_account || '___________'}</span>, y cuenta CLABE <span className="font-bold">{c.terms.bank_clabe || '__________________'}</span>, y cuyo recibo correspondiente será el comprobante bancario CEP de la transferencia realizada.</p>

      <p><span className="font-bold">QUINTA. - DEPÓSITO.</span> Para garantizar que "EL INMUEBLE" arrendado sea devuelto en buen estado, "EL ARRENDATARIO" constituye un depósito a favor de "EL ARRENDADOR" al momento de la firma del presente contrato, por un importe de <span className="font-bold">${c.terms.deposit_amount} ({depositText || '____________ PESOS 00/100 M.N.'})</span>. Este depósito no podrá ser usado para el pago de rentas y será devuelto a "EL ARRENDATARIO" 45 días naturales posteriores a la entrega de "EL INMUEBLE", siempre que éste no presentare daño alguno y no existan adeudos.</p>

      <p><span className="font-bold">SEXTA. - PLAZO DEL CONTRATO.</span> El plazo de arrendamiento será de <span className="font-bold">{c.terms.lease_duration_months} MESES forzosos</span> para ambas partes, iniciando el día <span className="font-bold">{c.terms.lease_start_date || '_________'}</span>. En términos de lo que establece el Código Civil vigente en el estado de <span className="font-bold">Jalisco</span>, "LAS PARTES" convienen en que "EL ARRENDATARIO" no podrá en ningún caso prorrogar el plazo del presente contrato sin el consentimiento expreso y por escrito de "EL ARRENDADOR". Si el contrato se celebra por un plazo forzoso y "EL ARRENDATARIO" desea desocupar antes de su término, para hacerlo deberá estar al corriente en el pago de la renta y pagar la penalidad de <span className="font-bold">{c.terms.early_termination_penalty_months} meses</span> de renta del presente contrato de arrendamiento.</p>

      <p><span className="font-bold">SÉPTIMA. - REPORTE DE DESPERFECTOS.</span> "EL ARRENDATARIO" contará con un plazo improrrogable de 30-treinta días naturales, contados a partir de la fecha de entrega física, para notificar por escrito a "EL ARRENDADOR" sobre la existencia de cualquier vicio.</p>

      <p><span className="font-bold">OCTAVA. - PAGO DE SERVICIOS.</span> "EL ARRENDATARIO" se obliga al pago del suministro de energía eléctrica, agua, gas, servicios de telefonía y/o internet, y cualquier otro servicio que utilice en la operación de "EL INMUEBLE".</p>

      <p><span className="font-bold">NOVENA. - INCUMPLIMIENTO Y PENALIDADES.</span> Convienen "LAS PARTES" que en caso de retraso en el pago de la pensión rentaria, "EL ARRENDATARIO" pagará como pena convencional y por concepto de intereses moratorios obligatorios un <span className="font-bold">{c.terms.late_penalty_percent}% ({c.terms.late_penalty_percent} por ciento)</span> mensual sobre los saldos insolutos, aplicables desde el día siguiente a la fecha límite de pago. Adicionalmente, el incumplimiento de cualquiera de las obligaciones contraídas será causa de RESCISIÓN del contrato, sin necesidad de declaración judicial previa.</p>

      {c.guarantor.includes && (
        <p><span className="font-bold">DÉCIMA. - FIADOR Y OBLIGADO SOLIDARIO.</span> "EL FIADOR" se constituye expresamente como deudor solidario y fiador principal pagador de todas las obligaciones que "EL ARRENDATARIO" contrae en el presente documento, renunciando expresamente a los beneficios de orden y excusión, vigiendo su responsabilidad hasta la entrega a entera satisfacción del inmueble.</p>
      )}

      {c.additional_clauses && (
        <p><span className="font-bold">DÉCIMA. - CLÁUSULAS ADICIONALES PACTADAS.</span> "LAS PARTES" convienen expresamente en las siguientes condiciones específicas relativas a este arrendamiento: <span className="italic">"{c.additional_clauses}"</span>.</p>
      )}

      <p>ENTERADAS "LAS PARTES" CONTRATANTES DEL VALOR Y ALCANCE LEGAL DE TODAS Y CADA UNA DE LAS CLÁUSULAS EXPRESADAS, FIRMAN DE ENTERA CONFORMIDAD EL PRESENTE CONTRATO EN <span className="font-bold">GUADALAJARA, JALISCO, MÉXICO</span>.</p>

      <div className={`grid ${c.guarantor.includes ? 'grid-cols-3 gap-6' : 'grid-cols-2 gap-12'} mt-16 text-center`}>
        <div>
          <div className="border-b border-black mb-2 mx-4"></div>
          <p className="font-bold font-sans">"EL ARRENDADOR"</p>
          <p>{c.landlord.name || 'Nombre y Firma'}</p>
          <p className="text-[9px] mt-1">{c.landlord.id_number}</p>
        </div>
        <div>
          <div className="border-b border-black mb-2 mx-4"></div>
          <p className="font-bold font-sans">"EL ARRENDATARIO"</p>
          <p>{c.tenant.name || 'Nombre y Firma'}</p>
          <p className="text-[9px] mt-1">{c.tenant.id_number}</p>
        </div>
        {c.guarantor.includes && (
          <div>
            <div className="border-b border-black mb-2 mx-4"></div>
            <p className="font-bold font-sans">"EL FIADOR"</p>
            <p>{c.guarantor.name || 'Nombre y Firma'}</p>
            <p className="text-[9px] mt-1">{c.guarantor.id_number}</p>
          </div>
        )}
      </div>

      {c.property.furnished && (
        <div className="mt-16 pt-8 border-t border-gray-300 page-break-before">
          <h3 className="text-center font-bold mb-6">"ANEXO A"<br/>INVENTARIO DE MUEBLES</h3>
          <p className="mb-4">El arrendamiento de "EL INMUEBLE" se pacta en condición <span className="font-bold mb-4">AMUEBLADO</span>, incluyéndose a la firma del contrato y entrega de posesión los siguientes bienes muebles en correcto estado de uso y funcionamiento:</p>
          <ul className="list-disc pl-8 space-y-2">
            {Object.entries(c.property.inventory).map(([key, qty]) => {
              if (qty <= 0) return null;
              const labelMap: Record<string, string> = {
                sofas: 'Sofás o Sillones', camas: 'Camas / Colchones', tv: 'Televisiones',
                comedor: 'Mesas de Comedor y Sillas', refrigerador: 'Refrigerador',
                estufa: 'Estufa / Horno', climas: 'Aires Acondicionados / Minisplits',
                abanicos: 'Abanicos de Techo', boiler: 'Boiler / Calentador de Agua',
              };
              return <li key={key}><span className="font-bold">{qty}</span> x {labelMap[key] || key}</li>;
            })}
            {c.property.additional_items?.filter(i => i.name.trim() && i.qty > 0).map((item) => (
              <li key={item.id}><span className="font-bold">{item.qty}</span> x {item.name}</li>
            ))}
          </ul>
          <p className="mt-8 italic text-xs text-gray-500 text-justify">"EL ARRENDATARIO" se obliga a mantener los bienes listados en correcto estado, respondiendo por el detrimento de los mismos más allá de su uso normal, pudiendo "EL ARRENDADOR" descontar de la garantía cualquier falta o afectación reportada al término del arrendamiento.</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/Antigravity/The_Hub/ClientsVault/Contratos/web-contratos
npx tsc --noEmit
```
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/templates/JaliscoTemplate.tsx
git commit -m "feat: add JaliscoTemplate with Código Civil Jalisco reference"
```

---

## Task 3: Crear QueretaroTemplate.tsx

**Files:**
- Create: `src/components/generator/templates/QueretaroTemplate.tsx`

Igual que JaliscoTemplate, cambiando exactamente 2 strings:
- `Jalisco` → `Querétaro` en SEXTA
- `GUADALAJARA, JALISCO` → `QUERÉTARO, QUERÉTARO` en el cierre

- [ ] **Step 1: Crear archivo**

Copiar todo el contenido de `JaliscoTemplate.tsx` y cambiar:

```tsx
// Línea SEXTA — cambiar:
...el Código Civil vigente en el estado de <span className="font-bold">Jalisco</span>...
// Por:
...el Código Civil vigente en el estado de <span className="font-bold">Querétaro</span>...

// Línea de cierre — cambiar:
...FIRMAN DE ENTERA CONFORMIDAD EL PRESENTE CONTRATO EN <span className="font-bold">GUADALAJARA, JALISCO, MÉXICO</span>...
// Por:
...FIRMAN DE ENTERA CONFORMIDAD EL PRESENTE CONTRATO EN <span className="font-bold">QUERÉTARO, QUERÉTARO, MÉXICO</span>...
```

El nombre del componente exportado debe ser `QueretaroTemplate`.

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/templates/QueretaroTemplate.tsx
git commit -m "feat: add QueretaroTemplate with Código Civil Querétaro reference"
```

---

## Task 4: Crear MeridaTemplate.tsx

**Files:**
- Create: `src/components/generator/templates/MeridaTemplate.tsx`

⚠️ **Importante:** El contrato de Mérida referencia el estado de **Yucatán** (no "Mérida", que es la ciudad capital).

- [ ] **Step 1: Crear archivo**

Copiar JaliscoTemplate y cambiar:

```tsx
// SEXTA:
...el Código Civil vigente en el estado de <span className="font-bold">Yucatán</span>...

// Cierre:
...EN <span className="font-bold">MÉRIDA, YUCATÁN, MÉXICO</span>...
```

El componente exportado: `MeridaTemplate`.

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/templates/MeridaTemplate.tsx
git commit -m "feat: add MeridaTemplate with Código Civil Yucatán reference"
```

---

## Task 5: Crear SanLuisPotosiTemplate.tsx

**Files:**
- Create: `src/components/generator/templates/SanLuisPotosiTemplate.tsx`

- [ ] **Step 1: Crear archivo**

Copiar JaliscoTemplate y cambiar:

```tsx
// SEXTA:
...el Código Civil vigente en el estado de <span className="font-bold">San Luis Potosí</span>...

// Cierre:
...EN <span className="font-bold">SAN LUIS POTOSÍ, SAN LUIS POTOSÍ, MÉXICO</span>...
```

El componente exportado: `SanLuisPotosiTemplate`.

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/templates/SanLuisPotosiTemplate.tsx
git commit -m "feat: add SanLuisPotosiTemplate with Código Civil SLP reference"
```

---

## Task 6: Crear getStateTemplate helper

**Files:**
- Create: `src/components/generator/templates/getStateTemplate.tsx`

Centraliza el switch de plantillas. `ContractPreview` e `ImprimirClient` lo usan.

- [ ] **Step 1: Crear archivo**

```tsx
// src/components/generator/templates/getStateTemplate.tsx
import { NuevoLeonTemplate } from "./NuevoLeonTemplate";
import { JaliscoTemplate } from "./JaliscoTemplate";
import { QueretaroTemplate } from "./QueretaroTemplate";
import { MeridaTemplate } from "./MeridaTemplate";
import { SanLuisPotosiTemplate } from "./SanLuisPotosiTemplate";

export function getStateTemplate(state: string) {
  switch (state) {
    case 'jalisco': return JaliscoTemplate;
    case 'queretaro': return QueretaroTemplate;
    case 'merida': return MeridaTemplate;
    case 'san-luis-potosi': return SanLuisPotosiTemplate;
    default: return NuevoLeonTemplate;
  }
}

export function getStateName(state: string): string {
  switch (state) {
    case 'nuevo-leon': return 'NUEVO LEÓN';
    case 'jalisco': return 'JALISCO';
    case 'queretaro': return 'QUERÉTARO';
    case 'merida': return 'YUCATÁN';
    case 'san-luis-potosi': return 'SAN LUIS POTOSÍ';
    case 'cdmx': return 'CIUDAD DE MÉXICO';
    case 'edomex': return 'ESTADO DE MÉXICO';
    default: return '[ESTADO SELECCIONADO]';
  }
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/templates/getStateTemplate.tsx
git commit -m "feat: add getStateTemplate helper — centralize state→template switch"
```

---

## Task 7: Actualizar ContractPreview.tsx

**Files:**
- Modify: `src/components/generator/ContractPreview.tsx`

Quitar `NuevoLeonTemplate` hardcodeado. Usar `getStateTemplate` y `getStateName`.

- [ ] **Step 1: Reemplazar imports y lógica**

```tsx
// Reemplazar:
import { NuevoLeonTemplate } from "./templates/NuevoLeonTemplate";

// Por:
import { getStateTemplate, getStateName } from "./templates/getStateTemplate";
```

- [ ] **Step 2: Reemplazar la función `getStateName` local y el render del template**

En `ContractPreview.tsx`, eliminar la función `getStateName` local (líneas ~16-26) y reemplazar la línea del template:

```tsx
// Eliminar toda la función getStateName local

// Antes:
<NuevoLeonTemplate />

// Después:
{(() => {
  const Template = getStateTemplate(contract.state);
  return <Template />;
})()}
```

Y en el texto del header donde dice `getStateName(contract.state)`:
```tsx
// Antes (llamada local):
CÓDIGO CIVIL PARA EL ESTADO DE {getStateName(contract.state)}

// Después (del helper importado):
CÓDIGO CIVIL PARA EL ESTADO DE {getStateName(contract.state)}
// (misma llamada, solo que ahora usa el import del helper)
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/generator/ContractPreview.tsx
git commit -m "fix: ContractPreview uses getStateTemplate — removes NuevoLeonTemplate hardcode"
```

---

## Task 8: Actualizar ImprimirClient.tsx

**Files:**
- Modify: `src/app/imprimir/ImprimirClient.tsx`

- [ ] **Step 1: Reemplazar imports y render**

```tsx
// Reemplazar:
import { NuevoLeonTemplate } from "@/components/generator/templates/NuevoLeonTemplate";

// Por:
import { getStateTemplate } from "@/components/generator/templates/getStateTemplate";
```

```tsx
// Reemplazar (en el return):
<NuevoLeonTemplate />

// Por:
{(() => {
  const Template = getStateTemplate(contractData.state);
  return <Template />;
})()}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/imprimir/ImprimirClient.tsx
git commit -m "fix: ImprimirClient uses getStateTemplate — correct template printed per state"
```

---

## Task 9: Generar imágenes de estado con línea gráfica consistente

**Files:**
- Generate: `public/images/states/queretaro.png`
- Generate: `public/images/states/merida.png`
- Generate: `public/images/states/san-luis-potosi.png`

**Línea gráfica analizada de imágenes existentes:**
- `nuevo-leon.png`: Torre de cristal modernista con montañas al fondo, golden hour, cielo dramático naranja/dorado
- `jalisco.png`: Residencia de ladrillo estilo colonial mexicano, jardín tropical exuberante, luz cálida de atardecer

**Patrón común:** Arquitectura icónica local · Golden hour sunset · Warm orange-gold tones · High-end real estate photography · 1024×1024 · Sin texto ni personas

⚠️ `jalisco.png` ya existe — no regenerar.

- [ ] **Step 1: Generar imagen de Querétaro**

Usar FAL AI (`fal-ai/flux/dev`) con este prompt exacto:

```
Querétaro Mexico iconic colonial stone aqueduct arches in background, elegant colonial residential building with warm terracotta walls and ornate wrought iron details, lush garden with agave plants, dramatic golden hour sunset sky with orange and amber clouds, high-end real estate architectural photography, ultra-sharp detail, no people, 1024x1024
```

Guardar output como: `public/images/states/queretaro.png` (1024×1024, JPEG)

- [ ] **Step 2: Generar imagen de Mérida**

Prompt para FAL AI:

```
Mérida Yucatán Mexico elegant colonial hacienda style residential home, white stucco walls with yellow ochre accents, ornate arched doorways, tropical garden with palm trees and bougainvillea flowers, warm golden sunset light filtering through lush greenery, dramatic orange sky, high-end architectural photography, ultra-sharp, no people, 1024x1024
```

Guardar output como: `public/images/states/merida.png` (1024×1024, JPEG)

- [ ] **Step 3: Generar imagen de San Luis Potosí**

Prompt para FAL AI:

```
San Luis Potosí Mexico colonial architecture, elegant stone residential building with carved facade, central courtyard with fountain visible through ornate iron gate, desert-adapted garden with agave and succulents, warm dramatic golden sunset sky, high contrast cinematic real estate photography, ultra-sharp detail, no people, 1024x1024
```

Guardar output como: `public/images/states/san-luis-potosi.png` (1024×1024, JPEG)

- [ ] **Step 4: Verificar consistencia visual**

Abrir las 5 imágenes (nuevo-leon, jalisco + las 3 nuevas) y confirmar:
- Todas tienen warm golden hour lighting
- Ninguna tiene personas ni texto
- Calidad y estilo es coherente entre sí

- [ ] **Step 5: Commit**

```bash
git add public/images/states/queretaro.png public/images/states/merida.png public/images/states/san-luis-potosi.png
git commit -m "feat: add generated state images for queretaro, merida, san-luis-potosi matching visual style"
```

---

## Task 10: Actualizar StateStep.tsx

**Files:**
- Modify: `src/components/generator/steps/StateStep.tsx`

- [ ] **Step 1: Reemplazar el array ESTATES**

```tsx
// Reemplazar toda la constante ESTATES con:
const ESTATES = [
  { id: 'nuevo-leon', name: 'Nuevo León', code: 'NL', available: true },
  { id: 'jalisco', name: 'Jalisco', code: 'JAL', available: true },
  { id: 'queretaro', name: 'Querétaro', code: 'QRO', available: true },
  { id: 'merida', name: 'Mérida, Yucatán', code: 'YUC', available: true },
  { id: 'san-luis-potosi', name: 'San Luis Potosí', code: 'SLP', available: true },
  { id: 'cdmx', name: 'Ciudad de México', code: 'CDMX', available: false },
  { id: 'edomex', name: 'Estado de México', code: 'EDOMEX', available: false },
];
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```
Expected: sin errores (los IDs nuevos ya están en el type union del Task 1).

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/steps/StateStep.tsx
git commit -m "feat: activate Jalisco, Queretaro, Merida, SLP in StateStep"
```

---

## Task 11: Actualizar StateCards.tsx

**Files:**
- Modify: `src/components/home/StateCards.tsx`

- [ ] **Step 1: Reemplazar array states**

```tsx
// Reemplazar la constante states con:
const states = [
  { id: 'nuevo-leon', name: 'Nuevo León', code: 'CÓDIGO CIVIL DE NUEVO LEÓN', count: '1,429', image: '/images/states/nuevo-leon.png', available: true },
  { id: 'jalisco', name: 'Jalisco', code: 'CÓDIGO CIVIL DE JALISCO', count: '1,102', image: '/images/states/jalisco.png', available: true },
  { id: 'queretaro', name: 'Querétaro', code: 'CÓDIGO CIVIL DE QUERÉTARO', count: '687', image: '/images/states/queretaro.png', available: true },
  { id: 'merida', name: 'Mérida, Yucatán', code: 'CÓDIGO CIVIL DE YUCATÁN', count: '543', image: '/images/states/merida.png', available: true },
  { id: 'san-luis-potosi', name: 'San Luis Potosí', code: 'CÓDIGO CIVIL DE SAN LUIS POTOSÍ', count: '421', image: '/images/states/san-luis-potosi.png', available: true },
  { id: 'cdmx', name: 'Ciudad de México', code: 'CÓDIGO CIVIL PARA EL D.F.', count: '3,842', image: '/images/states/cdmx.png', available: false },
];
```

El grid es `md:grid-cols-2` — 6 cards = 3 filas en desktop, 6 en mobile. Correcto.

- [ ] **Step 2: Verificar que el href apunta al generador**

El CardWrapper para estados `available: true` ya apunta a `href: '/contrato'`. Verificar que sigue igual — NO hay que cambiar nada aquí.

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/home/StateCards.tsx
git commit -m "feat: activate 4 new states in StateCards — Jalisco, Querétaro, Mérida, SLP"
```

---

## Task 12: Actualizar Hero dropdown y stat

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

Cambios necesarios:
1. Activar JAL, QRO, MER, SLP en el dropdown
2. El botón "Generar Contrato" debe pasar `?estado=` en la URL para pre-seleccionar en el generador
3. El stat "NL · Disponible Ahora" debe reflejar los 5 estados activos

- [ ] **Step 1: Reemplazar el array `states` del dropdown**

```tsx
// Reemplazar la constante states con:
const states = [
  { id: "nuevo-leon", label: "Nuevo León", code: "NL", available: true },
  { id: "jalisco", label: "Jalisco", code: "JAL", available: true },
  { id: "queretaro", label: "Querétaro", code: "QRO", available: true },
  { id: "merida", label: "Mérida, Yucatán", code: "YUC", available: true },
  { id: "san-luis-potosi", label: "San Luis Potosí", code: "SLP", available: true },
  { id: "cdmx", label: "CDMX", code: "CDMX", available: false },
  { id: "edomex", label: "Estado de México", code: "EDOMEX", available: false },
];
```

- [ ] **Step 2: Cambiar `selectedState` default y tipo**

```tsx
// Cambiar:
const [selectedState, setSelectedState] = useState("");

// Por:
const [selectedState, setSelectedState] = useState("nuevo-leon");
```

- [ ] **Step 3: Hacer el Link dinámico con `?estado=`**

```tsx
// Reemplazar el Link de "Generar Contrato":
<Link
  href={selectedState ? `/contrato?estado=${selectedState}` : '/contrato'}
  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#4D6BFE] text-white text-lg font-bold rounded-lg hover:bg-[#3b55d9] transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
>
  Generar Contrato <ArrowRight className="w-5 h-5" />
</Link>
```

- [ ] **Step 4: Actualizar el stat "NL · Disponible Ahora"**

```tsx
// Reemplazar el bloque del stat con:
<div>
  <p className="text-3xl md:text-4xl font-black text-white">5</p>
  <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-[0.15em] mt-1">Estados Disponibles</p>
</div>
```

- [ ] **Step 5: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat: activate 5 states in hero dropdown, dynamic ?estado= link, update stat"
```

---

## Task 13: StateStep lee URL param `?estado=` para pre-seleccionar

**Files:**
- Modify: `src/components/generator/steps/StateStep.tsx`

Cuando el usuario llega desde el hero habiendo seleccionado un estado, el generador debe pre-seleccionarlo automáticamente en el Step 1.

- [ ] **Step 1: Agregar lectura del query param al montar**

```tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useContractStore } from "@/store/useContractStore";
import { MapPin } from "lucide-react";

const ESTATES = [
  { id: 'nuevo-leon', name: 'Nuevo León', code: 'NL', available: true },
  { id: 'jalisco', name: 'Jalisco', code: 'JAL', available: true },
  { id: 'queretaro', name: 'Querétaro', code: 'QRO', available: true },
  { id: 'merida', name: 'Mérida, Yucatán', code: 'YUC', available: true },
  { id: 'san-luis-potosi', name: 'San Luis Potosí', code: 'SLP', available: true },
  { id: 'cdmx', name: 'Ciudad de México', code: 'CDMX', available: false },
  { id: 'edomex', name: 'Estado de México', code: 'EDOMEX', available: false },
];

export function StateStep() {
  const { contract, updateContract, nextStep } = useContractStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam) {
      const match = ESTATES.find(e => e.id === estadoParam && e.available);
      if (match) {
        updateContract('state', match.id);
      }
    }
  }, []);

  return (
    // ... mismo JSX del StateStep existente con el array ESTATES actualizado
  );
}
```

⚠️ El componente usa `useSearchParams()` — requiere que el page padre esté envuelto en `<Suspense>`. Verificar `src/app/contrato/page.tsx` y agregar `<Suspense>` si no está.

- [ ] **Step 2: Verificar que `/contrato/page.tsx` tiene Suspense**

```tsx
// En src/app/contrato/page.tsx, si ContractEngine o StateStep usan useSearchParams,
// el componente debe estar dentro de <Suspense>:
import { Suspense } from "react";

export default function ContratoPage() {
  return (
    <Suspense fallback={null}>
      <ContractEngine />
    </Suspense>
  );
}
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Verificar flujo completo manualmente**

```
1. Ir a /contrato?estado=jalisco
2. Confirmar que Jalisco aparece pre-seleccionado en Step 1
3. Repetir con ?estado=queretaro, ?estado=merida, ?estado=san-luis-potosi
4. Ir a /contrato sin param — debe iniciar sin estado seleccionado
```

- [ ] **Step 5: Commit**

```bash
git add src/components/generator/steps/StateStep.tsx src/app/contrato/page.tsx
git commit -m "feat: StateStep reads ?estado= URL param to pre-select state from hero"
```

---

## Task 14: Push final y verificación end-to-end

- [ ] **Step 1: Push a GitHub (dispara deploy en Vercel)**

```bash
git push origin main
```

- [ ] **Step 2: Verificar Hero en home (`/`)**

1. Abrir home `/`
2. Click en dropdown del hero — debe mostrar: NL ✓, Jalisco ✓, Querétaro ✓, Mérida ✓, SLP ✓, CDMX "Próximamente", EDOMEX "Próximamente"
3. Seleccionar Jalisco → click "Generar Contrato" → debe redirigir a `/contrato?estado=jalisco`
4. El stat debe mostrar "5 · Estados Disponibles"

- [ ] **Step 3: Verificar StateCards en home**

1. Scroll a sección "Contratos adaptados a tu estado"
2. Confirmar 6 cards visibles: NL, JAL, QRO, MER, SLP (todas activas), CDMX (próximamente)
3. Verificar que las imágenes de QRO, MER, SLP cargan correctamente y tienen la línea visual consistente
4. Click en card Jalisco → va a `/contrato`

- [ ] **Step 4: Verificar generador (`/contrato`)**

1. Ir a `/contrato?estado=jalisco` → Step 1 debe tener Jalisco pre-seleccionado
2. Avanzar al preview → texto debe decir "Código Civil vigente en el estado de **Jalisco**"
3. Cierre del contrato debe decir "**GUADALAJARA, JALISCO, MÉXICO**"
4. Repetir para `?estado=queretaro` → "**Querétaro**" + "**QUERÉTARO, QUERÉTARO, MÉXICO**"
5. Repetir para `?estado=merida` → "**Yucatán**" + "**MÉRIDA, YUCATÁN, MÉXICO**"
6. Repetir para `?estado=san-luis-potosi` → "**San Luis Potosí**" + "**SAN LUIS POTOSÍ, S.L.P., MÉXICO**"

- [ ] **Step 5: Verificar imprimir**

Con un contrato de Jalisco en status `paid`, ir a `/imprimir?token=...` y confirmar que imprime el template de Jalisco (no Nuevo León).

---

## Checklist de cobertura de campos

Verificar que ningún campo del formulario queda sin mapear en ninguno de los 4 templates:

| Campo del formulario | Mapeado en template | ✓ |
|---|---|---|
| `landlord.name` | Párrafo intro + sección firma | ✓ |
| `landlord.id_number` | Sección firma | ✓ |
| `landlord.address` | Declaración I.g | ✓ |
| `tenant.name` | Párrafo intro + sección firma | ✓ |
| `tenant.id_number` | Sección firma | ✓ |
| `tenant.address` | Declaración II.f | ✓ |
| `property.address.*` | Declaración I.b (formattedPropertyAddress) | ✓ |
| `property.type` | Declaración I.e (propertyLabel) + SEGUNDA (propertyUsage) | ✓ |
| `property.furnished` | ANEXO A (condicional) | ✓ |
| `property.inventory` | ANEXO A — lista de items | ✓ |
| `property.additional_items` | ANEXO A — items adicionales | ✓ |
| `terms.monthly_rent` | CUARTA | ✓ |
| `terms.deposit_amount` | QUINTA | ✓ |
| `terms.lease_duration_months` | CUARTA + SEXTA | ✓ |
| `terms.lease_start_date` | SEXTA | ✓ |
| `terms.payment_day` | CUARTA | ✓ |
| `terms.bank_name` | CUARTA | ✓ |
| `terms.bank_account` | CUARTA | ✓ |
| `terms.bank_clabe` | CUARTA | ✓ |
| `terms.late_penalty_percent` | NOVENA | ✓ |
| `terms.early_termination_penalty_months` | SEXTA | ✓ |
| `guarantor.includes` | Párrafo intro (condicional) + DÉCIMA | ✓ |
| `guarantor.name` | Párrafo intro + sección firma | ✓ |
| `guarantor.id_number` | Sección firma | ✓ |
| `additional_clauses` | DÉCIMA adicional (condicional) | ✓ |

**Campos del store NO en el formulario actual** (no aparecen en templates):
- `landlord.email`, `landlord.phone` — datos internos, no requeridos legalmente en el contrato impreso
- `tenant.email`, `tenant.phone` — ídem
- `guarantor.address`, `guarantor.email`, `guarantor.phone` — ídem

Todos los campos del formulario están cubiertos.
