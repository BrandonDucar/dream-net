import { ShieldLayer, Threat, ThreatLevel } from "../types";
export type Blockchain = "ethereum" | "base" | "optimism" | "polygon" | "arbitrum" | "solana" | "other";
export interface CrossChainShield {
    blockchain: Blockchain;
    shieldLayer: ShieldLayer;
    chainId: string;
    active: boolean;
    lastSync: number;
    threatCount: number;
    blockedCount: number;
}
/**
 * Initialize cross-chain shield for a blockchain
 */
export declare function initializeCrossChainShield(blockchain: Blockchain, chainId: string): CrossChainShield;
/**
 * Detect cross-chain threat
 */
export declare function detectCrossChainThreat(blockchain: Blockchain, threatType: Threat["type"], level: ThreatLevel, source?: string): Threat | null;
/**
 * Sync shields across chains
 */
export declare function syncCrossChainShields(): void;
/**
 * List all cross-chain shields
 */
export declare function listCrossChainShields(): CrossChainShield[];
/**
 * Get cross-chain shield stats
 */
export declare function getCrossChainShieldStats(): {
    totalChains: number;
    activeChains: number;
    avgIntegrity: number;
    totalThreats: number;
    totalBlocked: number;
};
