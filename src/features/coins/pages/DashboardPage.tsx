import { useEffect, useMemo, useState } from 'react'
import { useMarkets } from '@/features/coins/hooks/useMarkets'
import { useSearch } from '@/features/coins/store/search.context'
import { CoinTable } from '@/features/coins/components/CoinTable'
import { CoinDetailPanel } from '@/features/coins/components/CoinDetailPanel'
import { MarketStatStrip } from '@/features/coins/components/MarketStatStrip'
import { StatusMessage } from '@/shared/components/StatusMessage'

export function DashboardPage() {
  const { coins, isLoading, isError, refetch } = useMarkets()
  const { query } = useSearch()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedId && coins.length > 0) setSelectedId(coins[0].id)
  }, [coins, selectedId])

  const filteredCoins = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return coins
    return coins.filter((coin) => coin.name.toLowerCase().includes(normalized) || coin.symbol.toLowerCase().includes(normalized))
  }, [coins, query])

  if (isLoading) return <StatusMessage kind="loading">Loading market data…</StatusMessage>
  if (isError)
    return (
      <StatusMessage kind="error" onRetry={refetch}>
        Couldn't load market data. Please try again later.
      </StatusMessage>
    )

  return (
    <div className="mx-auto max-w-[1400px] pb-16">
      <MarketStatStrip />
      <div className="grid items-start gap-[22px] px-4 pt-6 sm:px-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <CoinTable coins={filteredCoins} selectedId={selectedId} onSelect={setSelectedId} />
        {selectedId && <CoinDetailPanel coinId={selectedId} className="lg:sticky lg:top-[86px]" />}
      </div>
    </div>
  )
}
