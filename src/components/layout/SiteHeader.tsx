"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./SiteHeader.module.css";

const WWW = "https://www.renters.mx";

// Mismos enlaces y orden que www.renters.mx. "Contratos" es este sitio: enlace simple al one-pager.
const LINKS = [
  { name: "Inicio", href: `${WWW}/` },
  { name: "Servicios", href: `${WWW}/servicios` },
  { name: "Cómo funciona", href: `${WWW}/como-funciona` },
  { name: "Paquetes", href: `${WWW}/paquetes` },
  { name: "Contratos", href: "/" },
  { name: "Preguntas frecuentes", href: `${WWW}/preguntas-frecuentes` },
];

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const scrolledNow = () => window.scrollY > 20;

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, scrolledNow, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback((devolverFoco = false) => {
    setMenuOpen(false);
    if (devolverFoco) burgerRef.current?.focus();
  }, []);

  // Menú abierto: la página de atrás no se desplaza, Esc lo cierra y el foco entra al menú.
  // Si la ventana crece hasta el modo de escritorio, se cierra solo.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const mq = window.matchMedia("(min-width: 1200px)");
    const onResize = () => mq.matches && closeMenu();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [menuOpen, closeMenu]);

  // En la portada el héroe pasa por debajo de la barra (como en www); en las demás páginas se reserva su alto.
  const reservaEspacio = pathname !== "/";

  return (
    <>
      <a className={styles.skip} href="#main-content">
        Saltar al contenido
      </a>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`${styles.fondo} backdrop-blur-[8px]`} aria-hidden="true" />
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="Renters, contratos" onClick={() => closeMenu()}>
            <Image src="/logo-renters-www.png" alt="Renters" width={90} height={90} className={styles.logoImg} priority />
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav id="main-nav" aria-label="Principal" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
            <ul>
              {LINKS.map((l, i) =>
                l.name === "Contratos" ? (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className={`${styles.link} ${styles.active}`}
                      aria-current="page"
                      onClick={() => closeMenu()}
                    >
                      {l.name}
                    </Link>
                  </li>
                ) : (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      className={styles.link}
                      ref={i === 0 ? firstLinkRef : undefined}
                      onClick={() => closeMenu()}
                    >
                      {l.name}
                    </a>
                  </li>
                ),
              )}
              <li className={styles.mobileOnly}>
                <a href={`${WWW}/contacto`} className={styles.link}>
                  Contacto
                </a>
              </li>
              <li className={styles.mobileOnly}>
                <a href={`${WWW}/brokers`} className={styles.link}>
                  Soy Broker
                </a>
              </li>
            </ul>
          </nav>

          <div className={styles.actions}>
            <a href={`${WWW}/contacto`} className={`${styles.btn} ${styles.btnOutline}`}>
              Contacto
            </a>
            <a href={`${WWW}/brokers`} className={`${styles.btn} ${styles.btnPrimary}`}>
              Soy Broker
            </a>
          </div>
        </div>
      </header>
      {reservaEspacio && <div className={styles.spacer} aria-hidden="true" />}
      <div id="main-content" tabIndex={-1} />
    </>
  );
}
