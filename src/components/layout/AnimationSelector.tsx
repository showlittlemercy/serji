"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import {
  MONTH_NAMES,
  useAnimation,
  type AnimationSelection,
} from "@/context/AnimationContext";

const OPTIONS: { value: AnimationSelection; label: string }[] = [
  { value: "auto", label: "Auto (Monthly)" },
  ...MONTH_NAMES.map((name, index) => ({
    value: index as AnimationSelection,
    label: name,
  })),
];

/**
 * Minimalist animation month picker for the Navbar.
 * Sits beside the theme toggle; drives AnimationContext.
 */
export function AnimationSelector() {
  const { selection, setSelection, label } = useAnimation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Background animation: ${label}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 max-w-[9.5rem] items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-2.5 text-foreground transition-colors hover:border-primary hover:text-primary sm:max-w-none sm:gap-2 sm:px-3"
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <span className="truncate text-xs font-medium sm:text-sm">
          <span className="sm:hidden">
            {selection === "auto" ? "Auto" : label.slice(0, 3)}
          </span>
          <span className="hidden sm:inline">{label}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-fg transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Background animation month"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 z-[60] mt-2 max-h-72 w-48 overflow-y-auto rounded-xl border border-border bg-surface-elevated/95 py-1.5 shadow-lg backdrop-blur-md dark:bg-surface/95"
          >
            {OPTIONS.map((option) => {
              const active = selection === option.value;
              return (
                <li key={String(option.value)} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelection(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <span>{option.label}</span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
