const STATS = [
  { value: "240K+", label: "Active bots running" },
  { value: "$3.8B", label: "Trade volume automated / mo" },
  { value: "15", label: "Exchanges supported" },
  { value: "99.98%", label: "Bot engine uptime" },
];

export function StatsStrip() {
  return (
    <section id="performance" className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface px-5 py-6 text-center">
            <div className="font-mono text-2xl font-semibold text-bull sm:text-3xl">{stat.value}</div>
            <div className="mt-2 text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
