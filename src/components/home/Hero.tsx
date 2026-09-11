"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS, type SerjiProject } from "@/lib/projects";

/**
 * Single interactive project card — used in the tools grid below the hero.
 */
function ProjectCard({
  project,
  index,
}: {
  project: SerjiProject;
  index: number;
}) {
  const Icon = project.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group flex flex-col rounded-2xl border border-border bg-surface-elevated/70 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:bg-surface/80"
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {project.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-fg">
        {project.description}
      </p>

      <Link
        href={project.href}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-deep dark:hover:bg-primary/90"
      >
        Launch Tool
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.article>
  );
}

/**
 * Landing hero + project showcase.
 * First viewport: brand signal + headline + subheadline.
 * Below: interactive project cards.
 */
export function Hero() {
  return (
    <div className="relative z-10">
      {/* Hero — first viewport composition */}
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-10 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-5xl font-bold tracking-tight text-primary sm:text-6xl md:text-7xl"
        >
          SERJI
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-6 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl"
        >
          Welcome to SERJI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-4 max-w-xl text-base leading-relaxed text-muted-fg sm:text-lg"
        >
          The Ultimate Centralized Hub for AI &amp; Developer Tools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-8"
        >
          <a
            href="#tools"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/80 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
          >
            Explore Tools
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </section>

      {/* Project grid — interactive cards */}
      <section
        id="tools"
        className="mx-auto max-w-6xl px-4 pb-24 sm:px-6"
      >
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Featured Tools
          </h2>
          <p className="mt-2 text-sm text-muted-fg sm:text-base">
            Three focused utilities — more coming soon.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
