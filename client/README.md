# Bullish Pixel

Landing page for a crypto trading bot & automation platform, built with
Next.js 14 (App Router) and plain JavaScript (JSX) — no TypeScript. Styled
with Tailwind CSS and shipped with a dark/light theme toggle via
`next-themes` (defaults to dark). Only extra runtime dependency is
`lucide-react` for icons.

## Design

- **Palette** — near-black dark surface / off-white light surface, a
  teal-green "bull" accent, coral "bear" accent, and a violet "signal"
  accent reserved for primary calls to action.
- **Type** — Space Grotesk (display), Inter (body), JetBrains Mono (data,
  tickers, prices).
- **Signature element** — the hero chart is built from stacked square
  "pixels" rather than smooth bars, a literal nod to the brand name, over a
  faint pixel-grid backdrop.

Reference points: 3Commas (bot categories, exchange-agnostic automation)
and Pionex (clean, trading-app-first layout).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/            # App Router entry (layout.jsx, page.jsx, globals.css)
components/     # Navbar, hero, bot cards, pricing, footer, theme toggle...
lib/            # cn() class-merging helper
```

Path imports use the `@/` alias, resolved via `jsconfig.json` — no
TypeScript compiler involved, just Next.js's built-in JS module resolution.

All copy is placeholder marketing content — swap it for your own product
details, pricing, and legal disclosures before shipping.
