"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import { ThemeToggle } from "@/components/providers/ThemeToggle";
import { AnimationSelector } from "@/components/layout/AnimationSelector";

/**
 * Sticky modern Navbar for SERJI.
 * Left: brand · Center: project links · Right: animation selector + theme toggle
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-80 sm:text-2xl"
        >
          SERJI
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex lg:gap-2">
          {PROJECTS.map((project) => {
            const active = pathname.startsWith(project.href);
            return (
              <li key={project.slug}>
                <Link
                  href={project.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-fg hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {project.shortName}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <AnimationSelector />
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/60 text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-border/60 bg-background md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-3">
              {PROJECTS.map((project) => {
                const active = pathname.startsWith(project.href);
                return (
                  <li key={project.slug}>
                    <Link
                      href={project.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-surface"
                      }`}
                    >
                      {project.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
