/**
 * Market Data Core
 * Real-time data collection spikes for metals, crypto, and stock markets
 * Now with intelligent agent wrappers
 */

export { MetalsSpike } from "./metalsSpike";
export { CryptoSpike } from "./cryptoSpike";
export { StockSpike } from "./stockSpike";
export { MetalsAgent } from "./agents/MetalsAgent";
export { CryptoAgent } from "./agents/CryptoAgent";
export { StockAgent } from "./agents/StockAgent";
export { BaseSpikeAgent } from "./agents/BaseSpikeAgent";
export { initSpikeAgentIntegration } from "./agents/agent-registry";
export { RWAValuationOracle } from "./agents/RWAValuationOracle";
export type {
  MetalPrice,
  CryptoPrice,
  StockPrice,
  MarketDataSpikeConfig,
  MarketDataSpikeStatus,
} from "./types";

import { MetalsAgent } from "./agents/MetalsAgent";
import { CryptoAgent } from "./agents/CryptoAgent";
import { StockAgent } from "./agents/StockAgent";
import { RWAValuationOracle } from "./agents/RWAValuationOracle";
import type { MarketDataSpikeConfig } from "./types";

export interface MarketDataCoreConfig {
  metals?: MarketDataSpikeConfig;
  crypto?: MarketDataSpikeConfig;
  stocks?: MarketDataSpikeConfig;
  useAgents?: boolean; // Default: true, set to false to use spikes directly
}

export class MarketDataCore {
  private metalsAgent: MetalsAgent;
  private cryptoAgent: CryptoAgent;
  private stockAgent: StockAgent;
  private rwaOracle: RWAValuationOracle;
  private useAgents: boolean;

  constructor(config: MarketDataCoreConfig = {}) {
    this.useAgents = config.useAgents !== false; // Default to true

    // Initialize RWA Oracle
    this.rwaOracle = new RWAValuationOracle();

    if (this.useAgents) {
      // Use agents (intelligent wrappers)
      this.metalsAgent = new MetalsAgent(config.metals || { enabled: false });
      this.cryptoAgent = new CryptoAgent(config.crypto || { enabled: false });
      this.stockAgent = new StockAgent(config.stocks || { enabled: false });
    } else {
      // Fallback to direct spikes (backward compatibility)
      const { MetalsSpike } = require("./metalsSpike");
      const { CryptoSpike } = require("./cryptoSpike");
      const { StockSpike } = require("./stockSpike");
      
      // Create agents that wrap spikes (for consistency)
      this.metalsAgent = new MetalsAgent(config.metals || { enabled: false });
      this.cryptoAgent = new CryptoAgent(config.crypto || { enabled: false });
      this.stockAgent = new StockAgent(config.stocks || { enabled: false });
    }
  }

  /**
   * Start all enabled agents/spikes
   */
  start(): void {
    console.log(`[MarketDataCore] Starting market data ${this.useAgents ? "agents" : "spikes"}...`);
    this.metalsAgent.start();
    this.cryptoAgent.start();
    this.stockAgent.start();
    this.rwaOracle.start(60000); // Update every minute
  }

  /**
   * Stop all agents/spikes
   */
  stop(): void {
    console.log(`[MarketDataCore] Stopping market data ${this.useAgents ? "agents" : "spikes"}...`);
    this.metalsAgent.stop();
    this.cryptoAgent.stop();
    this.stockAgent.stop();
    this.rwaOracle.stop();
  }

  /**
   * Get status of all agents/spikes
   */
  getStatus() {
    const metalsStatus = this.metalsAgent.getSpikeStatus();
    const cryptoStatus = this.cryptoAgent.getSpikeStatus();
    const stocksStatus = this.stockAgent.getSpikeStatus();

    return {
      metals: metalsStatus || {
        type: "metals" as const,
        lastFetch: null,
        lastSuccess: null,
        errorCount: 0,
        successCount: 0,
        isRunning: false,
        nextFetch: null,
      },
      crypto: cryptoStatus || {
        type: "crypto" as const,
        lastFetch: null,
        lastSuccess: null,
        errorCount: 0,
        successCount: 0,
        isRunning: false,
        nextFetch: null,
      },
      stocks: stocksStatus || {
        type: "stocks" as const,
        lastFetch: null,
        lastSuccess: null,
        errorCount: 0,
        successCount: 0,
        isRunning: false,
        nextFetch: null,
      },
    };
  }

  /**
   * Get metals agent instance
   */
  getMetalsAgent(): MetalsAgent {
    return this.metalsAgent;
  }

  /**
   * Get crypto agent instance
   */
  getCryptoAgent(): CryptoAgent {
    return this.cryptoAgent;
  }

  /**
   * Get stock agent instance
   */
  getStockAgent(): StockAgent {
    return this.stockAgent;
  }

  /**
   * Get metals spike instance (backward compatibility)
   */
  getMetalsSpike() {
    return this.metalsAgent.getSpike();
  }

  /**
   * Get crypto spike instance (backward compatibility)
   */
  getCryptoSpike() {
    return this.cryptoAgent.getSpike();
  }

  /**
   * Get stock spike instance (backward compatibility)
   */
  getStockSpike() {
    return this.stockAgent.getSpike();
  }

  /**
   * Get RWA Oracle instance
   */
  getRWAOracle(): RWAValuationOracle {
    return this.rwaOracle;
  }
}

export default MarketDataCore;

