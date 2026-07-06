import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CoinMarket } from '@/features/coins/types/coin.types'
import { Sparkline } from '@/features/coins/components/Sparkline'
import { WatchlistButton } from '@/features/coins/components/WatchlistButton'
import { useWatchlist } from '@/features/watchlist/store/watchlist.context'
import { StatusMessage } from '@/shared/components/StatusMessage'
import { formatCompactNumber, formatCurrency, formatPercent } from '@/shared/lib/format'

type Tab = 'top' | 'gainers' | 'watchlist'

const TABS: { key: Tab; label: string }[] = [
  { key: 'top', label: 'Top' },
  { key: 'gainers', label: 'Gainers' },
  { key: 'watchlist', label: 'Watchlist' },
]

const GRID_COLUMNS = '22px 28px minmax(94px,1.8fr) minmax(70px,1fr) 70px minmax(56px,0.8fr) 78px'

interface CoinTableProps {
  coins: CoinMarket[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CoinTable({ coins, selectedId, onSelect }: CoinTableProps) {
  const { coinIds } = useWatchlist()
  const [tab, setTab] = useState<Tab>('top')

  const rows = useMemo(() => {
    if (tab === 'watchlist') return coins.filter((coin) => coinIds.includes(coin.id))
    if (tab === 'gainers') return [...coins].sort((a, b) => (b.priceChangePercentage24h ?? -Infinity) - (a.priceChangePercentage24h ?? -Infinity))
    return coins
  }, [coins, coinIds, tab])

  return (
    <section className="overflow-hidden rounded-[18px] border border-border bg-bg-surface shadow-[0_1px_0_rgba(255,255,255,0.02),0_8px_24px_-12px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between gap-3 px-[22px] pb-3.5 pt-4">
        <div className="flex items-center gap-2.5">
          <h2 className="m-0 text-[16px] font-semibold tracking-tight text-text-hi">Markets</h2>
          <span className="rounded-md border border-border bg-bg-elevated px-2 py-0.5 font-mono text-[11px] text-text-lo">
            {rows.length}
          </span>
        </div>
        <div className="flex gap-0.5 rounded-[10px] border border-border bg-bg-elevated p-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-[7px] px-2.5 py-1 font-sans text-xs font-semibold transition-colors ${
                tab === t.key ? 'bg-bg-surface text-text-hi' : 'text-text-lo hover:text-text-mid'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div
            className="grid items-center gap-2 border-y border-border bg-bg-base px-3.5 py-2"
            style={{ gridTemplateColumns: GRID_COLUMNS }}
          >
            <span />
            <span className="text-right text-[10.5px] font-semibold uppercase tracking-wide text-text-lo">#</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-wide text-text-lo">Asset</span>
            <span className="text-right text-[10.5px] font-semibold uppercase tracking-wide text-text-lo">Price</span>
            <span className="text-right text-[10.5px] font-semibold uppercase tracking-wide text-text-lo">24h</span>
            <span className="text-right text-[10.5px] font-semibold uppercase tracking-wide text-text-lo">Mkt Cap</span>
            <span className="text-right text-[10.5px] font-semibold uppercase tracking-wide text-text-lo">Last 7d</span>
          </div>

          {rows.length === 0 ? (
            <StatusMessage kind="empty">
              {tab === 'watchlist' ? 'Your watchlist is empty — star a coin to add it here.' : 'No coins match your search.'}
            </StatusMessage>
          ) : (
            <div className="max-h-[640px] overflow-y-auto">
              {rows.map((coin) => {
                const isPositive = (coin.priceChangePercentage24h ?? 0) >= 0
                const isSelected = coin.id === selectedId
                return (
                  <div
                    key={coin.id}
                    onClick={() => onSelect(coin.id)}
                    style={{ gridTemplateColumns: GRID_COLUMNS, background: isSelected ? 'var(--brand-soft)' : undefined }}
                    className={`grid cursor-pointer items-center gap-2 border-b border-border py-3 pl-3 pr-3.5 transition-colors last:border-0 hover:bg-bg-hover ${
                      isSelected ? 'border-l-2 border-l-brand' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    <WatchlistButton coinId={coin.id} />
                    <span className="text-right font-mono text-xs tabular-nums text-text-lo">{coin.marketCapRank ?? '—'}</span>
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={coin.image} alt="" width={32} height={32} className="shrink-0 rounded-full" />
                      <div className="min-w-0">
                        <Link
                          to={`/coin/${coin.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="block truncate text-sm font-semibold tracking-tight text-text-hi hover:underline"
                        >
                          {coin.name}
                        </Link>
                        <div className="font-mono text-[11px] font-medium text-text-lo">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                    <span className="text-right font-mono text-sm font-semibold tracking-tight tabular-nums text-text-hi">
                      {formatCurrency(coin.currentPrice)}
                    </span>
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1 rounded-[7px] px-2 py-1 font-mono text-xs font-semibold tabular-nums ${
                          isPositive ? 'bg-pos-soft text-pos' : 'bg-neg-soft text-neg'
                        }`}
                      >
                        <span className="text-[9px]">{isPositive ? '▲' : '▼'}</span>
                        {formatPercent(coin.priceChangePercentage24h)}
                      </span>
                    </div>
                    <span className="text-right font-mono text-[13px] font-medium tabular-nums text-text-mid">
                      {formatCompactNumber(coin.marketCap)}
                    </span>
                    <div className="flex justify-end">
                      <Sparkline points={coin.sparkline} isPositive={isPositive} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
