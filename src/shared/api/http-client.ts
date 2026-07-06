import { env } from '@/shared/config/env'

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const RATE_LIMIT_RETRIES = 3
const RATE_LIMIT_DELAY_MS = 1500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function get<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${env.coingeckoApiBaseUrl}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
    const response = await fetch(url, { signal, headers: { accept: 'application/json' } })

    if (response.status === 429 && attempt < RATE_LIMIT_RETRIES) {
      await sleep(RATE_LIMIT_DELAY_MS * (attempt + 1))
      continue
    }

    if (!response.ok) {
      throw new HttpError(response.status, `CoinGecko request failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  throw new HttpError(429, 'CoinGecko rate limit exceeded, please try again shortly.')
}

export const httpClient = { get }
