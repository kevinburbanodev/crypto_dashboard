import { useEffect, useState } from 'react'
import { getFearGreedIndex } from '@/features/coins/api/fear-greed.api'
import type { FearGreedIndex } from '@/features/coins/types/coin.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useFearGreed() {
  const [index, setIndex] = useState<FearGreedIndex | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getFearGreedIndex(controller.signal)
      .then((result) => {
        setIndex(result)
        setStatus('success')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [])

  return { index, status, isLoading: status === 'loading', isError: status === 'error' }
}
