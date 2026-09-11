"use client";

import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

type CodeBlockProps = {
  code: string;
  language: string;
  label?: string;
};

/**
 * Lightweight syntax-highlighted code block with copy button.
 */
export function CodeBlock({ code, language, label }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const prismTheme =
    resolvedTheme === "dark" ? themes.nightOwl : themes.github;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore clipboard failures (permissions / insecure context)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-deep/95 text-light dark:bg-[#1a0505]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <span className="truncate text-xs font-medium uppercase tracking-wide text-light/70">
          {label ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-light/90 transition-colors hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      <Highlight theme={prismTheme} code={code.trimEnd()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} max-h-[min(28rem,55vh)] overflow-auto p-4 text-[13px] leading-relaxed`}
            style={{ ...style, background: "transparent", margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
