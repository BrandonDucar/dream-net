/**
 * Price Provider for CoinSensei
 * Fetches live/recent prices from CoinGecko or CoinMarketCap
 */

import axios from 'axios';

export interface PriceData {
  price: number;
  source: string;
  timestamp: Date;
  change_24h?: number;
  change_7d?: number;
}

export class PriceProvider {
  private cache: Map<string, { data: PriceData; expires: number }> = new Map();
  private cacheTTL = 60000; // 1 minute

  async getPrice(
    tokenId: string,
    source: 'coingecko' | 'cmc' | 'auto' = 'auto'
  ): Promise<PriceData> {
    const cacheKey = `${tokenId}-${source}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    let priceData: PriceData;

    if (source === 'coingecko' || source === 'auto') {
      try {
        priceData = await this.fetchCoinGecko(tokenId);
      } catch (error) {
        if (source === 'auto') {
          priceData = await this.fetchCMC(tokenId);
        } else {
          throw error;
        }
      }
    } else {
      priceData = await this.fetchCMC(tokenId);
    }

    this.cache.set(cacheKey, {
      data: priceData,
      expires: Date.now() + this.cacheTTL,
    });

    return priceData;
  }

  async getPrices(
    tokenIds: string[],
    source: 'coingecko' | 'cmc' | 'auto' = 'auto'
  ): Promise<Map<string, PriceData>> {
    const prices = new Map<string, PriceData>();
    
    // Batch fetch from CoinGecko
    if (source === 'coingecko' || source === 'auto') {
      try {
        const batch = await this.fetchCoinGeckoBatch(tokenIds);
        batch.forEach((price, id) => prices.set(id, price));
        
        // Fill missing from CMC if needed
        if (source === 'auto') {
          const missing = tokenIds.filter(id => !prices.has(id));
          for (const id of missing) {
            try {
              prices.set(id, await this.fetchCMC(id));
            } catch (e) {
              // Skip if both fail
            }
          }
        }
      } catch (error) {
        // Fallback to individual CMC calls
        for (const id of tokenIds) {
          try {
            prices.set(id, await this.fetchCMC(id));
          } catch (e) {
            // Skip failed tokens
          }
        }
      }
    } else {
      for (const id of tokenIds) {
        try {
          prices.set(id, await this.fetchCMC(id));
        } catch (e) {
          // Skip failed tokens
        }
      }
    }

    return prices;
  }

  private async fetchCoinGecko(tokenId: string): Promise<PriceData> {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: tokenId,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_7d_change: true,
        },
        timeout: 5000,
      }
    );

    const data = response.data[tokenId];
    if (!data || !data.usd) {
      throw new Error(`Price not found for ${tokenId}`);
    }

    return {
      price: data.usd,
      source: 'coingecko',
      timestamp: new Date(),
      change_24h: data.usd_24h_change,
      change_7d: data.usd_7d_change,
    };
  }

  private async fetchCoinGeckoBatch(tokenIds: string[]): Promise<Map<string, PriceData>> {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: tokenIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_7d_change: true,
        },
        timeout: 10000,
      }
    );

    const prices = new Map<string, PriceData>();
    const now = new Date();

    for (const [id, data] of Object.entries(response.data)) {
      const priceData = data as any;
      if (priceData.usd) {
        prices.set(id, {
          price: priceData.usd,
          source: 'coingecko',
          timestamp: now,
          change_24h: priceData.usd_24h_change,
          change_7d: priceData.usd_7d_change,
        });
      }
    }

    return prices;
  }

  private async fetchCMC(tokenId: string): Promise<PriceData> {
    // Note: CMC API requires API key, so this is a placeholder
    // In production, you'd use: https://coinmarketcap.com/api/
    throw new Error('CMC API requires API key - use CoinGecko or provide API key');
  }

  // Helper to map common symbols to CoinGecko IDs
  static getCoinGeckoId(symbol: string, chain?: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'SOL': 'solana',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'DOT': 'polkadot',
      'ADA': 'cardano',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'AAVE': 'aave',
      'CRV': 'curve-dao-token',
    };

    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }
}

