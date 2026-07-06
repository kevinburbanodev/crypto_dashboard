import type { CoinDetail, CoinMarket, GlobalStats, LivePrice, PricePoint } from '@/features/coins/types/coin.types'

interface CgMarketDto {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number | null
  price_change_percentage_24h: number | null
  sparkline_in_7d?: { price: number[] }
}

interface CgDetailDto {
  id: string
  symbol: string
  name: string
  description: { en?: string }
  image: { large: string }
  links: { homepage?: string[] }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    market_cap_rank: number | null
    price_change_percentage_24h: number | null
    high_24h: { usd: number }
    low_24h: { usd: number }
    total_volume: { usd: number }
    circulating_supply: number | null
  }
}

interface CgMarketChartDto {
  prices: [number, number][]
}

interface CgGlobalDto {
  data: {
    total_market_cap: { usd: number }
    total_volume: { usd: number }
    market_cap_percentage: { btc: number }
    market_cap_change_percentage_24h_usd: number
  }
}

export function toCoinMarket(dto: CgMarketDto): CoinMarket {
  return {
    id: dto.id,
    symbol: dto.symbol,
    name: dto.name,
    image: dto.image,
    currentPrice: dto.current_price,
    marketCap: dto.market_cap,
    marketCapRank: dto.market_cap_rank,
    priceChangePercentage24h: dto.price_change_percentage_24h,
    sparkline: dto.sparkline_in_7d?.price ?? [],
  }
}

export function toCoinDetail(dto: CgDetailDto): CoinDetail {
  return {
    id: dto.id,
    symbol: dto.symbol,
    name: dto.name,
    image: dto.image.large,
    description: dto.description.en ?? '',
    currentPrice: dto.market_data.current_price.usd,
    marketCap: dto.market_data.market_cap.usd,
    marketCapRank: dto.market_data.market_cap_rank,
    priceChangePercentage24h: dto.market_data.price_change_percentage_24h,
    high24h: dto.market_data.high_24h?.usd ?? null,
    low24h: dto.market_data.low_24h?.usd ?? null,
    totalVolume24h: dto.market_data.total_volume?.usd ?? null,
    circulatingSupply: dto.market_data.circulating_supply ?? null,
    homepage: dto.links.homepage?.find((url) => url) ?? null,
  }
}

export function toPricePoints(dto: CgMarketChartDto): PricePoint[] {
  return dto.prices.map(([timestamp, price]) => ({ timestamp, price }))
}

export function toGlobalStats(dto: CgGlobalDto): GlobalStats {
  return {
    totalMarketCap: dto.data.total_market_cap.usd,
    totalVolume24h: dto.data.total_volume.usd,
    btcDominance: dto.data.market_cap_percentage.btc,
    marketCapChangePercentage24h: dto.data.market_cap_change_percentage_24h_usd,
  }
}

export function toLivePrice(dto: Record<string, { usd: number; usd_24h_change?: number }>, id: string): LivePrice | null {
  const entry = dto[id]
  if (!entry) return null
  return { price: entry.usd, changePercentage24h: entry.usd_24h_change ?? null }
}
