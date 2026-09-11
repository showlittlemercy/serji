"use client";

import { motion } from "framer-motion";

type AtsScoreRingProps = {
  score: number;
};

/**
 * Animated circular ATS score indicator.
 */
export function AtsScoreRing({ score }: AtsScoreRingProps) {
  const size = 160;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 80
      ? "text-emerald-700 dark:text-emerald-400"
      : clamped >= 60
        ? "text-primary"
        : "text-muted-fg";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-display text-4xl font-bold tabular-nums ${tone}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          {clamped}
        </motion.span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-fg">
          ATS Score
        </span>
      </div>
    </div>
  );
}
