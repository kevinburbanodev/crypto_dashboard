import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from '@/shared/components/Header'
import { StatusMessage } from '@/shared/components/StatusMessage'
import { WatchlistProvider } from '@/features/watchlist/store/watchlist.context'
import { SearchProvider } from '@/features/coins/store/search.context'

const DashboardPage = lazy(() => import('@/features/coins/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const CoinDetailPage = lazy(() => import('@/features/coins/pages/CoinDetailPage').then((m) => ({ default: m.CoinDetailPage })))

function App() {
  return (
    <WatchlistProvider>
      <SearchProvider>
        <div className="min-h-svh bg-bg-base text-text-hi">
          <Header />
          <Suspense fallback={<StatusMessage kind="loading">Loading…</StatusMessage>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/coin/:id" element={<CoinDetailPage />} />
            </Routes>
          </Suspense>
        </div>
      </SearchProvider>
    </WatchlistProvider>
  )
}

export default App
