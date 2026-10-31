"use client";

// Each candle is built from stacked square "pixels" rather than a smooth
// rectangle — a literal reading of "Bullish Pixel" instead of a generic
// gradient sparkline. bodyPx = height of the candle body in pixel units,
// wickPx = extra height of the thin wick above the body. Everything sits
// on a shared baseline so the whole chart reads as one upward climb.
const PX = 6;
const BASELINE = 84;
const CANDLE_W = PX * 3 - 1;
const WICK_W = 2;
const GAP = 4;

const CANDLES = [
  { bodyPx: 4, wickPx: 2, bull: true },
  { bodyPx: 5, wickPx: 1, bull: false },
  { bodyPx: 6, wickPx: 2, bull: true },
  { bodyPx: 5, wickPx: 3, bull: true },
  { bodyPx: 3, wickPx: 1, bull: false },
  { bodyPx: 7, wickPx: 2, bull: true },
  { bodyPx: 6, wickPx: 3, bull: true },
  { bodyPx: 4, wickPx: 1, bull: false },
  { bodyPx: 8, wickPx: 2, bull: true },
  { bodyPx: 7, wickPx: 3, bull: true },
  { bodyPx: 5, wickPx: 1, bull: false },
  { bodyPx: 9, wickPx: 3, bull: true },
  { bodyPx: 10, wickPx: 2, bull: true },
  { bodyPx: 6, wickPx: 1, bull: false },
  { bodyPx: 11, wickPx: 3, bull: true },
];

function PixelStack({ x, width, count, colorClass }) {
  const blocks = [];
  for (let i = 0; i < count; i++) {
    const y = BASELINE - (i + 1) * PX;
    blocks.push(<rect key={i} x={x} y={y} width={width} height={PX - 1} className={colorClass} />);
  }
  return <>{blocks}</>;
}

export function PixelChart() {
  const totalWidth = CANDLES.length * (CANDLE_W + GAP);
  const wickX = (CANDLE_W - WICK_W) / 2;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border bg-surface/60 p-6 backdrop-blur-sm"
      role="img"
      aria-label="Illustrative candlestick chart trending upward, rendered in a pixel-block style"
    >
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-bull" />
          BTC/USDT · BULLISH PIXEL BOT #4471
        </span>
        <span className="text-bull">+18.62%</span>
      </div>
      <svg
        viewBox={`0 0 ${totalWidth} ${BASELINE}`}
        className="h-40 w-full sm:h-48"
        preserveAspectRatio="xMidYMax meet"
      >
        {CANDLES.map((c, idx) => {
          const x = idx * (CANDLE_W + GAP);
          const colorClass = c.bull ? "fill-bull" : "fill-bear";
          const bodyBlocks = Math.round(c.bodyPx / PX) || 1;
          const wickBlocks = Math.round(c.wickPx / PX) || 1;
          return (
            <g
              key={idx}
              style={{
                transformOrigin: `${x + CANDLE_W / 2}px ${BASELINE}px`,
                animationDelay: `${idx * 70}ms`,
              }}
              className="origin-bottom animate-rise opacity-0"
            >
              <PixelStack x={x} width={CANDLE_W} count={bodyBlocks} colorClass={colorClass} />
              <PixelStack x={x + wickX} width={WICK_W} count={bodyBlocks + wickBlocks} colorClass={colorClass} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
