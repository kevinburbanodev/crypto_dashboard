import { useEffect, useRef, useState } from 'react'
import { getLivePrice } from '@/features/coins/api/coins.api'

const POLL_INTERVAL_MS = 20_000

export function useLivePrice(id: string, seedPrice: number | null) {
  const [price, setPrice] = useState<number | null>(seedPrice)
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const lastPriceRef = useRef<number | null>(seedPrice)
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setPrice(seedPrice)
    lastPriceRef.current = seedPrice
  }, [id, seedPrice])

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()

    const interval = setInterval(() => {
      getLivePrice(id, controller.signal)
        .then((result) => {
          if (!result) return
          const previous = lastPriceRef.current
          lastPriceRef.current = result.price
          setPrice(result.price)
          if (previous !== null && result.price !== previous) {
            setFlash(result.price > previous ? 'up' : 'down')
            clearTimeout(flashTimeoutRef.current)
            flashTimeoutRef.current = setTimeout(() => setFlash(null), 650)
          }
        })
        .catch(() => {})
    }, POLL_INTERVAL_MS)

    return () => {
      controller.abort()
      clearInterval(interval)
      clearTimeout(flashTimeoutRef.current)
    }
  }, [id])

  return { price, flash }
}
