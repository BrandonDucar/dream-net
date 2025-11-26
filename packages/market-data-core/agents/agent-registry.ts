/**
 * Agent Registry Integration
 * Registers all spike agents with the agent registry
 */

import { AgentRegistryCore } from "@dreamnet/agent-registry-core";
import type { AgentConfig } from "@dreamnet/agent-registry-core";

/**
 * Register all spike agents with the agent registry
 */
export function registerSpikeAgents(): void {
  // Register MetalsAgent
  const metalsAgentConfig: AgentConfig = {
    id: "MetalsAgent",
    name: "Metals Agent",
    kind: "data",
    description: "Monitors and manages precious metals market data collection",
    subsystem: "MarketDataCore",
    tags: ["metals", "market-data", "spike-agent"],
  };

  AgentRegistryCore.upsertAgentConfig(metalsAgentConfig);
  console.log("✅ [MarketDataCore] Registered MetalsAgent");

  // Register CryptoAgent
  const cryptoAgentConfig: AgentConfig = {
    id: "CryptoAgent",
    name: "Crypto Agent",
    kind: "data",
    description: "Monitors and manages cryptocurrency market data collection",
    subsystem: "MarketDataCore",
    tags: ["crypto", "market-data", "spike-agent"],
  };

  AgentRegistryCore.upsertAgentConfig(cryptoAgentConfig);
  console.log("✅ [MarketDataCore] Registered CryptoAgent");

  // Register StockAgent
  const stockAgentConfig: AgentConfig = {
    id: "StockAgent",
    name: "Stock Agent",
    kind: "data",
    description: "Monitors and manages stock market data collection",
    subsystem: "MarketDataCore",
    tags: ["stocks", "market-data", "spike-agent"],
  };

  AgentRegistryCore.upsertAgentConfig(stockAgentConfig);
  console.log("✅ [MarketDataCore] Registered StockAgent");
}

/**
 * Initialize spike agent integration
 * Call this during system startup
 */
export function initSpikeAgentIntegration(): void {
  try {
    registerSpikeAgents();
    console.log("📊 [MarketDataCore] Agent registry integration complete");
  } catch (error: any) {
    console.warn("[MarketDataCore] Failed to register spike agents:", error.message);
  }
}

