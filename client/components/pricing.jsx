import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Get comfortable with automation before you commit capital.",
    features: ["2 active bots", "1 exchange connection", "Paper trading", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$39",
    period: "/ month",
    description: "For traders running real strategies across multiple pairs.",
    features: [
      "Unlimited bots",
      "5 exchange connections",
      "TradingView signal bots",
      "Backtesting engine",
      "Priority support",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Institutional",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure and limits for funds and desks.",
    features: [
      "Unlimited exchanges",
      "Sub-account management",
      "Dedicated execution nodes",
      "SLA & audit logs",
      "Account manager",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 max-w-xl">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Pricing that scales with your strategy, not your losses.
        </h2>
        <p className="mt-4 text-muted">No performance fees. No profit share. Ever.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-lg border p-7",
              plan.featured
                ? "border-signal bg-surface shadow-[0_0_0_1px_rgb(var(--signal))]"
                : "border-border bg-surface"
            )}
          >
            {plan.featured && (
              <span className="mb-4 w-fit rounded-full bg-signal/10 px-2.5 py-1 text-[11px] font-medium text-signal">
                Most traders pick this
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-sm text-muted">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-mono text-3xl font-semibold">{plan.price}</span>
              {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-bull" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className={cn(
                "mt-8 inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90",
                plan.featured ? "bg-signal text-white" : "border border-border text-ink"
              )}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
