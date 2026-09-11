"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2,
  Loader2,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  CODE_SOLVER_LANGUAGES,
  languageToPrismId,
  type CodeSolverApiResponse,
  type CodeSolverLanguage,
  type CodeSolverMode,
  type CodeSolverResult,
} from "@/lib/code-solver-types";
import { CodeBlock } from "@/components/code-solver/CodeBlock";

/**
 * Smart Code Snippet & Error Solver — split input / AI output workspace.
 */
export function CodeSolver() {
  const [language, setLanguage] = useState<CodeSolverLanguage>("Python");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<CodeSolverMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CodeSolverResult | null>(null);

  const prismLang = languageToPrismId(language);

  async function run(mode: CodeSolverMode) {
    if (!input.trim()) {
      setError(
        mode === "solve"
          ? "Paste buggy code or an error message first."
          : "Describe the snippet you want generated."
      );
      return;
    }

    setLoading(true);
    setActiveMode(mode);
    setError(null);

    try {
      const res = await fetch("/api/code-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, language, input }),
      });

      const data = (await res.json()) as CodeSolverApiResponse;
      if (!data.ok) {
        setError(data.error || "Request failed.");
        return;
      }

      setResult(data.result);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
      setActiveMode(null);
    }
  }

  const outputCode =
    result?.mode === "solve"
      ? result.fixed_code
      : result?.mode === "generate"
        ? result.code
        : "";

  const secondaryText =
    result?.mode === "solve"
      ? result.explanation
      : result?.mode === "generate"
        ? result.usage_example
        : "";

  const secondaryTitle =
    result?.mode === "solve" ? "Explanation" : "Usage example";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Code2 className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Smart Code Snippet &amp; Error Solver
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-fg sm:text-base">
          Paste broken code to debug it, or describe what you need — Gemini
          returns clean fixes and snippets with explanations.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-medium text-foreground">Language</span>
          <select
            value={language}
            disabled={loading}
            onChange={(e) =>
              setLanguage(e.target.value as CodeSolverLanguage)
            }
            className="rounded-xl border border-border bg-surface-elevated/80 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary dark:bg-surface/80"
          >
            {CODE_SOLVER_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => run("solve")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-primary/90 sm:flex-none"
          >
            {loading && activeMode === "solve" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wrench className="h-4 w-4" />
            )}
            Solve Error
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => run("generate")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated/80 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-surface/80 sm:flex-none"
          >
            {loading && activeMode === "generate" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate Snippet
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      {/* Split panes */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        {/* Input */}
        <section className="flex min-h-[22rem] flex-col rounded-2xl border border-border bg-surface-elevated/70 dark:bg-surface/70">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Input — buggy code or prompt
            </h2>
            <p className="text-xs text-muted-fg">
              Examples: paste a stack trace, or “Write a Python scraper for…”
            </p>
          </div>
          <textarea
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={
              language === "Python"
                ? '# Paste buggy code or describe what you need…\ndef scrape(url):\n    ...'
                : "// Paste buggy code or describe what you need…"
            }
            className="min-h-[18rem] flex-1 resize-y bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-fg/70 disabled:opacity-60"
          />
        </section>

        {/* Output */}
        <section className="flex min-h-[22rem] flex-col rounded-2xl border border-border bg-surface-elevated/70 dark:bg-surface/70">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              AI solution
            </h2>
            <p className="text-xs text-muted-fg">
              Fixed code or generated snippet appears here
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-muted-fg"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">
                    {activeMode === "solve"
                      ? "Debugging your code…"
                      : "Generating snippet…"}
                  </p>
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "15%" }}
                      animate={{ width: ["15%", "75%", "90%"] }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>
              ) : result && outputCode ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <CodeBlock
                    code={outputCode}
                    language={prismLang}
                    label={
                      result.mode === "solve" ? "Fixed code" : "Generated code"
                    }
                  />

                  {secondaryText && (
                    <div className="rounded-xl border border-border bg-background/60 p-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                        {secondaryTitle}
                      </h3>
                      {result.mode === "generate" ? (
                        <CodeBlock
                          code={secondaryText}
                          language={prismLang}
                          label="Usage"
                        />
                      ) : (
                        <p className="text-sm leading-relaxed text-foreground">
                          {secondaryText}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-1 items-center justify-center px-6 py-16 text-center text-sm text-muted-fg"
                >
                  Run <strong className="mx-1 text-foreground">Solve Error</strong>{" "}
                  or{" "}
                  <strong className="mx-1 text-foreground">Generate Snippet</strong>{" "}
                  to see results here.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
