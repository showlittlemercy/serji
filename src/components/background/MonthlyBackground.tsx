"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";
import { useAnimation } from "@/context/AnimationContext";

/**
 * Premium monthly background scenes.
 * High-contrast on both light (#EEEAD7) and dark (#2D0000) themes —
 * never uses colors that blend into the page background.
 */

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

/** Deterministic-ish particles (stable for a session, no SSR flash issues) */
function useParticles(count: number, seed = 1): Particle[] {
  return useMemo(() => {
    const out: Particle[] = [];
    let s = seed * 9973;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      out.push({
        id: i,
        x: rand() * 100,
        y: rand() * 100,
        size: 8 + rand() * 18,
        duration: 7 + rand() * 12,
        delay: rand() * 5,
        drift: 18 + rand() * 36,
      });
    }
    return out;
  }, [count, seed]);
}

function Stage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

/** Soft vignette so particles read clearly against the canvas */
function Vignette() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,color-mix(in_srgb,var(--foreground)_8%,transparent)_100%)]" />
  );
}

/* ==========================================================================
   JANUARY — Crystal frost & snow
   ========================================================================== */
function January() {
  const flakes = useParticles(42, 1);
  const crystals = useParticles(14, 11);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,8,8,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(238,234,215,0.12),transparent_55%)]" />
      <Vignette />

      {flakes.map((p) => (
        <motion.span
          key={`f-${p.id}`}
          className="absolute rounded-full bg-[#6D0808] shadow-[0_0_8px_rgba(109,8,8,0.45)] dark:bg-[#EEEAD7] dark:shadow-[0_0_10px_rgba(238,234,215,0.55)]"
          style={{
            left: `${p.x}%`,
            top: "-6%",
            width: Math.max(3, p.size * 0.45),
            height: Math.max(3, p.size * 0.45),
          }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, p.id % 2 === 0 ? p.drift : -p.drift],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: p.duration * 0.85,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {crystals.map((p) => (
        <motion.span
          key={`c-${p.id}`}
          className="absolute bg-[#2D0000] dark:bg-[#C44A4A]"
          style={{
            left: `${p.x}%`,
            top: "-8%",
            width: p.size * 0.9,
            height: p.size * 0.9,
            clipPath:
              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
            filter: "drop-shadow(0 0 6px rgba(109,8,8,0.5))",
          }}
          animate={{
            y: ["0vh", "115vh"],
            rotate: [0, 180, 360],
            opacity: [0, 0.75, 0.75, 0],
          }}
          transition={{
            duration: p.duration + 4,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </Stage>
  );
}

/* ==========================================================================
   FEBRUARY — Romantic glowing hearts / orbs
   ========================================================================== */
function February() {
  const orbs = useParticles(12, 2);
  const hearts = useParticles(10, 22);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(109,8,8,0.22),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(196,74,74,0.18),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(196,74,74,0.35),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(238,234,215,0.12),transparent_45%)]" />
      <Vignette />

      {orbs.map((p) => (
        <motion.span
          key={`o-${p.id}`}
          className="absolute rounded-full bg-[#6D0808]/55 blur-2xl dark:bg-[#C44A4A]/50"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 7,
            height: p.size * 7,
          }}
          animate={{
            scale: [1, 1.45, 1],
            opacity: [0.35, 0.7, 0.35],
            x: [0, p.drift * 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {hearts.map((p) => (
        <motion.span
          key={`h-${p.id}`}
          className="absolute bg-gradient-to-br from-[#6D0808] to-[#C44A4A] shadow-[0_2px_12px_rgba(109,8,8,0.5)] dark:from-[#F0C4C4] dark:to-[#C44A4A] dark:shadow-[0_2px_14px_rgba(240,196,196,0.55)]"
          style={{
            left: `${p.x}%`,
            top: `${20 + (p.y % 60)}%`,
            width: 12 + p.size * 0.6,
            height: 12 + p.size * 0.6,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
          }}
          animate={{
            y: [0, -28, 0],
            scale: [1, 1.18, 1],
            opacity: [0.5, 0.95, 0.5],
          }}
          transition={{
            duration: 4 + (p.id % 4),
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ==========================================================================
   MARCH — Fresh spring leaves
   ========================================================================== */
function March() {
  const leaves = useParticles(28, 3);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(117,125,111,0.28),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(109,8,8,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(154,161,147,0.22),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(196,74,74,0.15),transparent_50%)]" />
      <Vignette />

      {leaves.map((p) => {
        const tone = p.id % 3;
        const colorClass =
          tone === 0
            ? "bg-[#4A5D3A] dark:bg-[#B8C4A8]"
            : tone === 1
              ? "bg-[#757D6F] dark:bg-[#9AA193]"
              : "bg-[#2F3D28] dark:bg-[#D4DCC8]";
        return (
          <motion.span
            key={p.id}
            className={`absolute shadow-[0_2px_8px_rgba(45,0,0,0.25)] ${colorClass}`}
            style={{
              left: `${p.x}%`,
              top: "-10%",
              width: p.size * 1.1,
              height: p.size * 1.55,
              borderRadius: "2% 90% 2% 90%",
            }}
            animate={{
              y: ["0vh", "118vh"],
              rotate: [0, 140, 300],
              x: [0, p.id % 2 === 0 ? p.drift : -p.drift, 0],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: p.duration + 3,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </Stage>
  );
}

/* ==========================================================================
   APRIL — Rain streaks + ripples
   ========================================================================== */
function April() {
  const drops = useParticles(55, 4);
  const ripples = useParticles(8, 44);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(117,125,111,0.18),transparent_40%,rgba(109,8,8,0.08))] dark:bg-[linear-gradient(180deg,rgba(238,234,215,0.08),transparent_40%,rgba(196,74,74,0.12))]" />
      <Vignette />

      {drops.map((p) => (
        <motion.span
          key={`d-${p.id}`}
          className="absolute rounded-full bg-[#2D0000] dark:bg-[#EEEAD7]"
          style={{
            left: `${p.x}%`,
            top: "-8%",
            width: 2.5,
            height: 14 + p.size * 0.9,
            boxShadow: "0 0 6px rgba(45,0,0,0.35)",
          }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 1.4 + (p.id % 6) * 0.25,
            delay: p.delay * 0.35,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {ripples.map((p) => (
        <motion.span
          key={`r-${p.id}`}
          className="absolute rounded-full border-2 border-[#6D0808]/70 dark:border-[#EEEAD7]/50"
          style={{
            left: `${p.x}%`,
            bottom: `${8 + (p.y % 25)}%`,
            width: 10,
            height: 4,
          }}
          animate={{
            scaleX: [1, 3.5],
            scaleY: [1, 2],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 2.2,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ==========================================================================
   MAY — Blossom petals
   ========================================================================== */
function May() {
  const petals = useParticles(26, 5);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(109,8,8,0.2),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(168,106,42,0.15),transparent_40%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(240,196,196,0.2),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(212,165,116,0.15),transparent_40%)]" />
      <Vignette />

      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 1.2,
            height: p.size * 0.85,
            borderRadius: "60% 0 60% 0",
            background:
              p.id % 2 === 0
                ? "linear-gradient(135deg,#6D0808,#C44A4A)"
                : "linear-gradient(135deg,#A86A2A,#6D0808)",
            boxShadow: "0 4px 12px rgba(109,8,8,0.35)",
          }}
          animate={{
            y: [0, -40, 12, 0],
            x: [0, p.drift * 0.5, -p.drift * 0.3, 0],
            rotate: [0, 35, -20, 0],
            opacity: [0.55, 0.95, 0.7, 0.55],
          }}
          transition={{
            duration: p.duration * 0.7,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ==========================================================================
   JUNE — Golden sun rays
   ========================================================================== */
function June() {
  const sparks = useParticles(18, 6);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(168,106,42,0.35),transparent_40%),radial-gradient(circle_at_15%_90%,rgba(109,8,8,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_85%_10%,rgba(212,165,116,0.4),transparent_40%),radial-gradient(circle_at_15%_90%,rgba(196,74,74,0.2),transparent_45%)]" />
      <Vignette />

      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute left-[78%] top-[-5%] h-[90%] w-[14%] origin-top -translate-x-1/2 bg-gradient-to-b from-[#A86A2A]/55 via-[#6D0808]/20 to-transparent dark:from-[#D4A574]/45 dark:via-[#C44A4A]/15"
          style={{ rotate: `${-40 + i * 20}deg` }}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      <motion.div
        className="absolute right-[4%] top-[4%] h-40 w-40 rounded-full bg-[#A86A2A]/50 blur-2xl dark:bg-[#D4A574]/45 sm:h-56 sm:w-56"
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {sparks.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#6D0808] dark:bg-[#EEEAD7]"
          style={{
            left: `${60 + (p.x % 35)}%`,
            top: `${p.y % 40}%`,
            width: 3 + (p.id % 4),
            height: 3 + (p.id % 4),
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 2 + (p.id % 3),
            delay: p.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </Stage>
  );
}

/* ==========================================================================
   JULY — Heat haze & warm flares
   ========================================================================== */
function July() {
  const waves = useParticles(10, 7);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,8,8,0.18),transparent_60%),radial-gradient(ellipse_at_top,rgba(168,106,42,0.2),transparent_45%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(196,74,74,0.28),transparent_60%),radial-gradient(ellipse_at_top,rgba(212,165,116,0.22),transparent_45%)]" />
      <Vignette />

      {waves.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[50%] bg-gradient-to-r from-[#6D0808]/50 via-[#A86A2A]/40 to-transparent blur-xl dark:from-[#C44A4A]/55 dark:via-[#D4A574]/35"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 8,
            height: p.size * 3.5,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.drift * 0.4, 0],
            opacity: [0.35, 0.75, 0.35],
            scaleX: [1, 1.35, 1],
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

/* ==========================================================================
   AUGUST — Layered drifting clouds
   ========================================================================== */
function August() {
  const clouds = useParticles(9, 8);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(117,125,111,0.15),transparent_50%)] dark:bg-[linear-gradient(180deg,rgba(238,234,215,0.1),transparent_50%)]" />
      <Vignette />

      {clouds.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            top: `${8 + (p.y % 55)}%`,
            left: "-25%",
            width: 140 + p.size * 12,
            height: 48 + p.size * 3,
          }}
          animate={{ x: ["0vw", "140vw"] }}
          transition={{
            duration: 22 + p.duration,
            delay: p.delay * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span className="absolute inset-0 rounded-full bg-[#757D6F]/45 blur-md dark:bg-[#EEEAD7]/30" />
          <span className="absolute left-[20%] top-[-30%] h-[80%] w-[55%] rounded-full bg-[#757D6F]/40 blur-md dark:bg-[#EEEAD7]/25" />
          <span className="absolute right-[10%] top-[-20%] h-[70%] w-[45%] rounded-full bg-[#6D0808]/25 blur-md dark:bg-[#C44A4A]/25" />
        </motion.div>
      ))}
    </Stage>
  );
}

/* ==========================================================================
   SEPTEMBER — Autumn leaf fall
   ========================================================================== */
function September() {
  const leaves = useParticles(32, 9);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,106,42,0.28),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(109,8,8,0.18),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(212,165,116,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(196,74,74,0.22),transparent_50%)]" />
      <Vignette />

      {leaves.map((p) => {
        const tone = p.id % 4;
        const colorClass =
          tone === 0
            ? "bg-[#6D0808] dark:bg-[#F0C4C4]"
            : tone === 1
              ? "bg-[#A86A2A] dark:bg-[#D4A574]"
              : tone === 2
                ? "bg-[#757D6F] dark:bg-[#C5CDB8]"
                : "bg-[#8B4513] dark:bg-[#E8B86D]";
        return (
          <motion.span
            key={p.id}
            className={`absolute shadow-[0_3px_10px_rgba(45,0,0,0.3)] ${colorClass}`}
            style={{
              left: `${p.x}%`,
              top: "-8%",
              width: p.size * 1.15,
              height: p.size * 1.4,
              borderRadius: "50% 0",
            }}
            animate={{
              y: ["0vh", "118vh"],
              rotate: [0, 160, 320],
              x: [0, p.drift, -p.drift * 0.6, p.drift * 0.3],
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              duration: p.duration + 2,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </Stage>
  );
}

/* ==========================================================================
   OCTOBER — Lantern glow & mist
   ========================================================================== */
function October() {
  const mist = useParticles(14, 10);
  const lanterns = useParticles(7, 101);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(109,8,8,0.3),transparent_55%),radial-gradient(circle_at_10%_20%,rgba(45,0,0,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_50%_100%,rgba(196,74,74,0.4),transparent_55%),radial-gradient(circle_at_10%_20%,rgba(238,234,215,0.08),transparent_40%)]" />
      <Vignette />

      {mist.map((p) => (
        <motion.span
          key={`m-${p.id}`}
          className="absolute rounded-full bg-[#2D0000]/35 blur-3xl dark:bg-[#6D0808]/45"
          style={{
            left: `${p.x}%`,
            bottom: `${(p.y % 45)}%`,
            width: p.size * 10,
            height: p.size * 5,
          }}
          animate={{
            x: [0, 50, -30, 0],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: p.duration + 5,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {lanterns.map((p) => (
        <motion.span
          key={`l-${p.id}`}
          className="absolute rounded-full bg-[#A86A2A] shadow-[0_0_24px_rgba(168,106,42,0.7)] dark:bg-[#D4A574] dark:shadow-[0_0_28px_rgba(212,165,116,0.75)]"
          style={{
            left: `${10 + (p.x % 80)}%`,
            top: `${15 + (p.y % 60)}%`,
            width: 8 + p.size * 0.4,
            height: 8 + p.size * 0.4,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.35, 1],
            y: [0, -12, 0],
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

/* ==========================================================================
   NOVEMBER — Rising embers
   ========================================================================== */
function November() {
  const sparks = useParticles(40, 11);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(109,8,8,0.35),transparent_55%),radial-gradient(ellipse_at_top,rgba(168,106,42,0.12),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(196,74,74,0.4),transparent_55%),radial-gradient(ellipse_at_top,rgba(212,165,116,0.12),transparent_40%)]" />
      <Vignette />

      {sparks.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#6D0808] shadow-[0_0_10px_rgba(109,8,8,0.8)] dark:bg-[#FFB4A2] dark:shadow-[0_0_14px_rgba(255,180,162,0.85)]"
          style={{
            left: `${p.x}%`,
            bottom: "-4%",
            width: Math.max(3, p.size * 0.4),
            height: Math.max(3, p.size * 0.4),
          }}
          animate={{
            y: [0, -(220 + p.size * 18)],
            x: [0, p.id % 2 === 0 ? p.drift * 0.5 : -p.drift * 0.5],
            opacity: [0, 1, 0.8, 0],
            scale: [1, 1.2, 0.6],
          }}
          transition={{
            duration: 3.5 + (p.id % 7) * 0.5,
            delay: p.delay * 0.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </Stage>
  );
}

/* ==========================================================================
   DECEMBER — Festive starfield
   ========================================================================== */
function December() {
  const stars = useParticles(36, 12);
  const flakes = useParticles(20, 120);

  return (
    <Stage>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(109,8,8,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(117,125,111,0.15),transparent_40%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(196,74,74,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(238,234,215,0.1),transparent_40%)]" />
      <Vignette />

      {stars.map((p) => (
        <motion.span
          key={`s-${p.id}`}
          className="absolute bg-[#6D0808] dark:bg-[#EEEAD7]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 6 + p.size * 0.35,
            height: 6 + p.size * 0.35,
            clipPath:
              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
            filter: "drop-shadow(0 0 8px rgba(109,8,8,0.65))",
          }}
          animate={{
            scale: [0.7, 1.35, 0.7],
            opacity: [0.35, 1, 0.35],
            rotate: [0, 40, 0],
          }}
          transition={{
            duration: 2.5 + (p.id % 4),
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {flakes.map((p) => (
        <motion.span
          key={`f-${p.id}`}
          className="absolute rounded-full border-2 border-[#2D0000]/80 bg-[#EEEAD7]/80 dark:border-[#EEEAD7]/70 dark:bg-[#C44A4A]/40"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size * 0.7,
            height: p.size * 0.7,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 180],
            opacity: [0, 0.9, 0.9, 0],
          }}
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
 * Lives above the grain overlay and below page content for clear visibility.
 */
export function MonthlyBackground() {
  const { activeMonth } = useAnimation();
  const Scene = MONTH_SCENES[activeMonth] ?? January;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeMonth}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="pointer-events-none fixed inset-0 z-[2]"
        aria-hidden
      >
        <Scene />
      </motion.div>
    </AnimatePresence>
  );
}
