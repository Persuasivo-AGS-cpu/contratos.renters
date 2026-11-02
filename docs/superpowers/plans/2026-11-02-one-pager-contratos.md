# One-pager de contratos.renters.mx — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir contratos.renters.mx en una sola página que baja por secciones (Resumen, Cómo funciona, Estados, Precio, Dudas rápidas, Cierre, Soporte), con el submenú en una burbuja bajo "Contratos" en la misma barra del sitio, todos los botones funcionando y el estilo visual de renters.mx.

**Architecture:** La home actual (`src/app/page.tsx`) ya compone secciones; se reordena, se agregan 3 secciones nuevas (Cómo funciona, Dudas rápidas, Soporte) y se quitan 3 que sobran (TrustBar, AboutRenters, FaqSection). El `Navbar` global (renderizado en `layout.tsx`) pierde la segunda barra y gana un componente `ContratosMenu` con la burbuja. Los ids de ancla y el contenido del menú viven en un solo archivo (`src/lib/contratosNav.ts`) y un test impide que el menú apunte a un id que no existe.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (tokens en `src/app/globals.css`), `@radix-ui/react-accordion` (ya instalado), `lucide-react`, `framer-motion`, tests con `node --test`.

**Reglas de este proyecto que el plan respeta**
- `AGENTS.md`: esta versión de Next tiene cambios incompatibles; leer `node_modules/next/dist/docs/` antes de escribir código de Next (Task 0).
- Cada merge a `main` despliega a producción. **No se mezcla sin el "mezcla" explícito de Abraham.** El trabajo va en una rama y se revisa en el deploy de preview.
- Textos: nada de promesas absolutas ("legalmente válido", "redactado por abogados", "válido ante autoridades", "100% protegido"), nada de "no compartimos tus datos con terceros", nada de promesa de factura. Están pendientes de revisión legal. Los datos prometidos salen de `src/lib/compra.ts` (cada valor allí debe ser cierto hoy).

**Fuera de alcance (a propósito)**
- Unificar la página de contacto con www (se decide aparte; esta página solo enlaza a `/contacto` existente).
- Aviso de privacidad y Términos duplicados con www.
- `metadata.description` y `openGraph` en `src/app/layout.tsx` dicen "legalmente válido"; se reportan, no se cambian aquí.
- El dato "< 6 min Tiempo promedio" del héroe no está verificado (un cliente real tardó 31 min); se deja y se reporta.
- Textos provisionales: correo `hola@renters.mx` y horario 9:00–18:00 se usan hasta que Abraham confirme (están en un solo archivo, Task 3).

---

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/lib/contratosNav.ts` | Crear | Items del menú (id, etiqueta, descripción, href ancla) |
| `src/lib/contratosNav.test.mjs` | Crear | Garantiza que cada ancla del menú existe en alguna sección |
| `src/lib/contactInfo.ts` | Crear | Datos de contacto visibles en un solo lugar |
| `src/lib/contactInfo.test.mjs` | Crear | WhatsApp y teléfono coinciden |
| `src/components/layout/ContratosMenu.tsx` | Crear | Botón "Contratos ▾" con burbuja |
| `src/components/layout/Navbar.tsx` | Reescribir | Una sola barra; CTA "Generar contrato"; acordeón móvil |
| `src/app/globals.css` | Modificar | Scroll suave + margen de ancla bajo la barra fija |
| `src/components/home/ComoFuncionaSection.tsx` | Crear | 4 pasos con capturas reales en teléfono |
| `src/components/home/DudasAccordion.tsx` | Crear | Acordeón accesible (client) |
| `src/components/home/DudasRapidasSection.tsx` | Crear | 5 preguntas con datos de `compra.ts` |
| `src/components/home/SoporteSection.tsx` | Crear | WhatsApp, correo, horario, botón a `/contacto` |
| `src/components/home/HeroSection.tsx` | Modificar | `id="resumen"` + textos sin promesas absolutas |
| `src/components/home/StateCards.tsx` | Modificar | `id="estados"` + texto |
| `src/components/home/PricingSection.tsx` | Modificar | `id="precio"` + quitar badge y comparación sin sustento |
| `src/components/home/CtaSection.tsx` | Modificar | Texto sin promesas |
| `src/app/page.tsx` | Reescribir | Nuevo orden de secciones |
| `src/components/layout/Footer.tsx` | Modificar | Enlaces a anclas nuevas |
| `src/app/sitemap.ts` | Modificar | Quitar `/como-funciona` |
| `next.config.ts` | Modificar | Redirigir `/como-funciona` a `/#como` |
| `PROJECT_MAP.md` | Modificar | Reflejar el one-page (el repo exige mantenerlo al día) |
| `src/components/home/TrustBar.tsx`, `AboutRenters.tsx`, `FaqSection.tsx` | Borrar | Reemplazados |
| `src/app/como-funciona/page.tsx`, `src/components/como-funciona/*` | Borrar | Ahora es una sección |

Las imágenes `public/images/como-funciona/paso-1..4.png` **se quedan** (las usan el héroe y la nueva sección).

---

### Task 0: Rama limpia y lectura de la documentación de Next

**Files:** ninguno (preparación)

- [ ] **Step 1: Crear la rama desde `main` actualizado**

```bash
cd /Users/abrahamgarza/Documents/Persuasivo/03-Paginas-Clientes/web-contratos-seguridad
git fetch origin
git status --short
git switch -c feat/one-pager-contratos origin/main
```
Expected: `git status --short` vacío antes de cambiar de rama (si no está vacío, detenerse y avisar a Abraham); luego `Switched to a new branch 'feat/one-pager-contratos'`.

- [ ] **Step 2: Confirmar la línea base verde**

```bash
npm test && npm run lint
```
Expected: todos los tests pasan; lint sin errores. Si algo falla antes de tocar nada, anotarlo como preexistente.

- [ ] **Step 3: Leer lo que Next 16 dice sobre navegación con hash y scroll suave**

```bash
grep -rln "scroll-behavior" node_modules/next/dist/docs | head
grep -rn "data-scroll-behavior" node_modules/next/dist/docs | head
```
Expected: lista de archivos. Leer los que salgan. Si la documentación pide `data-scroll-behavior="smooth"` en `<html>` cuando se usa `scroll-behavior: smooth` en CSS, aplicarlo en el Step 3 de Task 4 (en `src/app/layout.tsx`, en la etiqueta `<html lang="es" ...>`). Si no sale nada, no agregar el atributo.

---

### Task 1: Menú como datos + test de anclas

**Files:**
- Create: `src/lib/contratosNav.ts`
- Test: `src/lib/contratosNav.test.mjs`

- [ ] **Step 1: Escribir el test que falla**

`src/lib/contratosNav.test.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTRATOS_MENU } from './contratosNav.ts';

test('los ids del menú son únicos', () => {
  const ids = CONTRATOS_MENU.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada item apunta a /#id', () => {
  for (const item of CONTRATOS_MENU) assert.equal(item.href, `/#${item.id}`);
});
```

(El test que comprueba que cada ancla existe en las secciones se agrega en el Task 9, cuando ya existen los 6 ids; así ningún commit intermedio deja la suite en rojo.)

- [ ] **Step 2: Correr y ver que falla**

Run: `npm test`
Expected: FAIL — `Cannot find module ... contratosNav.ts`.

- [ ] **Step 3: Crear el archivo de datos**

`src/lib/contratosNav.ts`:
```ts
// Submenú de "Contratos". Cada id debe existir como id="..." en una sección de src/components/home
// (contratosNav.test.mjs lo comprueba). Sin imports: el test corre con node, sin alias de Next.
export const CONTRATOS_MENU = [
  { id: 'resumen', label: 'Resumen de contratos', description: 'Contrato personalizado por estado, desde $499', href: '/#resumen' },
  { id: 'como', label: 'Cómo funciona', description: 'Llenas tus datos y descargas el PDF para firmar', href: '/#como' },
  { id: 'estados', label: 'Estados', description: 'Dónde está disponible hoy', href: '/#estados' },
  { id: 'precio', label: 'Precio', description: '$499 MXN, IVA incluido', href: '/#precio' },
  { id: 'dudas', label: 'Dudas rápidas', description: 'Lo que más preguntan antes de comprar', href: '/#dudas' },
  { id: 'soporte', label: 'Soporte', description: 'WhatsApp y correo, de lunes a viernes', href: '/#soporte' },
] as const;

export type ContratosMenuId = (typeof CONTRATOS_MENU)[number]['id'];
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npm test`
Expected: `los ids del menú son únicos` y `cada item apunta a /#id` pasan.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contratosNav.ts src/lib/contratosNav.test.mjs
git commit -m "feat(menu): items del submenú de contratos como datos con test de anclas" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Datos de contacto en un solo lugar

**Files:**
- Create: `src/lib/contactInfo.ts`
- Test: `src/lib/contactInfo.test.mjs`

- [ ] **Step 1: Escribir el test que falla**

`src/lib/contactInfo.test.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACTO } from './contactInfo.ts';

test('el enlace de WhatsApp usa el mismo número que el teléfono visible', () => {
  const digitos = CONTACTO.telefono.replace(/\D/g, '');
  assert.equal(CONTACTO.whatsapp, `https://wa.me/${digitos}`);
});

test('el correo tiene forma válida', () => {
  assert.match(CONTACTO.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npm test`
Expected: FAIL — `Cannot find module ... contactInfo.ts`.

- [ ] **Step 3: Crear el archivo**

`src/lib/contactInfo.ts`:
```ts
// Datos de contacto visibles. PROVISIONAL: correo y horario pendientes de confirmar con Abraham.
// El destino real del formulario (/api/contact) es hola@renters.mx.
export const CONTACTO = {
  email: 'hola@renters.mx',
  telefono: '+52 81 1061 0111',
  whatsapp: 'https://wa.me/528110610111',
  horario: 'Lunes a viernes · 9:00 a 18:00',
} as const;
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npm test`
Expected: los 2 tests nuevos pasan.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contactInfo.ts src/lib/contactInfo.test.mjs
git commit -m "feat(soporte): datos de contacto en un solo archivo" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Burbuja de "Contratos" y barra única

**Files:**
- Create: `src/components/layout/ContratosMenu.tsx`
- Rewrite: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Crear `ContratosMenu.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileSignature, CheckCircle, MapPin, ShieldCheck, MessageCircle, Mail } from "lucide-react";
import { CONTRATOS_MENU, type ContratosMenuId } from "@/lib/contratosNav";

const ICONOS: Record<ContratosMenuId, typeof MapPin> = {
  resumen: FileSignature,
  como: CheckCircle,
  estados: MapPin,
  precio: ShieldCheck,
  dudas: MessageCircle,
  soporte: Mail,
};

// En escritorio con cursor la burbuja abre al pasar el mouse; en táctil, con toque.
const hayHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export function ContratosMenu() {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => hayHover() && setAbierto(true)}
      onMouseLeave={() => hayHover() && setAbierto(false)}
    >
      <button
        type="button"
        aria-expanded={abierto}
        aria-haspopup="true"
        aria-controls="menu-contratos"
        // Con hover, el clic no debe cerrar lo que el mouse acaba de abrir.
        onClick={() => setAbierto((a) => (hayHover() ? true : !a))}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-2 text-[13.5px] font-medium text-[#3563E9] transition-colors"
      >
        Contratos
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div id="menu-contratos" className="absolute left-1/2 top-full z-50 w-[360px] -translate-x-1/2 pt-3">
          <div className="relative rounded-2xl border border-border-layout bg-white p-2 shadow-2xl shadow-slate-900/10 before:absolute before:-top-1.5 before:left-1/2 before:-ml-1.5 before:size-3 before:rotate-45 before:border-l before:border-t before:border-border-layout before:bg-white">
            {CONTRATOS_MENU.map((item, i) => {
              const Icono = ICONOS[item.id];
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className={`flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none ${
                    i === 0 ? "mb-1.5 border-b border-border-layout rounded-b-none pb-3" : ""
                  }`}
                >
                  <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-[#EEF2FF] text-[#3563E9]">
                    <Icono className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-main">{item.label}</span>
                    <span className="mt-0.5 block text-[12.5px] text-text-muted">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Reescribir `Navbar.tsx` (una sola barra)**

```tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ContratosMenu } from './ContratosMenu';
import { CONTRATOS_MENU } from '@/lib/contratosNav';

const WWW = 'https://www.renters.mx';

// Mismo menú que www.renters.mx (mismos enlaces, mismo orden), todo en la misma pestaña.
// "Contratos" es esta sección: abre la burbuja con las secciones de la página.
const links = [
  { name: "Inicio", href: `${WWW}/` },
  { name: "Servicios", href: `${WWW}/servicios` },
  { name: "Cómo funciona", href: `${WWW}/como-funciona` },
  { name: "Paquetes", href: `${WWW}/paquetes` },
  { name: "Contratos", href: "/" },
  { name: "Preguntas frecuentes", href: `${WWW}/preguntas-frecuentes` },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Renters, contratos">
      <Image src="/logo-renters.png" alt="Renters" width={666} height={440} className="h-12 w-auto" priority />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú móvil al navegar a otra ruta.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Generador: sin menú completo, para que quien llena datos no tenga salidas que distraigan.
  if (pathname === "/contrato") {
    return (
      <nav className="w-full h-16 border-b border-border-layout bg-white/95 backdrop-blur flex items-center justify-between px-4 md:px-12 z-50 sticky top-0">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 min-h-11">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <Logo />
        <a
          href={`${WWW}/preguntas-frecuentes?tema=contratos`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-end min-h-11 w-16 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ¿Dudas?
        </a>
      </nav>
    );
  }

  return (
    <nav className="w-full h-20 border-b border-border-layout bg-white/95 backdrop-blur flex items-center justify-between px-6 md:px-12 z-50 sticky top-0">
      <Logo />

      <ul className="hidden xl:flex items-center gap-1">
        {links.map((link) => (
          <li key={link.name}>
            {link.name === "Contratos" ? (
              <ContratosMenu />
            ) : (
              <Link href={link.href} className="px-3 py-2 text-[13.5px] font-medium rounded-full text-slate-600 hover:text-slate-900 transition-colors">
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <Link
          href={`${WWW}/contacto`}
          className="hidden md:inline-flex border border-slate-200 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Contacto
        </Link>
        <Link
          href={`${WWW}/brokers`}
          className="hidden lg:inline-flex border border-slate-200 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          Soy Broker
        </Link>
        <Link
          href="/contrato"
          className="hidden sm:inline-flex bg-[#3563E9] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#2951CB] transition-colors whitespace-nowrap"
        >
          Generar contrato
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="xl:hidden flex items-center justify-center w-11 h-11 rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border-b border-border-layout shadow-lg py-2 flex flex-col">
          {links.map((link) =>
            link.name === "Contratos" ? (
              <details key={link.name} open className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-8 py-4 text-[16px] font-medium bg-[#EEF2FF] text-[#3563E9]">
                  Contratos <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                {CONTRATOS_MENU.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-12 py-3 text-[15px] text-slate-600 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </details>
            ) : (
              <Link key={link.name} href={link.href} className="px-8 py-4 text-[16px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {link.name}
              </Link>
            ),
          )}
          <Link href={`${WWW}/contacto`} className="px-8 py-4 text-[16px] font-medium text-slate-700 hover:bg-slate-50">Contacto</Link>
          <Link href={`${WWW}/brokers`} className="px-8 py-4 text-[16px] font-medium text-slate-700 hover:bg-slate-50">Soy Broker</Link>
          <Link href="/contrato" className="mx-6 my-3 rounded-full bg-[#3563E9] px-6 py-3.5 text-center text-[16px] font-semibold text-white">
            Generar contrato
          </Link>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 3: Verificar tipos y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores. (Si `ChevronDown`/`FileSignature`/etc. no existen en la versión instalada de `lucide-react`, el error lo dirá; ya se usan en `HeroSection`, `TrustBar`, `StateCards`, `ContactInfo`, `FaqSection`, así que no debería pasar.)

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ContratosMenu.tsx src/components/layout/Navbar.tsx
git commit -m "feat(menu): una sola barra con burbuja bajo Contratos y acordeón móvil" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Scroll suave y margen de ancla

**Files:**
- Modify: `src/app/globals.css` (después del bloque `body { ... }`, línea ~26-31)
- Modify (condicional): `src/app/layout.tsx`

- [ ] **Step 1: Agregar el CSS**

Insertar justo después del bloque `body { ... }` en `src/app/globals.css`:
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 6rem; /* barra fija de 5rem + aire */
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Comprobar que compila**

Run: `npm run build`
Expected: build exitoso. (Si el build avisa de `data-scroll-behavior`, seguir el Step 3.)

- [ ] **Step 3 (solo si la documentación leída en Task 0 Step 3 o el build lo piden): atributo en `<html>`**

En `src/app/layout.tsx`, cambiar:
```tsx
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
```
por:
```tsx
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat(menu): scroll suave y margen de ancla bajo la barra fija" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Sección "Cómo funciona" con capturas reales

**Files:**
- Create: `src/components/home/ComoFuncionaSection.tsx`

- [ ] **Step 1: Crear el componente** (id `como`; 4 pasos como botones que cambian la captura; las 4 imágenes quedan montadas para que el cambio no parpadee)

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Phone } from "@/components/shared/Phone";
import { Reveal } from "@/components/shared/Reveal";
import { getAvailableStatesList } from "@/lib/states";

const PASOS = [
  {
    titulo: "Elige tu estado",
    texto: `Selecciona dónde está la propiedad y cargamos la plantilla que corresponde: ${getAvailableStatesList()}.`,
    imagen: "/images/como-funciona/paso-1.png",
    alt: "Selector de estado en el generador de contrato",
  },
  {
    titulo: "Llena el formulario, sin tecnicismos",
    texto: "Preguntas claras sobre la propiedad, el arrendador, el inquilino y los términos. ¿No tienes la INE o la CLABE a la mano? Márcalo pendiente y complétalo antes de firmar.",
    imagen: "/images/como-funciona/paso-2.png",
    alt: "Formulario de datos del arrendador",
  },
  {
    titulo: "Revisa tu contrato armado",
    texto: "Ves el resumen completo con tus datos exactos antes de pagar. Lo que revisas es lo que recibes.",
    imagen: "/images/como-funciona/paso-3.png",
    alt: "Resumen del contrato antes de pagar",
  },
  {
    titulo: "Paga y recibe tu PDF",
    texto: "Un solo pago de $499 MXN con Stripe, sin suscripción. El PDF llega a tu correo, listo para imprimir y firmar.",
    imagen: "/images/como-funciona/paso-4.png",
    alt: "Pago seguro de $499 MXN con Stripe",
  },
];

export function ComoFuncionaSection() {
  const [activo, setActivo] = useState(0);

  return (
    <section id="como" className="w-full bg-surface-subtle px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#3563E9]">Cómo funciona</div>
          <h2 className="mb-4 font-display text-3xl font-black tracking-tight text-text-main md:text-5xl">
            Cuatro pasos, sin tecnicismos
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-muted">
            Tú marcas el ritmo. Revisas todo antes de pagar y no hay suscripción.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <ol className="space-y-3">
              {PASOS.map((p, i) => (
                <li key={p.titulo}>
                  <button
                    type="button"
                    onClick={() => setActivo(i)}
                    aria-current={i === activo ? "step" : undefined}
                    className={`flex w-full gap-5 rounded-2xl border p-6 text-left transition-all ${
                      i === activo
                        ? "border-[#3563E9]/40 bg-white shadow-xl shadow-blue-900/5"
                        : "border-transparent hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`flex size-10 flex-none items-center justify-center rounded-full text-sm font-bold ${
                        i === activo ? "bg-[#3563E9] text-white" : "bg-[#EEF2FF] text-[#3563E9]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-text-main">{p.titulo}</span>
                      <span className="mt-1 block leading-relaxed text-text-muted">{p.texto}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <Link
              href="/contrato"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3563E9] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2951CB]"
            >
              Generar contrato <ArrowRight className="size-5" />
            </Link>
          </Reveal>

          <div className="hidden justify-center lg:flex">
            <div className="w-full max-w-[300px]">
              <Phone>
                <div className="relative h-full w-full">
                  {PASOS.map((p, i) => (
                    <Image
                      key={p.imagen}
                      src={p.imagen}
                      alt={p.alt}
                      width={390}
                      height={844}
                      sizes="300px"
                      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
                        i === activo ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </Phone>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ComoFuncionaSection.tsx
git commit -m "feat(onepage): sección Cómo funciona con capturas reales" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Dudas rápidas

**Files:**
- Create: `src/components/home/DudasAccordion.tsx`
- Create: `src/components/home/DudasRapidasSection.tsx`

- [ ] **Step 1: Crear el acordeón (client)**

`src/components/home/DudasAccordion.tsx`:
```tsx
"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export type Duda = { q: string; a: string; accion?: { label: string; href: string } };

export function DudasAccordion({ items }: { items: Duda[] }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="d0" className="space-y-3">
      {items.map((d, i) => (
        <Accordion.Item
          key={d.q}
          value={`d${i}`}
          className="overflow-hidden rounded-2xl border border-border-layout bg-white transition-all data-[state=open]:border-[#3563E9]/40 data-[state=open]:shadow-lg data-[state=open]:shadow-blue-900/5"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-text-main">
              {d.q}
              <ChevronDown className="size-5 shrink-0 text-[#3563E9] transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-6 pb-5 leading-relaxed text-text-muted">
            <p>{d.a}</p>
            {d.accion && (
              <Link href={d.accion.href} className="mt-3 inline-block font-semibold text-[#3563E9] hover:underline">
                {d.accion.label}
              </Link>
            )}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
```

- [ ] **Step 2: Crear la sección (server)** — los datos prometidos salen de `@/lib/compra` y `@/lib/states`

`src/components/home/DudasRapidasSection.tsx`:
```tsx
import { CORRECCION_GRATIS_HORAS, ENLACE_VIGENCIA_DIAS } from "@/lib/compra";
import { getAvailableStatesList } from "@/lib/states";
import { DudasAccordion, type Duda } from "./DudasAccordion";

const DUDAS: Duda[] = [
  {
    q: "¿Cuánto tarda?",
    a: "Tú marcas el ritmo: son preguntas sobre la propiedad, el arrendador, el inquilino y los términos, y puedes dejar pendientes la INE y la CLABE. Al pagar, el PDF te llega por correo.",
  },
  {
    q: "¿Para qué estados está disponible?",
    a: `Disponible en ${getAvailableStatesList()}. Ciudad de México y Estado de México: próximamente.`,
  },
  {
    q: "¿Cómo pago?",
    a: "Con tarjeta de crédito o débito, procesada por Stripe. Es un solo pago de $499 MXN, IVA incluido, sin suscripción.",
  },
  {
    q: "¿Puedo corregir datos después de comprar?",
    a: `Sí, sin costo durante las primeras ${CORRECCION_GRATIS_HORAS} horas. Responde al correo con tu contrato y lo ajustamos.`,
  },
  {
    q: "¿Qué recibo y por cuánto tiempo puedo descargarlo?",
    a: `Un PDF por correo, con un enlace de descarga que dura ${ENLACE_VIGENCIA_DIAS} días. Si lo necesitas de nuevo, puedes pedir que te reenviemos el enlace.`,
    accion: { label: "Reenviar mi enlace", href: "/reenviar-enlace" },
  },
];

export function DudasRapidasSection() {
  return (
    <section id="dudas" className="w-full bg-surface-clean px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#3563E9]">Dudas rápidas</div>
          <h2 className="mb-3 font-display text-3xl font-black tracking-tight text-text-main md:text-[40px]">
            Lo que más preguntan antes de comprar
          </h2>
        </div>
        <DudasAccordion items={DUDAS} />
        <p className="mt-8 text-center">
          <a
            href="https://www.renters.mx/preguntas-frecuentes?tema=contratos"
            className="font-semibold text-[#3563E9] hover:underline"
          >
            Ver todas las preguntas →
          </a>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/DudasAccordion.tsx src/components/home/DudasRapidasSection.tsx
git commit -m "feat(onepage): dudas rápidas con datos verificados de compra.ts" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Sección Soporte

**Files:**
- Create: `src/components/home/SoporteSection.tsx`

- [ ] **Step 1: Crear el componente (server)**

```tsx
import Link from "next/link";
import { Mail, Phone as TelefonoIcono, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { CONTACTO } from "@/lib/contactInfo";
import { SOPORTE_RESPUESTA } from "@/lib/compra";
import { Reveal } from "@/components/shared/Reveal";

export function SoporteSection() {
  const datos = [
    { Icono: Mail, titulo: "Correo", valor: CONTACTO.email, href: `mailto:${CONTACTO.email}` },
    { Icono: TelefonoIcono, titulo: "Teléfono y WhatsApp", valor: CONTACTO.telefono, href: CONTACTO.whatsapp },
    { Icono: Clock, titulo: "Horario", valor: CONTACTO.horario, href: undefined },
  ];

  return (
    <section id="soporte" className="w-full bg-surface-subtle px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#3563E9]">Soporte</div>
          <h2 className="mb-3 font-display text-3xl font-black tracking-tight text-text-main md:text-[40px]">
            ¿Dudas con tu contrato?
          </h2>
          <p className="text-lg text-text-muted">Respondemos en {SOPORTE_RESPUESTA}.</p>
        </div>

        <Reveal className="grid gap-4 md:grid-cols-3">
          {datos.map(({ Icono, titulo, valor, href }) => {
            const contenido = (
              <>
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3563E9]">
                  <Icono className="size-5" />
                </span>
                <span className="block text-sm font-semibold text-text-muted">{titulo}</span>
                <span className="mt-1 block text-lg font-bold text-text-main">{valor}</span>
              </>
            );
            const clases = "block rounded-2xl border border-border-layout bg-white p-6";
            return href ? (
              <a key={titulo} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`${clases} transition-all hover:-translate-y-0.5 hover:border-[#3563E9]/40 hover:shadow-lg hover:shadow-blue-900/5`}>
                {contenido}
              </a>
            ) : (
              <div key={titulo} className={clases}>{contenido}</div>
            );
          })}
        </Reveal>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={CONTACTO.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#3563E9] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#2951CB]"
          >
            <MessageCircle className="size-5" /> Escribir por WhatsApp
          </a>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 font-semibold text-text-main transition-colors hover:bg-slate-50"
          >
            Enviar un mensaje <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/SoporteSection.tsx
git commit -m "feat(onepage): sección Soporte con WhatsApp, correo y mensaje" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Ajustar las secciones existentes (anclas y textos)

**Files:**
- Modify: `src/components/home/HeroSection.tsx`, `StateCards.tsx`, `PricingSection.tsx`, `CtaSection.tsx`

Todas son reemplazos exactos de texto.

- [ ] **Step 1: `HeroSection.tsx`**

1. `<section className="relative w-full min-h-[90vh]` → `<section id="resumen" className="relative w-full min-h-[90vh]`
2. `<ShieldCheck className="w-4 h-4" /> Protección Legal Certificada` → `<ShieldCheck className="w-4 h-4" /> Contratos por estado`
3. `<span className="text-[#3563E9]">legalmente válidos</span>` → `<span className="text-[#3563E9]">por estado</span>`
4. `Genera tu contrato de renta personalizado, redactado por abogados y adaptado a la legislación de tu estado. Sin complicaciones.` → `Genera tu contrato de renta personalizado según el Código Civil de tu estado. Revísalo antes de pagar y descárgalo en PDF para firmar.`

- [ ] **Step 2: `StateCards.tsx`**

1. `<section id="cobertura"` → `<section id="estados"`
2. `Cada contrato cumple con la legislación local vigente. Selecciona tu estado y genera tu contrato en minutos.` → `Cada contrato se basa en el Código Civil de tu estado. Selecciona el tuyo y genera tu contrato en minutos.`

- [ ] **Step 3: `PricingSection.tsx`**

1. `<section id="precios"` → `<section id="precio"`
2. `<ShieldCheck className="w-3.5 h-3.5" /> Legalmente válido` → `<ShieldCheck className="w-3.5 h-3.5" /> Pago único`
3. Borrar el bloque completo:
```tsx
            <p className="text-sm font-semibold text-gray-400 mb-1">
              Un despacho tradicional: <span className="line-through">$2,500 – $5,000</span>
            </p>
```
4. Verificar la línea `"Guía de uso incluida",` de la lista `features`:
```bash
grep -rni "guía de uso\|guia de uso" src | grep -v PricingSection
```
Si no sale ningún resultado (la promesa no existe en otra parte del producto), borrar la línea `"Guía de uso incluida",` de `features`. Si sale algo que confirme que se entrega, dejarla.

- [ ] **Step 4: `CtaSection.tsx`**

`No arriesgues tu propiedad con contratos improvisados. Genera un contrato legal profesional en menos de 6 minutos.` → `Genera tu contrato de arrendamiento, revísalo antes de pagar y descárgalo en PDF para firmar.`

- [ ] **Step 5: Verificar tipos y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/home
git commit -m "refactor(onepage): anclas y textos sin promesas absolutas en secciones existentes" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Armar la página y quitar lo que sobra

**Files:**
- Rewrite: `src/app/page.tsx`
- Delete: `src/components/home/TrustBar.tsx`, `AboutRenters.tsx`, `FaqSection.tsx`, `src/app/como-funciona/page.tsx`, `src/components/como-funciona/` (4 archivos)
- Modify: `src/components/layout/Footer.tsx`, `src/app/sitemap.ts`, `next.config.ts`

- [ ] **Step 1: Reescribir `src/app/page.tsx`**

```tsx
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ComoFuncionaSection } from "@/components/home/ComoFuncionaSection";
import { StateCards } from "@/components/home/StateCards";
import { PricingSection } from "@/components/home/PricingSection";
import { DudasRapidasSection } from "@/components/home/DudasRapidasSection";
import { CtaSection } from "@/components/home/CtaSection";
import { SoporteSection } from "@/components/home/SoporteSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-clean flex flex-col font-sans">
      <div className="flex-1">
        <HeroSection />
        <ComoFuncionaSection />
        <StateCards />
        <PricingSection />
        <DudasRapidasSection />
        <CtaSection />
        <SoporteSection />
      </div>
      <Footer />
    </main>
  );
}
```
(El `Navbar` ya lo pinta `layout.tsx`; el import que tenía la página no se usaba.)

- [ ] **Step 2: Confirmar que nada más usa lo que se va a borrar**

```bash
grep -rn "TrustBar\|AboutRenters\|FaqSection\|components/como-funciona\|ProcessScrollytelling\|HeroProcessSection\|ProcessFeaturesSection\|FinalCtaProcessSection" src | grep -v "^src/components/home/TrustBar.tsx\|^src/components/home/AboutRenters.tsx\|^src/components/home/FaqSection.tsx\|^src/components/como-funciona/\|^src/app/como-funciona/"
```
Expected: sin salida. Si hay resultados, detenerse y resolver cada uno antes de borrar.

- [ ] **Step 3: Borrar**

```bash
git rm src/components/home/TrustBar.tsx src/components/home/AboutRenters.tsx src/components/home/FaqSection.tsx src/app/como-funciona/page.tsx
git rm -r src/components/como-funciona
```

- [ ] **Step 4: Footer — enlaces a las anclas nuevas**

En `src/components/layout/Footer.tsx`:
1. `<Link href="/como-funciona" className="hover:text-brand-primary transition-colors">Cómo Funciona</Link>` → `<Link href="/#como" className="hover:text-brand-primary transition-colors">Cómo Funciona</Link>`
2. `<Link href="/#precios" className="hover:text-brand-primary transition-colors">Precios</Link>` → `<Link href="/#precio" className="hover:text-brand-primary transition-colors">Precios</Link>`

- [ ] **Step 5: Sitemap**

En `src/app/sitemap.ts`, borrar la línea:
```ts
    { url: `${BASE}/como-funciona`, changeFrequency: 'monthly', priority: 0.8 },
```

- [ ] **Step 6: Redirección (temporal al inicio)**

En `next.config.ts`, dentro del arreglo de `redirects()`, después del objeto de `/preguntas-frecuentes`, agregar:
```ts
      {
        source: "/como-funciona",
        destination: "/#como",
        permanent: false, // pasar a true una semana después de verificar en producción
      },
```

- [ ] **Step 7: Agregar el test de anclas** (ahora que existen los 6 ids)

Reemplazar el encabezado de imports de `src/lib/contratosNav.test.mjs` por:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { CONTRATOS_MENU } from './contratosNav.ts';

const DIR = 'src/components/home';
const fuentes = readdirSync(DIR)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => readFileSync(`${DIR}/${f}`, 'utf8'))
  .join('\n');
```
y agregar al final del archivo:
```js
test('cada ancla del menú existe como id en una sección de la home', () => {
  for (const item of CONTRATOS_MENU) {
    assert.match(fuentes, new RegExp(`id="${item.id}"`), `falta id="${item.id}" en ${DIR}`);
  }
});
```
Para comprobar que el test sirve, quitar un instante `id="dudas"` de `DudasRapidasSection.tsx`, correr `npm test` (debe fallar con `falta id="dudas"`), y restaurarlo.

- [ ] **Step 8: Actualizar `PROJECT_MAP.md`**

`PROJECT_MAP.md` (líneas ~67-90) describe `/como-funciona` como scrollytelling y menciona `FaqSection.tsx`. Cambiar esas entradas para que digan: la home es un one-page (secciones en `src/components/home`: Hero, ComoFuncionaSection, StateCards, PricingSection, DudasRapidasSection, CtaSection, SoporteSection); `/como-funciona` redirige a `/#como`; el menú vive en `src/lib/contratosNav.ts` + `ContratosMenu.tsx`; datos de contacto en `src/lib/contactInfo.ts`. Dejar intactas las imágenes `public/images/como-funciona/`.

- [ ] **Step 9: Correr todo**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```
Expected: todos los tests pasan, incluido el de anclas; tipos, lint y build sin errores; en la salida del build ya no aparece la ruta `/como-funciona`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(onepage): una sola página con secciones y menú en burbuja; /como-funciona redirige a /#como" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Verificación visual y de cada botón (navegador real)

**Files:** ninguno. No se da por terminado sin hacer esto.

- [ ] **Step 1: Levantar el servidor local**

```bash
npm run dev
```
Abrir `http://localhost:3000` en el navegador integrado (o Chrome).

- [ ] **Step 2: Recorrer cada botón y anotar resultado**

| # | Dónde | Acción | Resultado esperado |
|---|---|---|---|
| 1 | Barra | Logo | Vuelve arriba de `/` |
| 2 | Barra | Inicio, Servicios, Cómo funciona, Paquetes, Preguntas frecuentes | Abren la página correspondiente en www.renters.mx |
| 3 | Barra | Contratos (pasar el mouse) | Se abre la burbuja con punta centrada; no se cierra al mover el mouse hacia ella |
| 4 | Burbuja | Cada una de las 6 filas | Baja suave a su sección; la sección no queda tapada por la barra; la burbuja se cierra |
| 5 | Burbuja | Esc y clic afuera | Se cierra; con Esc el foco vuelve al botón |
| 6 | Barra | Contratos con teclado (Tab, Enter) | Abre la burbuja; las filas se alcanzan con Tab |
| 7 | Barra | Contacto, Soy Broker | www.renters.mx/contacto y /brokers |
| 8 | Barra | Generar contrato | `/contrato` |
| 9 | Héroe | Selector de estado → elegir uno → Generar Contrato | `/contrato?estado=<id>` con el estado elegido |
| 10 | Cómo funciona | Cada paso (4) | Cambia la captura del teléfono (escritorio); el paso activo se resalta |
| 11 | Cómo funciona | Generar contrato | `/contrato` |
| 12 | Estados | Cada tarjeta (6) | `/contrato?estado=<id>` |
| 13 | Precio | Generar mi contrato | `/contrato` |
| 14 | Dudas | Cada pregunta (5) | Se abre una a la vez; la 5 muestra "Reenviar mi enlace" → `/reenviar-enlace` |
| 15 | Dudas | Ver todas las preguntas | www.renters.mx/preguntas-frecuentes?tema=contratos |
| 16 | Cierre | Generar mi Contrato | `/contrato` |
| 17 | Soporte | Correo | Abre cliente de correo con `hola@renters.mx` |
| 18 | Soporte | Teléfono/WhatsApp y botón WhatsApp | `https://wa.me/528110610111` en pestaña nueva |
| 19 | Soporte | Enviar un mensaje | `/contacto` |
| 20 | Pie | Cómo Funciona, Precios | Bajan a `#como` y `#precio` |
| 21 | URL | `http://localhost:3000/como-funciona` | Redirige a `/#como` |
| 22 | Generador | `/contrato` | Barra simplificada (Volver / logo / ¿Dudas?) intacta |

- [ ] **Step 3: Revisión visual (escritorio 1440 px y móvil 375 px)**

Comprobar: ritmo de fondos alternando blanco / gris claro (`bg-surface-subtle`); mismas etiquetas azules en mayúsculas sobre cada título; botones píldora azules `#3563E9`; tipografía Inter; sin desbordes horizontales; el acordeón móvil de "Contratos" abre y cierra; el botón azul "Generar contrato" visible en móvil dentro del menú. Con "reducir movimiento" activado en el sistema, el scroll no es animado.

- [ ] **Step 4: Confirmar que no se rompió la medición**

Abrir `/contrato` y avanzar un paso: en la pestaña de red debe salir la llamada a `/api/track-step`. En consola no debe haber errores de CSP ni de React.

- [ ] **Step 5: Apagar el servidor y reportar**

Detener `npm run dev`. Anotar en el reporte qué filas de la tabla pasaron, cuáles fallaron y cuáles no se pudieron verificar.

---

### Task 11: Subir la rama y revisar en preview (sin mezclar)

**Files:** ninguno

- [ ] **Step 1: Subir y abrir PR**

```bash
git push -u origin feat/one-pager-contratos
gh pr create --title "One-pager de contratos con menú en burbuja" --body "$(cat <<'EOF'
## Qué cambia
- Una sola barra; el submenú vive en una burbuja bajo "Contratos".
- La home pasa a ser una página con secciones: Resumen, Cómo funciona, Estados, Precio, Dudas rápidas, Cierre, Soporte.
- /como-funciona redirige a /#como (307 por ahora).
- Textos sin promesas absolutas; los datos prometidos salen de src/lib/compra.ts.

## Fuera de alcance
- Unificar contacto con www, legales duplicados, metadata de layout.tsx.

## Verificación
Tabla de 22 botones recorrida en navegador (ver reporte).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Revisar el deploy de preview de Vercel** con la misma tabla del Task 10 (en la URL de preview, no en producción).

- [ ] **Step 3: Esperar el "mezcla" de Abraham.** No mezclar sin esa palabra. Tras mezclar y verificar producción, cambiar `permanent: false` a `true` en la redirección de `/como-funciona` en un PR aparte.

---

## Auto-revisión

**Cobertura del pedido:** menú burbuja bajo Contratos (Task 3); secciones Resumen/Cómo funciona/Estados/Precio/Dudas/Cierre/Soporte (Tasks 5–9); todos los botones funcionan (test de anclas en Task 1 + tabla de 22 en Task 10); visualmente atractivo y alineado a renters.mx (capturas en teléfono, tokens, píldoras, ritmo de fondos; revisión visual en Task 10 Step 3); sin duplicados (se quitan FAQ y Cómo funciona aparte; Task 9).

**Placeholders:** ninguno; los dos pasos condicionales (Task 4 Step 3 y Task 8 Step 3.4) traen la prueba exacta y las dos salidas posibles.

**Consistencia de nombres:** `CONTRATOS_MENU` / `ContratosMenuId` (Task 1) usados igual en Task 3; `CONTACTO` (Task 2) en Task 7; ids `resumen, como, estados, precio, dudas, soporte` coinciden entre menú, secciones, footer y redirección; `SOPORTE_RESPUESTA`, `CORRECCION_GRATIS_HORAS`, `ENLACE_VIGENCIA_DIAS` existen en `src/lib/compra.ts`.

**Resultado de la verificación en navegador (Task 10)**
- El scroll suave global (`scroll-behavior: smooth` + `data-scroll-behavior`) rompía la carga directa de `/#id` (la página se quedaba arriba; producción sí bajaba). Se quitó; quedó solo `scroll-padding-top: 6rem`. Los saltos a las secciones son instantáneos, como hoy.
- Si se quiere scroll suave en el futuro, aplicarlo solo a clics dentro de la página, no globalmente.

**Revisión extra (segunda pasada)**
- Corregido: el test de anclas se movió del Task 1 al Task 9, porque dejaba la suite en rojo en los commits intermedios.
- Agregado: Step de `PROJECT_MAP.md` (el repo exige mantenerlo al día y todavía describía `/como-funciona` y `FaqSection`).
- Verificado: los enlaces desde www.renters.mx a contratos (`contratosUrl`) apuntan a la raíz con parámetros UTM y sin `#cobertura` ni `#precios`, así que cambiar esos ids no rompe nada de allá. Los anuncios de Google Ads también apuntan a la raíz.
- Cambio de diseño a notar: "Soy Broker" pasa de botón azul a botón de contorno, y el azul queda para "Generar contrato".

**Riesgos conocidos y no verificados**
- No leí por dentro `Phone` (`src/components/shared/Phone.tsx`); la sección Cómo funciona asume que su contenedor tiene alto definido, como en el héroe. Se comprueba en Task 10.
- No ejecuté nada de este plan: son instrucciones, no resultados.
- Correo y horario de Soporte son provisionales hasta que Abraham los confirme.
