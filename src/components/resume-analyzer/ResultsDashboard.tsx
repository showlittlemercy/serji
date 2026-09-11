"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { AnalyzeResult } from "@/lib/analyze-types";
import { AtsScoreRing } from "@/components/resume-analyzer/AtsScoreRing";

type ResultsDashboardProps = {
  result: AnalyzeResult;
  onReset: () => void;
};

/**
 * Animated results view after a successful resume analysis.
 */
export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto w-full max-w-4xl space-y-8"
    >
      {/* Score header */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-elevated/80 px-6 py-10 text-center backdrop-blur-sm dark:bg-surface/80 sm:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Analysis complete
        </div>
        <AtsScoreRing score={result.ats_score} />
        <p className="max-w-md text-sm text-muted-fg">
          Score reflects ATS keyword readiness, structure clarity, and recruiter
          impact based on your uploaded resume
          {result.ats_score >= 80
            ? " — looking strong."
            : result.ats_score >= 60
              ? " — solid baseline with room to sharpen."
              : " — prioritize the improvements below."}
        </p>
      </div>

      {/* Strengths + Improvements */}
      <div className="grid gap-5 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-2xl border border-border bg-surface-elevated/70 p-6 dark:bg-surface/70"
        >
          <div className="mb-4 flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Strengths
            </h2>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex gap-3 text-sm leading-relaxed text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl border border-border bg-surface-elevated/70 p-6 dark:bg-surface/70"
        >
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Improvements
            </h2>
          </div>
          <ul className="space-y-3">
            {result.improvements.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex gap-3 text-sm leading-relaxed text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Analyze another resume
        </button>
      </div>
    </motion.div>
  );
}
