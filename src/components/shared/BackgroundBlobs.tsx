"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

const BRAND = "#4D6BFE";

// Blobs decorativos con parallax ligado al scroll (para secciones sticky/scrollytelling).
export function BackgroundBlobs({ progress }: { progress: MotionValue<number> }) {
  const y1 = useTransform(progress, [0, 1], [-40, 40]);
  const y2 = useTransform(progress, [0, 1], [30, -50]);
  const y3 = useTransform(progress, [0, 1], [-20, 60]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1, backgroundColor: BRAND }}
        className="absolute -right-10 top-[8%] h-64 w-64 rounded-full opacity-[0.08] blur-3xl"
      />
      <motion.div
        style={{ y: y2, backgroundColor: BRAND }}
        className="absolute right-[22%] top-[55%] h-48 w-48 rounded-full opacity-[0.10] blur-3xl"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute -right-16 bottom-[6%] h-72 w-72 rounded-full bg-emerald-400 opacity-[0.06] blur-3xl"
      />
    </div>
  );
}

// Blobs decorativos con deriva ambiental en loop (para hero, sin scroll de por medio).
// Respeta prefers-reduced-motion: sin animate, quedan estáticos.
export function AmbientBlobs({ reducedMotion }: { reducedMotion: boolean }) {
  const loop = (delta: [number, number], duration: number) =>
    reducedMotion ? undefined : { y: delta, transition: { duration, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={loop([-20, 20], 9)}
        style={{ backgroundColor: BRAND }}
        className="absolute -right-10 top-[10%] h-72 w-72 rounded-full opacity-[0.16] blur-3xl"
      />
      <motion.div
        animate={loop([25, -25], 11)}
        style={{ backgroundColor: BRAND }}
        className="absolute right-[18%] bottom-[8%] h-56 w-56 rounded-full opacity-[0.14] blur-3xl"
      />
      <motion.div
        animate={loop([-15, 15], 13)}
        className="absolute -right-20 bottom-[35%] h-64 w-64 rounded-full bg-emerald-400 opacity-[0.08] blur-3xl"
      />
    </div>
  );
}
