/**
 * Precious Metals Price Spike
 * Fetches real-time gold, silver, platinum, palladium prices from Metals-API
 */

import type { MetalPrice, MarketDataSpikeConfig, MarketDataSpikeStatus } from "./types";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

const METALS_API_BASE = "https://api.metalpriceapi.com/v1";

export class MetalsSpike {
  private config: MarketDataSpikeConfig;
  private status: MarketDataSpikeStatus;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: MarketDataSpikeConfig) {
    this.config = {
      enabled: true,
      frequency: 60000, // 1 minute default
      ...config,
    };
    this.status = {
      type: "metals",
      lastFetch: null,
      lastSuccess: null,
      errorCount: 0,
      successCount: 0,
      isRunning: false,
      nextFetch: null,
    };
  }

  /**
   * Start the metals price spike
   */
  start(): void {
    if (this.status.isRunning) {
      console.warn("[MetalsSpike] Already running");
      return;
    }

    if (!this.config.enabled) {
      console.log("[MetalsSpike] Disabled, not starting");
      return;
    }

    if (!this.config.apiKey) {
      console.error("[MetalsSpike] API key not configured");
      return;
    }

    this.status.isRunning = true;
    console.log(`[MetalsSpike] Starting - fetching every ${this.config.frequency}ms`);

    // Fetch immediately
    this.fetchPrices();

    // Then fetch on interval
    this.intervalId = setInterval(() => {
      this.fetchPrices();
    }, this.config.frequency);
  }

  /**
   * Stop the metals price spike
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.status.isRunning = false;
    console.log("[MetalsSpike] Stopped");
  }

  /**
   * Fetch current metal prices
   */
  async fetchPrices(): Promise<MetalPrice[] | null> {
    this.status.lastFetch = Date.now();
    this.status.nextFetch = this.status.lastFetch + this.config.frequency;

    try {
      // Fetch latest prices for major metals
      const symbols = ["XAU", "XAG", "XPT", "XPD"]; // Gold, Silver, Platinum, Palladium
      const prices: MetalPrice[] = [];

      // Fetch all metals at once (more efficient)
      const symbolsStr = symbols.join(",");
      const url = `${METALS_API_BASE}/latest?api_key=${this.config.apiKey}&base=USD&currencies=${symbolsStr}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Metals-API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.rates) {
        // Metals-API returns rates as 1 USD = X ounces of metal
        // So we need to invert for price per ounce
        for (const symbol of symbols) {
          const rate = data.rates[symbol];
          if (rate) {
            const price = 1 / rate; // Convert from "USD per ounce" to "ounces per USD" then invert
            prices.push({
              symbol,
              price,
              currency: "USD",
              timestamp: Date.now(),
            });
          }
        }
      }

      // Emit to Spider Web Core as market-data fly
      for (const price of prices) {
        SpiderWebCore.createFly(
          "market-data",
          "metals-spike",
          {
            type: "metals",
            symbol: price.symbol,
            price: price.price,
            currency: price.currency,
            timestamp: price.timestamp,
          },
          "medium",
          false
        );
      }

      this.status.lastSuccess = Date.now();
      this.status.successCount++;
      this.status.errorCount = 0; // Reset error count on success

      console.log(`[MetalsSpike] Fetched ${prices.length} metal prices`);
      return prices;
    } catch (error: any) {
      this.status.errorCount++;
      console.error(`[MetalsSpike] Error fetching prices:`, error.message);
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

