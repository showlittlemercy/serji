import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ProjectStubProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Reusable stub layout for upcoming SERJI tools.
 * Replace with real tool UI when each project is built out.
 */
export function ProjectStub({ title, description, icon: Icon }: ProjectStubProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden />
      </div>

      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-lg text-muted-fg">{description}</p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-4 py-2 text-sm text-muted-fg">
        <Construction className="h-4 w-4 text-primary" />
        Coming soon — scaffold ready
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to SERJI
      </Link>
    </div>
  );
}
