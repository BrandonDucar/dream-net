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
export declare function dnStatus(): Promise<string>;
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
export declare function dnEconomy(query: string): Promise<string>;
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
export declare function dnDevOps(query: string): Promise<string>;
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
export declare function dnWalletIntel(query: string): Promise<string>;
/**
 * DreamNet OPS Contract Summary
 * Get OPS_CONTRACT summary via ops-sentinel
 *
 * @returns Promise with OPS contract summary
 *
 * @example
 * ```typescript
 * const contract = await dnOpsContract();
 * console.log(contract);
 * ```
 */
export declare function dnOpsContract(): Promise<string>;
/**
 * DreamNet OPS Validation
 * Validate repo setup against OPS_CONTRACT
 *
 * @returns Promise with validation results
 *
 * @example
 * ```typescript
 * const validation = await dnOpsValidate();
 * console.log(validation);
 * ```
 */
export declare function dnOpsValidate(): Promise<string>;
/**
 * Reset agent instance (useful for testing or re-initialization)
 */
export declare function resetAgent(): void;
export type { DreamNetAgent } from "@dreamnet/dreamnet-agent-client";
//# sourceMappingURL=core.d.ts.map