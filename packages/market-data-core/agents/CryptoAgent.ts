/**
 * Crypto Agent
 * Intelligent agent wrapper for CryptoSpike
 * Monitors data collection, uses browser automation for verification, makes autonomous decisions
 */

import { BaseSpikeAgent, type SpikeAgentConfig } from "./BaseSpikeAgent";
import { CryptoSpike } from "../cryptoSpike";
import type { MarketDataSpikeConfig, MarketDataSpikeStatus, CryptoPrice } from "../types";
import { checkAPIDashboard, verifyPriceOnWebsite, checkAPIStatusPage } from "./browser-helpers";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export class CryptoAgent extends BaseSpikeAgent {
  private spike: CryptoSpike;
  private lastBrowserCheck: number = 0;
  private browserCheckInterval: number = 30 * 60 * 1000; // Check every 30 minutes
  private spikeConfig: MarketDataSpikeConfig;

  constructor(config: MarketDataSpikeConfig, agentConfig?: Partial<SpikeAgentConfig>) {
    super({
      agentId: "CryptoAgent",
      agentName: "Crypto Agent",
      spikeType: "crypto",
      subsystem: "MarketDataCore",
      tags: ["crypto", "market-data", "spike-agent"],
      ...agentConfig,
    });

    this.spikeConfig = config;
    this.spike = new CryptoSpike(config);
    
    // Override spike's fetchPrices to add agent monitoring
    this.wrapSpikeMethods();
  }

  /**
   * Wrap spike methods to add agent monitoring
   */
  private wrapSpikeMethods(): void {
    // Store original method
    const spikeInstance = this.spike as any;
    const originalFetch = spikeInstance.fetchPrices.bind(this.spike);
    
    // Override fetchPrices to add monitoring
    spikeInstance.fetchPrices = async (): Promise<CryptoPrice[] | null> => {
      const startTime = Date.now();
      
      // Make decision: should we fetch?
      if (!this.shouldFetch()) {
        return null;
      }

      // Execute fetch
      const result = await originalFetch();
      const latency = Date.now() - startTime;

      // Update metrics
      this.metrics.fetchLatency.push(latency);
      if (this.metrics.fetchLatency.length > 100) {
        this.metrics.fetchLatency.shift();
      }

      // Update spike status (get from spike)
      const status = (this.spike as any).getStatus();
      this.updateSpikeStatus(status);

      // Emit agent event fly
      SpiderWebCore.createFly(
        "agent-action",
        this.config.agentId,
        {
          action: "fetch_completed",
          success: result !== null,
          latency,
          priceCount: result?.length || 0,
          spikeStatus: status,
        },
        result ? "low" : "medium",
        false
      );

      // If fetch failed, consider browser check
      if (result === null && status.errorCount > 2) {
        this.scheduleBrowserCheck();
      }

      // Check for missing coins
      if (result && this.spikeConfig.symbols) {
        const expectedCount = this.spikeConfig.symbols.length || 0;
        if (result.length < expectedCount) {
          console.warn(`[${this.config.agentName}] Missing coins: expected ${expectedCount}, got ${result.length}`);
          this.metrics.dataQuality = Math.max(0.5, result.length / expectedCount);
        }
      }

      return result;
    };
  }

  /**
   * Start the agent and spike
   */
  start(): void {
    super.start();
    this.spike.start();
    console.log(`[${this.config.agentName}] Started agent and spike`);
  }

  /**
   * Stop the agent and spike
   */
  stop(): void {
    super.stop();
    this.spike.stop();
    console.log(`[${this.config.agentName}] Stopped agent and spike`);
  }

  /**
   * Get spike instance (for backward compatibility)
   */
  getSpike(): CryptoSpike {
    return this.spike;
  }

  /**
   * Override: Check CoinGecko status page
   */
  async checkAPIDashboard(): Promise<{ success: boolean; status: string }> {
    const now = Date.now();
    if (now - this.lastBrowserCheck < this.browserCheckInterval) {
      return { success: true, status: "recently_checked" };
    }

    try {
      const result = await checkAPIStatusPage(
        "https://www.coingecko.com/en/api/status",
        this.config.agentId,
        ["coingecko.com", "www.coingecko.com", "api.coingecko.com"]
      );

      this.lastBrowserCheck = now;
      this.metrics.lastBrowserCheck = now;

      if (result.success) {
        if (result.isDown) {
          this.metrics.apiHealth = "down";
        } else {
          this.metrics.apiHealth = "healthy";
        }
      }

      return { success: result.success, status: result.isDown ? "down" : "healthy" };
    } catch (error: any) {
      console.error(`[${this.config.agentName}] Error checking dashboard:`, error.message);
      return { success: false, status: "error" };
    }
  }

  /**
   * Override: Verify crypto price on CoinGecko website
   */
  async verifyDataOnWebsite(symbol: string, expectedPrice: number): Promise<boolean> {
    const coinGeckoUrl = `https://www.coingecko.com/en/coins/${symbol}`;
    
    try {
      const result = await verifyPriceOnWebsite(
        symbol,
        expectedPrice,
        coinGeckoUrl,
        "[data-price-target]",
        this.config.agentId,
        ["coingecko.com", "www.coingecko.com"]
      );

      if (!result.match && result.actualPrice) {
        const variance = Math.abs(result.actualPrice - expectedPrice) / expectedPrice;
        console.warn(`[${this.config.agentName}] Price variance for ${symbol}: ${(variance * 100).toFixed(2)}%`);
      }

      return result.match;
    } catch (error: any) {
      console.error(`[${this.config.agentName}] Error verifying price:`, error.message);
      return false;
    }
  }

  /**
   * Schedule browser check if needed
   */
  private scheduleBrowserCheck(): void {
    const now = Date.now();
    if (now - this.lastBrowserCheck < this.browserCheckInterval) {
      return;
    }

    this.checkAPIDashboard().catch(error => {
      console.error(`[${this.config.agentName}] Browser check failed:`, error);
    });
  }

  /**
   * Override: Adjust frequency based on market volatility
   */
  getAdjustedFrequency(currentFrequency: number): number {
    // If API is down, slow down significantly
    if (this.metrics.apiHealth === "down") {
      return currentFrequency * 5;
    }

    // If degraded, double the interval
    if (this.metrics.apiHealth === "degraded") {
      return currentFrequency * 2;
    }

    // During high volatility, could fetch more frequently
    // (This would require tracking price changes, not implemented yet)
    
    return currentFrequency;
  }

  /**
   * Update spike configuration
   */
  updateConfig(config: Partial<MarketDataSpikeConfig>): void {
    this.spike.updateConfig(config);
  }
}

