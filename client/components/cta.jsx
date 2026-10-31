import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your strategy doesn&apos;t need to sleep either.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Connect an exchange, launch a paper-trading bot, and watch your
            first pixel go green — no card required.
          </p>
          <a
            href="#pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-signal px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start free trial
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
