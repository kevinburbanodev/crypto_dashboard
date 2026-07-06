import { useGlobalStats } from '@/features/coins/hooks/useGlobalStats'
import { useFearGreed } from '@/features/coins/hooks/useFearGreed'
import { formatCompactNumber, formatPercent } from '@/shared/lib/format'

export function MarketStatStrip() {
  const { stats } = useGlobalStats()
  const { index } = useFearGreed()

  const items = [
    {
      label: 'Total Market Cap',
      value: stats ? `$${formatCompactNumber(stats.totalMarketCap)}` : '—',
      delta: stats ? formatPercent(stats.marketCapChangePercentage24h) : '—',
      isPositive: (stats?.marketCapChangePercentage24h ?? 0) >= 0,
    },
    {
      label: '24h Volume',
      value: stats ? `$${formatCompactNumber(stats.totalVolume24h)}` : '—',
      delta: null,
      isPositive: true,
    },
    {
      label: 'BTC Dominance',
      value: stats ? `${stats.btcDominance.toFixed(1)}%` : '—',
      delta: null,
      isPositive: true,
    },
    {
      label: 'Fear & Greed',
      value: index ? String(index.value) : '—',
      delta: index ? index.classification : null,
      isPositive: null,
    },
  ]

  return (
    <div className="flex items-stretch gap-0 overflow-x-auto px-4 pt-5 sm:px-7">
      {items.map((item) => (
        <div
          key={item.label}
          className="mr-[22px] min-w-[170px] flex-1 border-r border-border py-0.5 pr-[22px] last:mr-0 last:border-r-0"
        >
          <span className="text-[11.5px] font-medium uppercase tracking-wide text-text-lo">{item.label}</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-[19px] font-semibold tracking-tight tabular-nums text-text-hi">{item.value}</span>
            {item.delta && (
              <span
                className={`font-mono text-xs font-semibold ${
                  item.isPositive === null ? 'text-warn' : item.isPositive ? 'text-pos' : 'text-neg'
                }`}
              >
                {item.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
