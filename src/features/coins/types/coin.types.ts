export interface CoinMarket {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number | null
  priceChangePercentage24h: number | null
  sparkline: number[]
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  image: string
  description: string
  currentPrice: number
  marketCap: number
  marketCapRank: number | null
  priceChangePercentage24h: number | null
  high24h: number | null
  low24h: number | null
  totalVolume24h: number | null
  circulatingSupply: number | null
  homepage: string | null
}

export interface PricePoint {
  timestamp: number
  price: number
}

export type ChartRange = '1' | '7' | '30' | '365' | 'max'

export interface GlobalStats {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  marketCapChangePercentage24h: number
}

export interface FearGreedIndex {
  value: number
  classification: string
}

export interface LivePrice {
  price: number
  changePercentage24h: number | null
}
