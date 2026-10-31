import { ArrowRight, ShieldCheck } from "lucide-react";
import { PixelChart } from "@/components/pixel-chart";
import { WEBSITE_Register } from "@/routes/WebsiteRoutes";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bg/60 to-bg" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-bull" />
            API keys never leave read/trade scope — no withdrawal access, ever
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl ">
            Crypto Trading Bots &,
            <br />
            <span className="text-gradient">Automation Platform.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Bullish Pixel runs DCA, grid, and signal-based trading bots across
            your exchange accounts around the clock — so your strategy keeps
            working while you don&apos;t have to watch the chart.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WEBSITE_Register}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-signal px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#bots"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-signal/50"
            >
              Explore the bots
            </a>
          </div>
          <p className="mt-4 font-mono text-xs text-muted">
            No credit card required · Paper trading included · Cancel anytime
          </p>
        </div>

        <div className="animate-float">
          <PixelChart />
        </div>
      </div>
    </section>
  );
}
