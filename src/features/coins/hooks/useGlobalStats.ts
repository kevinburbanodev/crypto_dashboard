import { useEffect, useState } from 'react'
import { getGlobalStats } from '@/features/coins/api/coins.api'
import type { GlobalStats } from '@/features/coins/types/coin.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getGlobalStats(controller.signal)
      .then((result) => {
        setStats(result)
        setStatus('success')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [])

  return { stats, status, isLoading: status === 'loading', isError: status === 'error' }
}
