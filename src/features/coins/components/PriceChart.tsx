import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PricePoint } from '@/features/coins/types/coin.types'
import { formatCurrency } from '@/shared/lib/format'

export function PriceChart({ points }: { points: PricePoint[] }) {
  const isPositive = points.length > 1 ? points.at(-1)!.price >= points[0].price : true
  const colorVar = isPositive ? 'var(--pos)' : 'var(--neg)'
  const gradientId = isPositive ? 'chart-gradient-pos' : 'chart-gradient-neg'

  return (
    <div className="h-[230px] w-full px-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorVar} stopOpacity={0.28} />
              <stop offset="100%" stopColor={colorVar} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value: number) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--text-lo)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            minTickGap={50}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: 'var(--text-lo)' }}
            axisLine={false}
            tickLine={false}
            width={78}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--text-lo)' }}
            formatter={(value) => [formatCurrency(Number(value)), 'Price']}
            labelFormatter={(value) => new Date(Number(value)).toLocaleString()}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={colorVar}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
