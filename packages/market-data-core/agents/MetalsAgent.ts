/**
 * Metals Agent
 * Intelligent agent wrapper for MetalsSpike
 * Monitors data collection, uses browser automation for verification, makes autonomous decisions
 */

import { BaseSpikeAgent, type SpikeAgentConfig } from "./BaseSpikeAgent";
import { MetalsSpike } from "../metalsSpike";
import type { MarketDataSpikeConfig, MarketDataSpikeStatus, MetalPrice } from "../types";
import { checkAPIDashboard, verifyPriceOnWebsite, checkAPIStatusPage } from "./browser-helpers";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export class MetalsAgent extends BaseSpikeAgent {
  private spike: MetalsSpike;
  private lastBrowserCheck: number = 0;
  private browserCheckInterval: number = 30 * 60 * 1000; // Check every 30 minutes

  constructor(config: MarketDataSpikeConfig, agentConfig?: Partial<SpikeAgentConfig>) {
    super({
      agentId: "MetalsAgent",
      agentName: "Metals Agent",
      spikeType: "metals",
      subsystem: "MarketDataCore",
      tags: ["metals", "market-data", "spike-agent"],
      ...agentConfig,
    });

    this.spike = new MetalsSpike(config);
    
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
    spikeInstance.fetchPrices = async (): Promise<MetalPrice[] | null> => {
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
        this.metrics.fetchLatency.shift(); // Keep last 100
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
  getSpike(): MetalsSpike {
    return this.spike;
  }

  /**
   * Override: Check Metals-API dashboard
   */
  async checkAPIDashboard(): Promise<{ success: boolean; status: string }> {
    const now = Date.now();
    if (now - this.lastBrowserCheck < this.browserCheckInterval) {
      return { success: true, status: "recently_checked" };
    }

    try {
      const result = await checkAPIDashboard(
        "https://metalpriceapi.com/status",
        this.config.agentId,
        ["metalpriceapi.com", "api.metalpriceapi.com"]
      );

      this.lastBrowserCheck = now;
      this.metrics.lastBrowserCheck = now;

      if (result.success) {
        // Update API health based on dashboard
        if (result.status === "down") {
          this.metrics.apiHealth = "down";
        } else if (result.status === "degraded") {
          this.metrics.apiHealth = "degraded";
        }
      }

      return result;
    } catch (error: any) {
      console.error(`[${this.config.agentName}] Error checking dashboard:`, error.message);
      return { success: false, status: "error" };
    }
  }

  /**
   * Override: Verify metal price on external website
   */
  async verifyDataOnWebsite(symbol: string, expectedPrice: number): Promise<boolean> {
    // Metals-API doesn't have a public price page, so we'll check a gold price site
    const goldPriceUrl = "https://www.goldprice.org/gold-price.html";
    
    try {
      const result = await verifyPriceOnWebsite(
        symbol,
        expectedPrice,
        goldPriceUrl,
        ".price", // Generic selector, would need actual site structure
        this.config.agentId,
        ["goldprice.org", "www.goldprice.org"]
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
      return; // Too soon
    }

    // Check dashboard asynchronously
    this.checkAPIDashboard().catch(error => {
      console.error(`[${this.config.agentName}] Browser check failed:`, error);
    });
  }

  /**
   * Override: Adjust frequency based on API health
   */
  getAdjustedFrequency(currentFrequency: number): number {
    if (this.metrics.apiHealth === "down") {
      return currentFrequency * 5; // Slow down significantly
    } else if (this.metrics.apiHealth === "degraded") {
      return currentFrequency * 2; // Double the interval
    }

    return currentFrequency;
  }

  /**
   * Update spike configuration
   */
  updateConfig(config: Partial<MarketDataSpikeConfig>): void {
    this.spike.updateConfig(config);
  }
}

