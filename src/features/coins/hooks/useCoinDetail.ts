import { useEffect, useState } from 'react'
import { getCoinDetail } from '@/features/coins/api/coins.api'
import type { CoinDetail } from '@/features/coins/types/coin.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useCoinDetail(id: string) {
  const [coin, setCoin] = useState<CoinDetail | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setCoin(null)

    getCoinDetail(id, controller.signal)
      .then((result) => {
        setCoin(result)
        setStatus('success')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [id, retryKey])

  return {
    coin,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    refetch: () => setRetryKey((key) => key + 1),
  }
}
