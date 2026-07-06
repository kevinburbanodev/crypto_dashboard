import { useEffect, useState } from 'react'
import { getMarkets } from '@/features/coins/api/coins.api'
import type { CoinMarket } from '@/features/coins/types/coin.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useMarkets() {
  const [coins, setCoins] = useState<CoinMarket[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getMarkets(controller.signal)
      .then((result) => {
        setCoins(result)
        setStatus('success')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [retryKey])

  return {
    coins,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    refetch: () => setRetryKey((key) => key + 1),
  }
}
