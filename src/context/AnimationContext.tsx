"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** "auto" follows the system calendar month; 0–11 force a specific month */
export type AnimationSelection = "auto" | number;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type AnimationContextValue = {
  /** User selection: auto or month index (0–11) */
  selection: AnimationSelection;
  setSelection: (value: AnimationSelection) => void;
  /**
   * Resolved month index (0–11) used by the background.
   * When selection is "auto", this is `new Date().getMonth()`.
   */
  activeMonth: number;
  /** Human-readable label for the current selection */
  label: string;
};

const AnimationContext = createContext<AnimationContextValue | null>(null);

function resolveMonth(selection: AnimationSelection): number {
  if (selection === "auto") return new Date().getMonth();
  return Math.min(11, Math.max(0, selection));
}

function selectionLabel(selection: AnimationSelection): string {
  if (selection === "auto") return "Auto (Monthly)";
  return MONTH_NAMES[selection] ?? "Auto (Monthly)";
}

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [selection, setSelectionState] = useState<AnimationSelection>("auto");

  const setSelection = useCallback((value: AnimationSelection) => {
    setSelectionState(value);
  }, []);

  const value = useMemo<AnimationContextValue>(() => {
    const activeMonth = resolveMonth(selection);
    return {
      selection,
      setSelection,
      activeMonth,
      label: selectionLabel(selection),
    };
  }, [selection, setSelection]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation(): AnimationContextValue {
  const ctx = useContext(AnimationContext);
  if (!ctx) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return ctx;
}
