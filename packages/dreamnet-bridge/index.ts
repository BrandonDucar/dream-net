/**
 * DreamNet ↔ Cursor Bridge
 * Integration layer for Cursor to communicate with DreamNet's autonomous agents
 * 
 * This bridge allows Cursor to delegate tasks to DreamNet's specialized agents:
 * - System status and health monitoring
 * - Economic analysis and token intelligence
 * - DevOps and deployment management
 * - Wallet and portfolio analytics
 */

import { DreamNetAgent } from "@dreamnet/dreamnet-agent-client";

// Initialize DreamNet agent singleton
let agentInstance: DreamNetAgent | null = null;

function getAgent(): DreamNetAgent {
  if (!agentInstance) {
    const apiKey = process.env.DREAMNET_API_KEY;
    if (!apiKey) {
      throw new Error(
        "DREAMNET_API_KEY environment variable is required. " +
        "Set it in your .env file or environment."
      );
    }
    agentInstance = new DreamNetAgent({
      apiKey,
      baseUrl: process.env.DREAMNET_API_URL || "https://api.dreamnet.ink",
    });
  }
  return agentInstance;
}

/**
 * DreamNet System Status
 * Get high-level system status (infra, agents, health)
 * 
 * @returns Promise with system status response
 * 
 * @example
 * ```typescript
 * const status = await dnStatus();
 * console.log(status);
 * ```
 */
export async function dnStatus(): Promise<string> {
  try {
    const agent = getAgent();
    const response = await agent.autonomousQuery("Show me DreamNet system status");
    return typeof response === "string" ? response : JSON.stringify(response, null, 2);
  } catch (error: any) {
    throw new Error(`DreamNet Status Error: ${error.message}`);
  }
}

/**
 * DreamNet Economic Brain
 * Query economic/token/liquidity questions
 * 
 * @param query - Economic question (e.g., "What's the current DREAM/SHEEP liquidity?")
 * @returns Promise with economic analysis response
 * 
 * @example
 * ```typescript
 * const analysis = await dnEconomy("Show me DREAM token liquidity across all pairs");
 * ```
 */
export async function dnEconomy(query: string): Promise<string> {
  if (!query || query.trim().length === 0) {
    throw new Error("Economic query cannot be empty");
  }

  try {
    const agent = getAgent();
    const prompt = `DreamNet Economic Brain: ${query}. Respond with concise JSON + short explanation.`;
    const response = await agent.autonomousQuery(prompt);
    return typeof response === "string" ? response : JSON.stringify(response, null, 2);
  } catch (error: any) {
    throw new Error(`DreamNet Economy Error: ${error.message}`);
  }
}

/**
 * DreamNet DevOps / DeployKeeper
 * Query deployment and infrastructure questions
 * 
 * @param query - DevOps question (e.g., "What's the deployment status?")
 * @returns Promise with DevOps recommendations
 * 
 * @example
 * ```typescript
 * const summary = await dnDevOps("Get deployment summary for DreamNet");
 * ```
 */
export async function dnDevOps(query: string): Promise<string> {
  if (!query || query.trim().length === 0) {
    throw new Error("DevOps query cannot be empty");
  }

  try {
    const agent = getAgent();
    const prompt = `DeployKeeper / DevOps: ${query}. Include affected services and recommended steps.`;
    const response = await agent.autonomousQuery(prompt);
    return typeof response === "string" ? response : JSON.stringify(response, null, 2);
  } catch (error: any) {
    throw new Error(`DreamNet DevOps Error: ${error.message}`);
  }
}

/**
 * DreamNet Wallet Intelligence (CoinSensei)
 * Query wallet and portfolio analytics
 * 
 * SECURITY: READ_ONLY mode - never accepts private keys, seeds, or mnemonics
 * 
 * @param query - Wallet intelligence question (e.g., "Analyze wallet 0x...")
 * @returns Promise with wallet analytics response
 * 
 * @example
 * ```typescript
 * const intel = await dnWalletIntel("Analyze portfolio for wallet 0x123...");
 * ```
 */
export async function dnWalletIntel(query: string): Promise<string> {
  if (!query || query.trim().length === 0) {
    throw new Error("Wallet intelligence query cannot be empty");
  }

  try {
    const agent = getAgent();
    const prompt = `CoinSensei: ${query}. Respect READ_ONLY rules, no keys or seeds.`;
    const response = await agent.autonomousQuery(prompt);
    return typeof response === "string" ? response : JSON.stringify(response, null, 2);
  } catch (error: any) {
    throw new Error(`DreamNet Wallet Intel Error: ${error.message}`);
  }
}

/**
 * Reset agent instance (useful for testing or re-initialization)
 */
export function resetAgent(): void {
  agentInstance = null;
}

// Export types
export type { DreamNetAgent } from "@dreamnet/dreamnet-agent-client";

