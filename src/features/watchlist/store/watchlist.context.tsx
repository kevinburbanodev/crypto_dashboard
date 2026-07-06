import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'cd_watchlist'

interface WatchlistContextValue {
  coinIds: string[]
  isWatched: (id: string) => boolean
  toggle: (id: string) => void
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null)

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [coinIds, setCoinIds] = useState<string[]>(readStoredIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coinIds))
  }, [coinIds])

  function toggle(id: string) {
    setCoinIds((prev) => (prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]))
  }

  const value: WatchlistContextValue = {
    coinIds,
    isWatched: (id) => coinIds.includes(id),
    toggle,
  }

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within a WatchlistProvider')
  return ctx
}
