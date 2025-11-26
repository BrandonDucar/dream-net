/**
 * Stock Market Price Spike
 * Fetches real-time stock prices from Alpha Vantage API
 */

import type { StockPrice, MarketDataSpikeConfig, MarketDataSpikeStatus } from "./types";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

const ALPHA_VANTAGE_API_BASE = "https://www.alphavantage.co/query";

export class StockSpike {
  private config: MarketDataSpikeConfig;
  private status: MarketDataSpikeStatus;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: MarketDataSpikeConfig) {
    this.config = {
      enabled: true,
      frequency: 300000, // 5 minutes default (Alpha Vantage has rate limits)
      symbols: ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"], // Default top stocks
      ...config,
    };
    this.status = {
      type: "stocks",
      lastFetch: null,
      lastSuccess: null,
      errorCount: 0,
      successCount: 0,
      isRunning: false,
      nextFetch: null,
    };
  }

  /**
   * Start the stock price spike
   */
  start(): void {
    if (this.status.isRunning) {
      console.warn("[StockSpike] Already running");
      return;
    }

    if (!this.config.enabled) {
      console.log("[StockSpike] Disabled, not starting");
      return;
    }

    if (!this.config.apiKey) {
      console.error("[StockSpike] API key not configured");
      return;
    }

    this.status.isRunning = true;
    console.log(`[StockSpike] Starting - fetching every ${this.config.frequency}ms`);

    // Fetch immediately
    this.fetchPrices();

    // Then fetch on interval
    this.intervalId = setInterval(() => {
      this.fetchPrices();
    }, this.config.frequency);
  }

  /**
   * Stop the stock price spike
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.status.isRunning = false;
    console.log("[StockSpike] Stopped");
  }

  /**
   * Fetch current stock prices
   */
  async fetchPrices(): Promise<StockPrice[] | null> {
    this.status.lastFetch = Date.now();
    this.status.nextFetch = this.status.lastFetch + this.config.frequency;

    try {
      const symbols = this.config.symbols || ["AAPL"];
      const prices: StockPrice[] = [];

      // Alpha Vantage requires one API call per symbol (rate limit: 5 calls/minute)
      for (const symbol of symbols) {
        // Add delay between requests to respect rate limits
        if (prices.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay between calls
        }

        const url = `${ALPHA_VANTAGE_API_BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${this.config.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check for API error messages
        if (data["Error Message"]) {
          throw new Error(`Alpha Vantage error: ${data["Error Message"]}`);
        }

        if (data["Note"]) {
          console.warn(`[StockSpike] Rate limit warning for ${symbol}: ${data["Note"]}`);
          continue; // Skip this symbol if rate limited
        }

        // Parse time series data
        const timeSeries = data["Time Series (1min)"];
        if (!timeSeries) {
          console.warn(`[StockSpike] No time series data for ${symbol}`);
          continue;
        }

        // Get most recent data point
        const latestTimestamp = Object.keys(timeSeries).sort().reverse()[0];
        const latestData = timeSeries[latestTimestamp];

        const price: StockPrice = {
          symbol,
          open: parseFloat(latestData["1. open"]),
          high: parseFloat(latestData["2. high"]),
          low: parseFloat(latestData["3. low"]),
          close: parseFloat(latestData["4. close"]),
          volume: parseInt(latestData["5. volume"]),
          timestamp: new Date(latestTimestamp).getTime(),
        };

        // Calculate change if we have previous close
        // (In production, you'd store previous close to calculate change)
        
        prices.push(price);

        // Emit to Spider Web Core as market-data fly
        SpiderWebCore.createFly(
          "market-data",
          "stock-spike",
          {
            type: "stocks",
            symbol: price.symbol,
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
            volume: price.volume,
            timestamp: price.timestamp,
          },
          "medium",
          false
        );
      }

      this.status.lastSuccess = Date.now();
      this.status.successCount++;
      this.status.errorCount = 0; // Reset error count on success

      console.log(`[StockSpike] Fetched ${prices.length} stock prices`);
      return prices;
    } catch (error: any) {
      this.status.errorCount++;
      console.error(`[StockSpike] Error fetching prices:`, error.message);
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

