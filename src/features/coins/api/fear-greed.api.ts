import type { FearGreedIndex } from '@/features/coins/types/coin.types'

interface AlternativeMeFngDto {
  data: { value: string; value_classification: string }[]
}

export async function getFearGreedIndex(signal?: AbortSignal): Promise<FearGreedIndex> {
  const response = await fetch('https://api.alternative.me/fng/?limit=1&format=json', { signal })
  if (!response.ok) throw new Error(`Fear & Greed request failed: ${response.status}`)
  const dto = (await response.json()) as AlternativeMeFngDto
  const [latest] = dto.data
  return { value: Number(latest.value), classification: latest.value_classification }
}
