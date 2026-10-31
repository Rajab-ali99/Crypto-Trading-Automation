const COLUMNS = [
  { title: "Product", links: ["DCA Bot", "Grid Bot", "Signal Bot", "Rebalancing Bot", "Backtesting"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Status"] },
  { title: "Resources", links: ["Documentation", "API", "Exchange guides", "Security"] },
  { title: "Legal", links: ["Terms", "Privacy", "Risk disclosure"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 grid-cols-2 gap-[2px]" aria-hidden="true">
                <span className="bg-bull" />
                <span className="bg-bullLight" />
                <span className="bg-bullLight" />
                <span className="bg-bull" />
              </span>
              <span className="font-display text-base font-bold">Bullish Pixel</span>
            </div>
            <p className="mt-4 text-sm text-muted">
              Automated crypto trading bots, running 24/7 across every major exchange.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted hover:text-ink">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bullish Pixel. All rights reserved.</p>
          <p className="max-w-lg">
            Trading cryptocurrency involves substantial risk of loss. Past
            performance of any strategy or bot does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
