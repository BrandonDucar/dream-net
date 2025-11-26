/**
 * Stock Agent
 * Intelligent agent wrapper for StockSpike
 * Monitors data collection, uses browser automation for verification, makes autonomous decisions
 */

import { BaseSpikeAgent, type SpikeAgentConfig } from "./BaseSpikeAgent";
import { StockSpike } from "../stockSpike";
import type { MarketDataSpikeConfig, MarketDataSpikeStatus, StockPrice } from "../types";
import { checkAPIDashboard, verifyPriceOnWebsite, checkAPIStatusPage } from "./browser-helpers";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export class StockAgent extends BaseSpikeAgent {
  private spike: StockSpike;
  private lastBrowserCheck: number = 0;
  private browserCheckInterval: number = 30 * 60 * 1000; // Check every 30 minutes
  private rateLimitCount: number = 0;
  private lastRateLimitTime: number = 0;

  constructor(config: MarketDataSpikeConfig, agentConfig?: Partial<SpikeAgentConfig>) {
    super({
      agentId: "StockAgent",
      agentName: "Stock Agent",
      spikeType: "stocks",
      subsystem: "MarketDataCore",
      tags: ["stocks", "market-data", "spike-agent"],
      ...agentConfig,
    });

    this.spike = new StockSpike(config);
    
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
    spikeInstance.fetchPrices = async (): Promise<StockPrice[] | null> => {
      const startTime = Date.now();
      
      // Make decision: should we fetch?
      if (!this.shouldFetch()) {
        return null;
      }

      // Check rate limits (Alpha Vantage: 5 calls/minute)
      if (this.isRateLimited()) {
        console.log(`[${this.config.agentName}] Rate limited, skipping fetch`);
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

      // Check for rate limit errors
      if (result === null && status.errorCount > 0) {
        // Alpha Vantage returns "Note" field when rate limited
        // This would be detected in the spike, but we track it here
        this.rateLimitCount++;
        this.lastRateLimitTime = Date.now();
      }

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
          rateLimited: this.isRateLimited(),
        },
        result ? "low" : "medium",
        false
      );

      // If fetch failed, consider browser check
      if (result === null && status.errorCount > 2) {
        this.scheduleBrowserCheck();
      }

      return result;
    };
  }

  /**
   * Check if we're rate limited
   */
  private isRateLimited(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // If we hit rate limit recently, wait
    if (this.lastRateLimitTime > oneMinuteAgo) {
      return true;
    }

    // Reset counter if enough time has passed
    if (this.lastRateLimitTime < oneMinuteAgo) {
      this.rateLimitCount = 0;
    }

    return false;
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
  getSpike(): StockSpike {
    return this.spike;
  }

  /**
   * Override: Check Alpha Vantage status
   */
  async checkAPIDashboard(): Promise<{ success: boolean; status: string }> {
    const now = Date.now();
    if (now - this.lastBrowserCheck < this.browserCheckInterval) {
      return { success: true, status: "recently_checked" };
    }

    try {
      // Alpha Vantage doesn't have a public status page, so we check their website
      const result = await checkAPIDashboard(
        "https://www.alphavantage.co/support/",
        this.config.agentId,
        ["alphavantage.co", "www.alphavantage.co"]
      );

      this.lastBrowserCheck = now;
      this.metrics.lastBrowserCheck = now;

      return result;
    } catch (error: any) {
      console.error(`[${this.config.agentName}] Error checking dashboard:`, error.message);
      return { success: false, status: "error" };
    }
  }

  /**
   * Override: Verify stock price on external website
   */
  async verifyDataOnWebsite(symbol: string, expectedPrice: number): Promise<boolean> {
    // Use Yahoo Finance or similar
    const yahooUrl = `https://finance.yahoo.com/quote/${symbol}`;
    
    try {
      const result = await verifyPriceOnWebsite(
        symbol,
        expectedPrice,
        yahooUrl,
        "[data-symbol]",
        this.config.agentId,
        ["yahoo.com", "finance.yahoo.com"]
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
   * Override: Adjust frequency based on rate limits
   */
  getAdjustedFrequency(currentFrequency: number): number {
    // If rate limited, slow down significantly
    if (this.isRateLimited()) {
      return currentFrequency * 3;
    }

    // If API is down, slow down
    if (this.metrics.apiHealth === "down") {
      return currentFrequency * 5;
    }

    // If degraded, double the interval
    if (this.metrics.apiHealth === "degraded") {
      return currentFrequency * 2;
    }

    // Alpha Vantage has strict rate limits (5 calls/minute)
    // Default frequency should already respect this, but we ensure it
    const minFrequency = 12000; // 12 seconds per call minimum
    return Math.max(currentFrequency, minFrequency);
  }

  /**
   * Override: Skip fetch if rate limited
   */
  shouldFetch(): boolean {
    if (this.isRateLimited()) {
      return false;
    }

    return super.shouldFetch();
  }

  /**
   * Update spike configuration
   */
  updateConfig(config: Partial<MarketDataSpikeConfig>): void {
    this.spike.updateConfig(config);
  }
}

