"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileSearch,
  FileText,
  Loader2,
  Link2,
  UploadCloud,
  X,
} from "lucide-react";
import type { AnalyzeApiResponse, AnalyzeResult } from "@/lib/analyze-types";
import { ResultsDashboard } from "@/components/resume-analyzer/ResultsDashboard";

/**
 * Full Resume Analyzer experience: upload → analyze → results.
 */
export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const next = accepted[0];
    if (!next) return;
    setFile(next);
    setError(null);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
      multiple: false,
      disabled: loading,
    });

  const rejectionMessage =
    fileRejections[0]?.errors[0]?.message ??
    (fileRejections.length ? "Invalid file. Please upload a PDF under 5 MB." : null);

  async function handleAnalyze() {
    if (!file) {
      setError("Please upload a PDF resume first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      if (portfolioUrl.trim()) {
        body.append("portfolioUrl", portfolioUrl.trim());
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body,
      });

      const data = (await res.json()) as AnalyzeApiResponse;

      if (!data.ok) {
        setError(data.error || "Analysis failed.");
        return;
      }

      setResult(data.result);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setPortfolioUrl("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Page header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileSearch className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          AI Resume &amp; Portfolio Analyzer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-fg sm:text-base">
          Upload your PDF resume for an ATS-style score, strengths, and
          actionable improvements — powered by Google Gemini&apos;s free tier.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <ResultsDashboard key="results" result={result} onReset={handleReset} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface-elevated/60 hover:border-primary/50 hover:bg-surface-elevated/90 dark:bg-surface/60"
              } ${loading ? "pointer-events-none opacity-70" : ""}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-4 font-display text-lg font-semibold text-foreground">
                {isDragActive ? "Drop your resume here" : "Drag & drop your PDF resume"}
              </p>
              <p className="mt-1 text-sm text-muted-fg">
                or click to browse · PDF only · max 5 MB
              </p>

              {file && (
                <div
                  className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3 rounded-xl border border-border bg-background/80 px-4 py-3 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-fg">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="rounded-lg p-1.5 text-muted-fg transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {(rejectionMessage || error) && (
              <p className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
                {error || rejectionMessage}
              </p>
            )}

            {/* Portfolio URL */}
            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Link2 className="h-4 w-4 text-primary" />
                Portfolio URL{" "}
                <span className="font-normal text-muted-fg">(optional)</span>
              </span>
              <input
                type="url"
                inputMode="url"
                placeholder="https://your-portfolio.com"
                value={portfolioUrl}
                disabled={loading}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-elevated/80 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-fg focus:border-primary dark:bg-surface/80"
              />
            </label>

            {/* Analyze CTA */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-primary/90 sm:w-auto sm:min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing resume…
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4" />
                  Analyze
                </>
              )}
            </button>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-xl border border-border bg-surface/50 p-4"
              >
                <div className="mb-2 flex items-center justify-between text-xs text-muted-fg">
                  <span>Extracting PDF · Running ATS analysis</span>
                  <span className="animate-pulse text-primary">Working</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: "8%" }}
                    animate={{ width: ["12%", "70%", "88%"] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
