import { Link, useParams } from 'react-router-dom'
import { CoinDetailPanel } from '@/features/coins/components/CoinDetailPanel'

export function CoinDetailPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 sm:px-7">
      <Link to="/" className="text-sm text-text-mid hover:text-text-hi hover:underline">
        ← Back to dashboard
      </Link>
      <CoinDetailPanel coinId={id} />
    </div>
  )
}
