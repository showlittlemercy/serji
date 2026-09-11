"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * MonthlyBackground
 * ------------------
 * Detects the current calendar month and renders a subtle, aesthetic
 * particle/shape animation behind the landing page. Pure Framer Motion + CSS —
 * no heavy 3D libraries.
 */

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

function useParticles(count: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 14,
        duration: 8 + Math.random() * 14,
        delay: Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count]
  );
}

/** Shared fixed full-bleed wrapper — pointer-events none so UI stays clickable */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {children}
    </div>
  );
}

/* ---------- January: Frost / Snow ---------- */
function January() {
  const flakes = useParticles(36);
  return (
    <Stage>
      {flakes.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-light/70 dark:bg-light/40"
          style={{
            left: `${p.x}%`,
            top: `-8%`,
            width: p.size * 0.55,
            height: p.size * 0.55,
            opacity: p.opacity,
          }}
          animate={{ y: ["0vh", "110vh"], x: [0, (p.id % 2 === 0 ? 20 : -20)] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- February: Soft glowing orbs (valentine / warmth) ---------- */
function February() {
  const orbs = useParticles(10);
  return (
    <Stage>
      {orbs.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-primary/30 blur-2xl dark:bg-primary/50"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 6,
            height: p.size * 6,
          }}
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- March: Drifting leaves / greenery ---------- */
function March() {
  const leaves = useParticles(18);
  return (
    <Stage>
      {leaves.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `-10%`,
            width: p.size,
            height: p.size * 1.4,
            borderRadius: "40% 0 40% 0",
            background:
              p.id % 2 === 0
                ? "color-mix(in srgb, #757d6f 55%, #6d0808)"
                : "color-mix(in srgb, #757d6f 70%, #2d0000)",
            opacity: p.opacity,
          }}
          animate={{
            y: ["0vh", "115vh"],
            rotate: [0, 180, 360],
            x: [0, p.id % 2 === 0 ? 40 : -40, 0],
          }}
          transition={{
            duration: p.duration + 4,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- April: Gentle raindrops ---------- */
function April() {
  const drops = useParticles(42);
  return (
    <Stage>
      {drops.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-muted/50 dark:bg-light/25"
          style={{
            left: `${p.x}%`,
            top: `-5%`,
            width: 2,
            height: p.size * 1.2,
            opacity: p.opacity,
          }}
          animate={{ y: ["0vh", "110vh"] }}
          transition={{
            duration: 1.8 + (p.id % 5) * 0.4,
            delay: p.delay * 0.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- May: Soft floating blossoms ---------- */
function May() {
  const petals = useParticles(16);
  return (
    <Stage>
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[60%_40%_60%_40%] bg-primary/25 dark:bg-light/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 0.85,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 18, 0],
            rotate: [0, 25, -15, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- June: Warm sun rays / light flares ---------- */
function June() {
  return (
    <Stage>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[-20%] h-[140%] w-[28%] origin-top -translate-x-1/2 bg-gradient-to-b from-primary/15 via-transparent to-transparent dark:from-primary/25"
          style={{ rotate: `${-28 + i * 28}deg` }}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{
            duration: 7 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
      <motion.div
        className="absolute -right-10 top-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl dark:bg-primary/35"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </Stage>
  );
}

/* ---------- July: Soft heat shimmer orbs ---------- */
function July() {
  const orbs = useParticles(8);
  return (
    <Stage>
      {orbs.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-primary/20 blur-xl dark:bg-accent/25"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 5,
            height: p.size * 3,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.15, 0.4, 0.15],
            scaleX: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- August: Slow drifting clouds ---------- */
function August() {
  const clouds = useParticles(6);
  return (
    <Stage>
      {clouds.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-muted/20 blur-2xl dark:bg-light/10"
          style={{
            top: `${10 + (p.y % 50)}%`,
            width: 120 + p.size * 10,
            height: 40 + p.size * 3,
            left: `-20%`,
          }}
          animate={{ x: ["0vw", "130vw"] }}
          transition={{
            duration: 28 + p.duration,
            delay: p.delay * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- September: Falling amber leaves ---------- */
function September() {
  const leaves = useParticles(20);
  return (
    <Stage>
      {leaves.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `-8%`,
            width: p.size,
            height: p.size * 1.2,
            borderRadius: "50% 0",
            background:
              p.id % 3 === 0
                ? "#6d0808"
                : p.id % 3 === 1
                  ? "#757d6f"
                  : "#a86a2a",
            opacity: p.opacity * 0.9,
          }}
          animate={{
            y: ["0vh", "115vh"],
            rotate: [0, 120, 280],
            x: [0, 30, -20, 10],
          }}
          transition={{
            duration: p.duration + 3,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- October: Soft spooky mist orbs ---------- */
function October() {
  const mist = useParticles(12);
  return (
    <Stage>
      {mist.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-deep/30 blur-3xl dark:bg-primary/30"
          style={{
            left: `${p.x}%`,
            bottom: `${(p.y % 40)}%`,
            width: p.size * 8,
            height: p.size * 4,
          }}
          animate={{
            x: [0, 40, -20, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: p.duration + 4,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- November: Soft ember sparks ---------- */
function November() {
  const sparks = useParticles(24);
  return (
    <Stage>
      {sparks.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-primary/60 dark:bg-accent/70"
          style={{
            left: `${p.x}%`,
            bottom: `-5%`,
            width: Math.max(2, p.size * 0.35),
            height: Math.max(2, p.size * 0.35),
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -Math.min(500, 200 + p.size * 20)],
            opacity: [0, p.opacity, 0],
            x: [0, (p.id % 2 === 0 ? 15 : -15)],
          }}
          transition={{
            duration: 4 + (p.id % 6),
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ---------- December: Soft holiday sparkles ---------- */
function December() {
  const sparkles = useParticles(28);
  return (
    <Stage>
      {sparkles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bg-light dark:bg-accent"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 0.4,
            height: p.size * 0.4,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            opacity: p.opacity,
          }}
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.1, 0.55, 0.1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 3 + (p.id % 4),
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

const MONTH_SCENES = [
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
] as const;

/**
 * Globally reusable monthly background.
 * Uses `new Date().getMonth()` (0–11) to pick the scene.
 */
export function MonthlyBackground() {
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    // Client-only to keep SSR deterministic
    setMonth(new Date().getMonth());
  }, []);

  if (month === null) return null;

  const Scene = MONTH_SCENES[month] ?? January;
  return <Scene />;
}
