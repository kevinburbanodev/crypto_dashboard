import type { ChartRange } from '@/features/coins/types/coin.types'

const RANGES: { value: ChartRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '1M' },
  { value: '365', label: '1Y' },
  { value: 'max', label: 'ALL' },
]

export function RangeSelector({ value, onChange }: { value: ChartRange; onChange: (range: ChartRange) => void }) {
  return (
    <div className="flex gap-0.5 px-[22px] pb-3">
      {RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => onChange(range.value)}
          className={`flex-1 rounded-lg py-1.5 font-mono text-xs font-semibold transition-colors ${
            value === range.value ? 'bg-bg-elevated text-text-hi' : 'text-text-lo hover:text-text-hi'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
