const QUOTES = [
  {
    quote:
      "I stopped checking the chart at 2am. The DCA bot handles the entries I used to fumble half-asleep, and the backtests actually matched live results.",
    name: "Priya R.",
    role: "Swing trader, 3 years",
  },
  {
    quote:
      "Grid bots on sideways alts turned dead time into steady small wins. Setup took longer to read about than to actually do.",
    name: "Marcus L.",
    role: "Part-time trader",
  },
  {
    quote:
      "We moved four client sub-accounts onto signal bots wired to our own TradingView alerts. Execution latency has been the smallest variable in our returns.",
    name: "Dana K.",
    role: "Runs a small trading desk",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Traders who got their evenings back.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {QUOTES.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between rounded-lg border border-border bg-surface p-6">
              <blockquote className="text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-xs text-muted">
                <span className="font-semibold text-ink">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
