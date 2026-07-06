# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check via `tsc -b` then build for production (both must pass)
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

Type checking (`tsc -b`) is the only automated correctness check and is part of `build`. There is no test runner.

## Environment

No API key is required — CoinGecko's public `/api/v3` endpoints are called directly from the browser. `VITE_COINGECKO_API_BASE_URL` (see `.env.example`) is optional and only needed to point at a different base URL (e.g. a proxy). `src/shared/config/env.ts` defaults it to `https://api.coingecko.com/api/v3` when unset.

`tsconfig.app.json` sets `"ignoreDeprecations": "6.0"` to keep `baseUrl` (needed for the `@/*` path alias) usable under current TypeScript without the build failing on the deprecation warning.

## Architecture

React 19 (function components + hooks) + TypeScript + Vite + React Router + Tailwind CSS v4 + Recharts. The path alias `@/` maps to `src/`.

### Layering: `features/` vs `shared/`

Code is organized by feature slice, not by file type. Cross-feature primitives live in `src/shared/`; feature-specific code lives in `src/features/<name>/` with subfolders `api/`, `components/`, `hooks/`, `pages/`, `store/`, `types/`. Two features exist: `coins` (markets table, coin detail, price chart, search, global stats) and `watchlist` (a small localStorage-backed context, no API calls).

### Data sources — CoinGecko is the primary API, with one documented exception

The app talks to CoinGecko's public API for everything market-related. The layering is strict:

1. `src/shared/api/http-client.ts` — the only place `fetch` is called for CoinGecko. Builds the URL, serializes query params, retries automatically on `429` (up to 3 times with increasing backoff — CoinGecko's free tier rate-limits aggressively under bursts), throws `HttpError` on other non-2xx responses, and forwards `AbortSignal`.
2. `src/features/coins/api/coins.api.ts` — endpoint methods:
   - `getMarkets` — `/coins/markets`, top 100 by market cap with `sparkline=true` and 24h change.
   - `getCoinDetail` — `/coins/{id}`, full metadata for a single coin (includes `total_volume` and `circulating_supply`, used by the stat cards).
   - `getMarketChart` — `/coins/{id}/market_chart`, price history for a `days` range (`'1' | '7' | '30' | '365' | 'max'`).
   - `getGlobalStats` — `/global`, powers the market stat strip (total market cap, 24h volume, BTC dominance).
   - `getLivePrice` — `/simple/price`, polled by `useLivePrice` for the live-updating price ticker.
3. `src/features/coins/api/fear-greed.api.ts` — the **one exception** to "CoinGecko only": hits `api.alternative.me/fng/` directly (not through `http-client.ts`, since it's a different host) for the Fear & Greed index shown in the stat strip.
4. `src/features/coins/api/coin.mapper.ts` — converts every snake_case DTO (from either provider) into camelCase domain types (`coin.types.ts`). **Never let raw DTOs escape the `api/` folder.**

### Data fetching: hooks with cancellation and manual retry

There's no global store — each data-fetching hook (`useMarkets`, `useCoinDetail`, `useMarketChart`, `useGlobalStats`, `useFearGreed` in `src/features/coins/hooks/`) owns its own `status: 'idle' | 'loading' | 'success' | 'error'` state, cancels its in-flight request via `AbortController` on unmount/dependency change, and exposes a `refetch()` that bumps an internal retry counter to re-run the effect. `StatusMessage` renders a "Retry" button wired to `refetch` whenever a fetch fails — CoinGecko's free-tier rate limit means transient failures are expected, not exceptional.

`useLivePrice(id, seedPrice)` is different: it seeds from the already-loaded `CoinDetail.currentPrice`, then polls `/simple/price` every 20s and exposes a `flash: 'up' | 'down' | null` used to trigger the green/red flash animation on the price digits.

### Search and selection are lifted to shared contexts, not page-local state

- `src/features/coins/store/search.context.tsx` — the search query lives here so the `Header` (which renders the search input) and `DashboardPage` (which filters by it) don't need to be in a parent/child relationship.
- `src/features/watchlist/store/watchlist.context.tsx` — watched coin IDs, persisted to `localStorage` under `cd_watchlist`. `CoinTable`'s "Watchlist" tab filters the already-loaded `coins[]` against this — no separate API call.
- The **selected coin** (which one the detail panel shows) is local `useState` in `DashboardPage`, defaulted to the first loaded coin and updated by clicking a table row — it is intentionally not global since only the dashboard needs it.

### Dashboard layout: shared detail panel, two ways to see it

`src/features/coins/components/CoinDetailPanel.tsx` (live price header, timeframe tabs, price chart, 2×2 stat cards, description) is used in two places:

- Inline on `DashboardPage`, sticky next to the markets table, showing whatever coin is `selectedId`.
- Standalone on `CoinDetailPage` (route `/coin/:id`), for direct/shareable links — it renders the exact same component full-width.

Don't duplicate this panel's markup — extend the shared component instead.

### Routing

Two routes in `src/App.tsx`: `/` → `DashboardPage`, `/coin/:id` → `CoinDetailPage`. Both are lazy-loaded via `React.lazy` (wrapped in a `Suspense`) since `CoinDetailPage` pulls in Recharts, which is the largest dependency.

### Design system

This UI was implemented from a Claude Design handoff (a static HTML/CSS mockup export), not designed ad hoc — treat `src/index.css` as the source of truth for tokens rather than introducing new ad hoc colors.

- **Theme mechanism**: CSS custom properties in `:root` (dark, default) and `[data-theme="light"]` (override), toggled by `useDarkMode` setting `document.documentElement.dataset.theme`. Tailwind v4's `@theme` block maps these to utility classes (`bg-bg-surface`, `text-text-hi`, `border-border`, `text-pos`/`text-neg` for gains/losses, etc.) — components use those utilities, not Tailwind's default slate/gray palette, so colors stay correct across both themes automatically.
- **Fonts**: Space Grotesk (UI text, loaded via Google Fonts in `index.html`) mapped to Tailwind's `font-sans`; JetBrains Mono (all numbers — prices, percentages, market caps) mapped to `font-mono`. Any new numeric value should use `font-mono tabular-nums`.
- **Sparklines** (`Sparkline.tsx`) are hand-built inline SVG, not Recharts — with 100 rows rendered at once, 100 Recharts `ResponsiveContainer` instances (each with its own `ResizeObserver`) was a measurable perf hit. The full-size chart in `PriceChart.tsx` still uses Recharts since there's only one on screen at a time.
- Sticky header/panel positioning, the flash-on-price-change animation (`animate-flash-up`/`-down`), and the "LIVE" pulsing dot (`animate-live-pulse`) are all defined as keyframes in `index.css`.
- The header's "Portfolio / Trade / Earn" nav items and the "Connect Wallet" button are intentionally non-functional (disabled, with an explanatory `title` tooltip) — they exist in the source design but have no corresponding feature in this app, and were kept only for visual fidelity rather than implemented as dead links.
