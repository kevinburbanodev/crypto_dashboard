import { httpClient } from '@/shared/api/http-client'
import { toCoinDetail, toCoinMarket, toGlobalStats, toLivePrice, toPricePoints } from '@/features/coins/api/coin.mapper'
import type { ChartRange, CoinDetail, CoinMarket, GlobalStats, LivePrice, PricePoint } from '@/features/coins/types/coin.types'

export async function getMarkets(signal?: AbortSignal): Promise<CoinMarket[]> {
  const dtos = await httpClient.get<Parameters<typeof toCoinMarket>[0][]>(
    '/coins/markets',
    {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: true,
      price_change_percentage: '24h',
    },
    signal,
  )
  return dtos.map(toCoinMarket)
}

export async function getCoinDetail(id: string, signal?: AbortSignal): Promise<CoinDetail> {
  const dto = await httpClient.get<Parameters<typeof toCoinDetail>[0]>(
    `/coins/${id}`,
    { localization: false, tickers: false, community_data: false, developer_data: false },
    signal,
  )
  return toCoinDetail(dto)
}

export async function getMarketChart(id: string, days: ChartRange, signal?: AbortSignal): Promise<PricePoint[]> {
  const dto = await httpClient.get<Parameters<typeof toPricePoints>[0]>(
    `/coins/${id}/market_chart`,
    { vs_currency: 'usd', days },
    signal,
  )
  return toPricePoints(dto)
}

export async function getGlobalStats(signal?: AbortSignal): Promise<GlobalStats> {
  const dto = await httpClient.get<Parameters<typeof toGlobalStats>[0]>('/global', {}, signal)
  return toGlobalStats(dto)
}

export async function getLivePrice(id: string, signal?: AbortSignal): Promise<LivePrice | null> {
  const dto = await httpClient.get<Record<string, { usd: number; usd_24h_change?: number }>>(
    '/simple/price',
    { ids: id, vs_currencies: 'usd', include_24hr_change: true },
    signal,
  )
  return toLivePrice(dto, id)
}
