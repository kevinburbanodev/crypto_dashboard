import { useEffect, useState } from 'react'
import { getMarketChart } from '@/features/coins/api/coins.api'
import type { ChartRange, PricePoint } from '@/features/coins/types/coin.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useMarketChart(id: string, range: ChartRange) {
  const [points, setPoints] = useState<PricePoint[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getMarketChart(id, range, controller.signal)
      .then((result) => {
        setPoints(result)
        setStatus('success')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [id, range, retryKey])

  return {
    points,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    refetch: () => setRetryKey((key) => key + 1),
  }
}
