import { useState } from 'react'
import { useCoinDetail } from '@/features/coins/hooks/useCoinDetail'
import { useMarketChart } from '@/features/coins/hooks/useMarketChart'
import { useLivePrice } from '@/features/coins/hooks/useLivePrice'
import { PriceChart } from '@/features/coins/components/PriceChart'
import { RangeSelector } from '@/features/coins/components/RangeSelector'
import { StatCard } from '@/features/coins/components/StatCard'
import { WatchlistButton } from '@/features/coins/components/WatchlistButton'
import { StatusMessage } from '@/shared/components/StatusMessage'
import { formatCompactNumber, formatCurrency, formatPercent } from '@/shared/lib/format'
import type { ChartRange } from '@/features/coins/types/coin.types'

export function CoinDetailPanel({ coinId, className = '' }: { coinId: string; className?: string }) {
  const [range, setRange] = useState<ChartRange>('7')
  const { coin, isLoading, isError, refetch } = useCoinDetail(coinId)
  const { points, isLoading: isChartLoading, isError: isChartError, refetch: refetchChart } = useMarketChart(coinId, range)
  const { price: livePrice, flash } = useLivePrice(coinId, coin?.currentPrice ?? null)

  if (isLoading) return <StatusMessage kind="loading">Loading coin details…</StatusMessage>
  if (isError || !coin)
    return (
      <StatusMessage kind="error" onRetry={refetch}>
        Couldn't load this coin.
      </StatusMessage>
    )

  const isPositive = (coin.priceChangePercentage24h ?? 0) >= 0
  const flashClass = flash === 'up' ? 'animate-flash-up' : flash === 'down' ? 'animate-flash-down' : ''

  return (
    <div className={`flex flex-col gap-[18px] ${className}`}>
      <div className="overflow-hidden rounded-[18px] border border-border bg-bg-surface shadow-[0_1px_0_rgba(255,255,255,0.02),0_8px_24px_-12px_rgba(0,0,0,0.6)]">
        <div className="px-[22px] pb-4 pt-5">
          <div className="mb-4 flex items-center gap-3">
            <img src={coin.image} alt="" width={38} height={38} className="shrink-0 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-text-hi">{coin.name}</span>
                <span className="rounded-[5px] border border-border px-1.5 py-0.5 font-mono text-[11px] text-text-lo">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="mt-0.5 text-[11.5px] text-text-lo">
                {coin.marketCapRank ? `Rank #${coin.marketCapRank} · ` : ''}
                {coin.name} / USD
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <WatchlistButton coinId={coin.id} />
              <span className="h-[7px] w-[7px] animate-live-pulse rounded-full bg-pos" />
              <span className="font-mono text-[10px] tracking-wide text-text-lo">LIVE</span>
            </div>
          </div>

          <div className="flex items-end gap-3.5">
            <span
              className={`-mx-1.5 -my-0.5 rounded-lg px-1.5 py-0.5 font-mono text-[32px] font-bold tracking-tight tabular-nums text-text-hi ${flashClass}`}
            >
              {formatCurrency(livePrice ?? coin.currentPrice)}
            </span>
            <span
              className={`mb-1.5 inline-flex items-center gap-1 font-mono text-sm font-semibold ${isPositive ? 'text-pos' : 'text-neg'}`}
            >
              <span className="text-xs">{isPositive ? '▲' : '▼'}</span>
              {formatPercent(coin.priceChangePercentage24h)}
              <span className="font-medium text-text-lo"> 24h</span>
            </span>
          </div>
        </div>

        <RangeSelector value={range} onChange={setRange} />

        {isChartLoading ? (
          <StatusMessage kind="loading">Loading price history…</StatusMessage>
        ) : isChartError ? (
          <StatusMessage kind="error" onRetry={refetchChart}>
            Couldn't load price history.
          </StatusMessage>
        ) : (
          <PriceChart points={points} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="24h High" value={coin.high24h ? formatCurrency(coin.high24h) : '—'} sub="Session peak" dotColor="var(--pos)" />
        <StatCard label="24h Low" value={coin.low24h ? formatCurrency(coin.low24h) : '—'} sub="Session floor" dotColor="var(--neg)" />
        <StatCard
          label="Market Cap"
          value={formatCurrency(coin.marketCap)}
          sub={coin.marketCapRank ? `Rank #${coin.marketCapRank} by cap` : '—'}
          dotColor="var(--brand)"
        />
        <StatCard
          label="24h Volume"
          value={coin.totalVolume24h ? formatCurrency(coin.totalVolume24h) : '—'}
          sub={coin.circulatingSupply ? `Circ. ${formatCompactNumber(coin.circulatingSupply)} ${coin.symbol.toUpperCase()}` : '—'}
          dotColor="var(--warn)"
        />
      </div>

      {coin.description && (
        <p className="text-[13px] leading-relaxed text-text-mid">{stripHtml(coin.description).slice(0, 500)}</p>
      )}
    </div>
  )
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}
