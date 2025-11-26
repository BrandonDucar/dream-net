/**
 * Base Spike Agent
 * Abstract base class for all market data spike agents
 * Provides common functionality: monitoring, browser automation, decision making, health reporting
 */

import { AgentRegistryCore } from "@dreamnet/agent-registry-core";
import { SpiderWebCore } from "@dreamnet/spider-web-core";
import type { AgentConfig, AgentHealth } from "@dreamnet/agent-registry-core";
import type { MarketDataSpikeStatus } from "../types";

export interface SpikeAgentConfig {
  agentId: string;
  agentName: string;
  spikeType: "metals" | "crypto" | "stocks";
  subsystem?: string;
  tags?: string[];
}

export interface AgentMetrics {
  fetchLatency: number[]; // Array of recent fetch latencies
  dataQuality: number; // 0-1 score based on data completeness
  apiHealth: "healthy" | "degraded" | "down";
  lastBrowserCheck: number | null;
}

/**
 * Abstract base class for spike agents
 */
export abstract class BaseSpikeAgent {
  protected config: SpikeAgentConfig;
  protected metrics: AgentMetrics;
  protected spikeStatus: MarketDataSpikeStatus | null = null;
  private healthReportInterval: NodeJS.Timeout | null = null;

  constructor(config: SpikeAgentConfig) {
    this.config = config;
    this.metrics = {
      fetchLatency: [],
      dataQuality: 1.0,
      apiHealth: "healthy",
      lastBrowserCheck: null,
    };

    // Register with Agent Registry
    this.registerWithAgentRegistry();
  }

  /**
   * Register agent with Agent Registry
   */
  private registerWithAgentRegistry(): void {
    const agentConfig: AgentConfig = {
      id: this.config.agentId,
      name: this.config.agentName,
      kind: "data",
      description: `Monitors and manages ${this.config.spikeType} market data collection`,
      subsystem: this.config.subsystem || "MarketDataCore",
      tags: this.config.tags || [this.config.spikeType, "market-data", "spike-agent"],
    };

    AgentRegistryCore.upsertAgentConfig(agentConfig);
    console.log(`[${this.config.agentName}] Registered with Agent Registry`);
  }

  /**
   * Start the agent (starts monitoring and health reporting)
   */
  start(): void {
    // Start health reporting cycle (every 5 minutes)
    this.healthReportInterval = setInterval(() => {
      this.reportHealth();
    }, 5 * 60 * 1000);

    // Initial health report
    this.reportHealth();

    console.log(`[${this.config.agentName}] Started monitoring`);
  }

  /**
   * Stop the agent
   */
  stop(): void {
    if (this.healthReportInterval) {
      clearInterval(this.healthReportInterval);
      this.healthReportInterval = null;
    }
    console.log(`[${this.config.agentName}] Stopped monitoring`);
  }

  /**
   * Update spike status (called by spike after each fetch)
   */
  updateSpikeStatus(status: MarketDataSpikeStatus): void {
    this.spikeStatus = status;
    this.updateMetrics(status);
  }

  /**
   * Update agent metrics based on spike status
   */
  protected updateMetrics(status: MarketDataSpikeStatus): void {
    // Calculate data quality (based on success rate)
    const totalFetches = status.successCount + status.errorCount;
    if (totalFetches > 0) {
      this.metrics.dataQuality = status.successCount / totalFetches;
    }

    // Determine API health
    if (status.errorCount > 5 && status.errorCount > status.successCount) {
      this.metrics.apiHealth = "down";
    } else if (status.errorCount > 2) {
      this.metrics.apiHealth = "degraded";
    } else {
      this.metrics.apiHealth = "healthy";
    }

    // Record success/error in Agent Registry
    if (status.lastSuccess && status.lastSuccess > (status.lastFetch || 0) - 1000) {
      AgentRegistryCore.recordSuccess(this.config.agentId);
    } else if (status.errorCount > 0) {
      AgentRegistryCore.recordError(this.config.agentId, `Failed to fetch ${this.config.spikeType} data`);
    }
  }

  /**
   * Report health to Agent Registry and DreamKeeper
   */
  protected reportHealth(): void {
    const health: AgentHealth = {
      agentId: this.config.agentId,
      state: this.getAgentState(),
      successCount: this.spikeStatus?.successCount || 0,
      errorCount: this.spikeStatus?.errorCount || 0,
      updatedAt: Date.now(),
      metadata: {
        spikeType: this.config.spikeType,
        apiHealth: this.metrics.apiHealth,
        dataQuality: this.metrics.dataQuality,
        isRunning: this.spikeStatus?.isRunning || false,
        lastFetch: this.spikeStatus?.lastFetch || null,
        lastSuccess: this.spikeStatus?.lastSuccess || null,
      },
    };

    // Update health in Agent Registry (using internal store access)
    // Note: AgentRegistryCore doesn't expose upsertHealth directly,
    // but health is automatically tracked via recordSuccess/recordError
    // We'll emit a fly for DreamKeeper to pick up

    // Emit health fly to Spider Web Core
    SpiderWebCore.createFly(
      "agent-health",
      this.config.agentId,
      {
        agentId: this.config.agentId,
        agentName: this.config.agentName,
        state: health.state,
        metrics: this.metrics,
        spikeStatus: this.spikeStatus,
      },
      health.state === "error" ? "high" : "medium",
      false
    );

    console.log(`[${this.config.agentName}] Health reported: ${health.state}`);
  }

  /**
   * Determine agent state based on metrics
   */
  protected getAgentState(): "idle" | "active" | "degraded" | "error" | "disabled" {
    if (!this.spikeStatus?.isRunning) {
      return "idle";
    }

    if (this.metrics.apiHealth === "down") {
      return "error";
    }

    if (this.metrics.apiHealth === "degraded" || this.metrics.dataQuality < 0.7) {
      return "degraded";
    }

    return "active";
  }

  /**
   * Make decision: should we fetch now?
   * Override in subclasses for specific logic
   */
  shouldFetch(): boolean {
    // Default: fetch if API is healthy
    if (this.metrics.apiHealth === "down") {
      console.log(`[${this.config.agentName}] Skipping fetch - API is down`);
      return false;
    }

    return true;
  }

  /**
   * Make decision: adjust fetch frequency?
   * Override in subclasses for specific logic
   */
  getAdjustedFrequency(currentFrequency: number): number {
    // Default: slow down if API is degraded
    if (this.metrics.apiHealth === "degraded") {
      return currentFrequency * 2; // Double the interval
    }

    return currentFrequency;
  }

  /**
   * Use browser automation to check API dashboard/status
   * Override in subclasses for specific URLs
   */
  async checkAPIDashboard(): Promise<{ success: boolean; status: string }> {
    // Default: not implemented, override in subclasses
    console.log(`[${this.config.agentName}] Browser dashboard check not implemented`);
    return { success: false, status: "not_implemented" };
  }

  /**
   * Use browser automation to verify data on external website
   * Override in subclasses for specific verification logic
   */
  async verifyDataOnWebsite(symbol: string, expectedPrice: number): Promise<boolean> {
    // Default: not implemented, override in subclasses
    console.log(`[${this.config.agentName}] Data verification not implemented`);
    return false;
  }

  /**
   * Get agent metrics
   */
  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  /**
   * Get spike status
   */
  getSpikeStatus(): MarketDataSpikeStatus | null {
    return this.spikeStatus ? { ...this.spikeStatus } : null;
  }
}

