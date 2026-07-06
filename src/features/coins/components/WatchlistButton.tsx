import { useWatchlist } from '@/features/watchlist/store/watchlist.context'

export function WatchlistButton({ coinId }: { coinId: string }) {
  const { isWatched, toggle } = useWatchlist()
  const watched = isWatched(coinId)

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(coinId)
      }}
      aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={watched}
      className={`text-base leading-none transition-colors ${watched ? 'text-warn' : 'text-text-lo/50 hover:text-warn'}`}
    >
      {watched ? '★' : '☆'}
    </button>
  )
}
