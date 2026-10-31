import { TrendingUp, Grid3x3, Radio, Repeat } from "lucide-react";

const BOTS = [
  {
    icon: TrendingUp,
    name: "DCA Bot",
    description:
      "Averages into a position over time with configurable step size and safety orders, so a single bad entry never decides the trade.",
    tag: "Most popular",
  },
  {
    icon: Grid3x3,
    name: "Grid Bot",
    description:
      "Places buy and sell orders across a price range and profits from volatility in sideways markets, without you touching the order book.",
  },
  {
    icon: Radio,
    name: "Signal Bot",
    description:
      "Executes on alerts from TradingView or your own webhook, turning a strategy you already trust into a standing order.",
  },
  {
    icon: Repeat,
    name: "Rebalancing Bot",
    description:
      "Holds a target portfolio mix and automatically trades back to it on a schedule, so drift doesn't quietly change your risk.",
  },
];

export function BotsSection() {
  return (
    <section id="bots" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 max-w-xl">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Four bots. One engine. Zero screen time.
        </h2>
        <p className="mt-4 text-muted">
          Each bot runs on the same battle-tested execution engine — pick the
          one that matches how you already think about the market.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {BOTS.map((bot) => (
          <div
            key={bot.name}
            className="group relative overflow-hidden rounded-lg border border-border bg-surface p-6 transition-colors hover:border-bull/40"
          >
            {bot.tag && (
              <span className="absolute right-6 top-6 rounded-full bg-bull/10 px-2.5 py-1 text-[11px] font-medium text-bull">
                {bot.tag}
              </span>
            )}
            <bot.icon className="h-6 w-6 text-signal" strokeWidth={1.75} />
            <h3 className="mt-4 font-display text-xl font-semibold">{bot.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{bot.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
