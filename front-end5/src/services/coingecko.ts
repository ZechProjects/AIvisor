import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const RATE_LIMIT_INTERVAL = 15000; // 15 seconds between requests
const CACHE_DURATION = 60000; // 1 minute cache

interface PriceCache {
  data: unknown;
  timestamp: number;
}

interface RequestQueue {
  timestamp: number;
  promise: Promise<unknown>;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

class CoingeckoService {
  private lastRequestTime: number = 0;
  private cache: Map<string, PriceCache> = new Map();
  private requestQueue: RequestQueue[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async throttledRequest(endpoint: string, params: any = {}): Promise<unknown> {
    const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
    const now = Date.now();

    // Check cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      return cachedData.data;
    }

    // Clean up old requests from queue
    this.requestQueue = this.requestQueue.filter(
      req => now - req.timestamp < RATE_LIMIT_INTERVAL
    );

    // If we have recent requests, wait for the rate limit
    if (this.requestQueue.length > 0) {
      const oldestRequest = this.requestQueue[0];
      const timeToWait = RATE_LIMIT_INTERVAL - (now - oldestRequest.timestamp);
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
    }

    // Make the request
    const requestPromise = axios.get(`${COINGECKO_API}${endpoint}`, { params })
      .then(response => {
        // Update cache
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        });
        return response.data;
      })
      .catch(error => {
        console.error('CoinGecko API error:', error);
        // If we have cached data, return it even if expired
        if (cachedData) {
          console.log('Returning stale cached data due to API error');
          return cachedData.data;
        }
        throw error;
      })
      .finally(() => {
        // Remove this request from queue
        this.requestQueue = this.requestQueue.filter(req => req.promise !== requestPromise);
      });

    // Add to queue
    this.requestQueue.push({
      timestamp: now,
      promise: requestPromise
    });

    return requestPromise;
  }

  async getPrice(cryptoId: string) {
    return this.throttledRequest('/simple/price', {
      ids: cryptoId,
      vs_currencies: 'usd',
    });
  }

  async getPriceHistory(cryptoIds: string[]) {
    return this.throttledRequest('/coins/markets', {
      vs_currency: 'usd',
      ids: cryptoIds.join(','),
      sparkline: true,
      price_change_percentage: '24h',
    }) as Promise<CryptoPrice[]>;
  }

  // Batch price fetching for multiple cryptocurrencies
  async getBatchPrices(cryptoIds: string[]) {
    return this.throttledRequest('/simple/price', {
      ids: cryptoIds.join(','),
      vs_currencies: 'usd',
    });
  }

  // Clear cache for testing or when needed
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats for debugging
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      queueLength: this.requestQueue.length
    };
  }
}

export const coingeckoService = new CoingeckoService(); 