const WIDTH = 110
const HEIGHT = 34
const PADDING = 3

export function Sparkline({ points, isPositive }: { points: number[]; isPositive: boolean }) {
  if (points.length < 2) return <div style={{ width: WIDTH, height: HEIGHT }} />

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const dx = WIDTH / (points.length - 1)

  const coords = points.map((price, index) => {
    const x = index * dx
    const y = PADDING + (1 - (price - min) / range) * (HEIGHT - PADDING * 2)
    return [x, y] as const
  })

  const line = 'M ' + coords.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')
  const area = `${line} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`
  const color = isPositive ? 'var(--pos)' : 'var(--neg)'

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
      <path d={area} fill={color} opacity={0.14} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
