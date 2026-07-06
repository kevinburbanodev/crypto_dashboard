# Crypto Dashboard

A real-time-ish crypto market dashboard built with React, TypeScript, and the CoinGecko API. Part of a personal portfolio. The UI follows a "trading terminal" visual design implemented.

## Features

- Split dashboard layout: a markets table on the left, a live detail panel for the selected coin sticky on the right (desktop) / stacked below (mobile)
- Top 100 coins table with price, 24h change, market cap, and a 7-day sparkline, with **Top / Gainers / Watchlist** tabs
- Search by coin name or symbol (⌘K / Ctrl+K to focus), filtering the table live
- Watchlist: star any coin from the table or detail panel to pin it, persisted in `localStorage`
- Coin detail panel with a live-polled price ticker (flashes green/red on change), a price history chart (24H / 7D / 1M / 1Y / ALL) built with Recharts, and 2×2 stat cards (24h high/low, market cap, volume) — available both inline on the dashboard and as a standalone shareable page at `/coin/:id`
- Market-wide stat strip: total market cap, 24h volume, BTC dominance (CoinGecko), and the Fear & Greed index (alternative.me)
- Dark/light "terminal" theme toggle, persisted in `localStorage` and defaulting to the OS preference
- Responsive layout, including horizontally-scrollable tables on small screens

## Stack

React 19 + TypeScript + Vite + React Router + Tailwind CSS v4 + Recharts, organized as feature-first / clean architecture (`src/features/<name>/{api,components,hooks,pages,store,types}`, shared code in `src/shared/`).

No API key is required — CoinGecko's public API is used directly from the browser. Note that CoinGecko's free tier rate-limits aggressively under bursts; the app retries automatically on `429`s and shows a "Retry" button if a request ultimately fails.

## Getting started

```bash
npm install
npm run dev
```

An `.env.example` is provided if you want to point at a different CoinGecko base URL (e.g. a proxy to avoid rate limits); it's optional otherwise.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then build for production; both steps must pass
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

## Project structure

```
src/
  features/
    coins/        # markets table, coin detail panel, price chart, search, global stats
    watchlist/    # localStorage-backed watchlist context
  shared/         # API client, config, format helpers, reusable components
```

See [CLAUDE.md](CLAUDE.md) for a deeper architectural walkthrough (data source boundaries, design tokens, data-fetching conventions, etc.).
