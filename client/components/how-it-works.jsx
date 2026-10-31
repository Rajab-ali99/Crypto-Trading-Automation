const STEPS = [
  {
    n: "01",
    title: "Connect your exchange",
    description:
      "Link a read/trade-only API key from Binance, Coinbase, Kraken, or any of our 15 supported exchanges. Withdrawal permissions are never requested.",
  },
  {
    n: "02",
    title: "Choose or build a bot",
    description:
      "Start from a tested template, clone a strategy from the marketplace, or set your own entry, safety order, and take-profit rules.",
  },
  {
    n: "03",
    title: "Let it trade",
    description:
      "Your bot runs 24/7 on our infrastructure, not your laptop. Watch fills, P&L, and open orders update in real time from any device.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            From API key to first fill in under five minutes.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative">
              <span className="font-mono text-sm text-signal">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              {i < STEPS.length - 1 && (
                <div className="mt-8 hidden h-px w-full bg-border sm:block" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
