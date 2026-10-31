const EXCHANGES = ["Binance", "Coinbase", "Kraken", "OKX", "Bybit", "KuCoin", "Bitget", "Bitfinex"];

export function ExchangeMarquee() {
  const row = [...EXCHANGES, ...EXCHANGES];

  return (
    <div className="border-y border-border bg-surface/50 py-6">
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted">
        Connects directly to the exchanges you already use
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {row.map((name, i) => (
            <span key={`${name}-${i}`} className="font-display text-lg font-medium text-muted/70">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
