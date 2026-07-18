"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Cuenta de 0 al valor final al montar. Con reduced-motion, muestra el valor final directo.
export function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? target : 0);
  const started = useRef(false);

  useEffect(() => {
    if (reducedMotion || started.current) return;
    started.current = true;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reducedMotion]);

  return <>{value}</>;
}
