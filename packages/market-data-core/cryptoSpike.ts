/**
 * Cryptocurrency Price Spike
 * Fetches real-time crypto prices from CoinGecko API
 */

import type { CryptoPrice, MarketDataSpikeConfig, MarketDataSpikeStatus } from "./types";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export class CryptoSpike {
  private config: MarketDataSpikeConfig;
  private status: MarketDataSpikeStatus;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: MarketDataSpikeConfig) {
    this.config = {
      enabled: true,
      frequency: 60000, // 1 minute default
      symbols: ["bitcoin", "ethereum", "base", "solana"], // Default top coins
      ...config,
    };
    this.status = {
      type: "crypto",
      lastFetch: null,
      lastSuccess: null,
      errorCount: 0,
      successCount: 0,
      isRunning: false,
      nextFetch: null,
    };
  }

  /**
   * Start the crypto price spike
   */
  start(): void {
    if (this.status.isRunning) {
      console.warn("[CryptoSpike] Already running");
      return;
    }

    if (!this.config.enabled) {
      console.log("[CryptoSpike] Disabled, not starting");
      return;
    }

    this.status.isRunning = true;
    console.log(`[CryptoSpike] Starting - fetching every ${this.config.frequency}ms`);

    // Fetch immediately
    this.fetchPrices();

    // Then fetch on interval
    this.intervalId = setInterval(() => {
      this.fetchPrices();
    }, this.config.frequency);
  }

  /**
   * Stop the crypto price spike
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.status.isRunning = false;
    console.log("[CryptoSpike] Stopped");
  }

  /**
   * Fetch current crypto prices
   */
  async fetchPrices(): Promise<CryptoPrice[] | null> {
    this.status.lastFetch = Date.now();
    this.status.nextFetch = this.status.lastFetch + this.config.frequency;

    try {
      // Build coin IDs string (comma-separated)
      const coinIds = this.config.symbols?.join(",") || "bitcoin,ethereum";
      
      const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const prices: CryptoPrice[] = [];

      for (const coin of data) {
        prices.push({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          currentPrice: coin.current_price,
          marketCap: coin.market_cap,
          marketCapRank: coin.market_cap_rank,
          totalVolume: coin.total_volume,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
          priceChange24h: coin.price_change_24h,
          priceChangePercent24h: coin.price_change_percentage_24h,
          timestamp: Date.now(),
        });

        // Emit to Spider Web Core as market-data fly
        SpiderWebCore.createFly(
          "market-data",
          "crypto-spike",
          {
            type: "crypto",
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume: coin.total_volume,
            change24h: coin.price_change_percentage_24h,
            timestamp: Date.now(),
          },
          "medium",
          false
        );
      }

      this.status.lastSuccess = Date.now();
      this.status.successCount++;
      this.status.errorCount = 0; // Reset error count on success

      console.log(`[CryptoSpike] Fetched ${prices.length} crypto prices`);
      return prices;
    } catch (error: any) {
      this.status.errorCount++;
      console.error(`[CryptoSpike] Error fetching prices:`, error.message);
      return null;
    }
  }

  /**
   * Get current status
   */
  getStatus(): MarketDataSpikeStatus {
    return { ...this.status };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<MarketDataSpikeConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart if running
    if (this.status.isRunning) {
      this.stop();
      this.start();
    }
  }
}

