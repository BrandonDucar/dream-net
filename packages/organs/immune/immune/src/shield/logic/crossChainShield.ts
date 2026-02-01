import { ShieldLayer, Threat, ThreatLevel, ThreatType } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';
import { detectThreat } from './threatDetector.js';

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

const crossChainShields: Map<Blockchain, CrossChainShield> = new Map();

/**
 * Initialize cross-chain shield for a blockchain
 */
export function initializeCrossChainShield(blockchain: Blockchain, chainId: string): CrossChainShield {
  const now = Date.now();
  
  // Create shield layer for this chain
  const phase = `omega-${blockchain}` as any; // Use omega phase for cross-chain
  let layer = ShieldStore.getLayer(phase as any);
  if (!layer) {
    layer = ShieldStore.createLayer(phase as any);
  }

  const crossChainShield: CrossChainShield = {
    blockchain,
    shieldLayer: layer,
    chainId,
    active: true,
    lastSync: now,
    threatCount: 0,
    blockedCount: 0,
  };

  crossChainShields.set(blockchain, crossChainShield);
  console.log(`[CrossChainShield] Initialized shield for ${blockchain} (chainId: ${chainId})`);
  return crossChainShield;
}

/**
 * Detect cross-chain threat
 */
export function detectCrossChainThreat(
  blockchain: Blockchain,
  threatType: Threat["type"],
  level: ThreatLevel,
  source?: string
): Threat | null {
  const shield = crossChainShields.get(blockchain);
  if (!shield || !shield.active) return null;

  // Create threat using threatDetector
  const threat = detectThreat(threatType, level, source, `cross-chain:${blockchain}`, {
    blockchain,
    chainId: shield.chainId,
  });

  shield.threatCount += 1;
  crossChainShields.set(blockchain, shield);

  return threat;
}

/**
 * Sync shields across chains
 */
export function syncCrossChainShields(): void {
  const now = Date.now();
  const allShields = Array.from(crossChainShields.values());

  // Sync integrity across chains (average)
  const avgIntegrity = allShields.length > 0
    ? allShields.reduce((sum, s) => sum + s.shieldLayer.integrity, 0) / allShields.length
    : 1.0;

  // Update all shields to match average
  for (const shield of allShields) {
    if (shield.active) {
      ShieldStore.updateLayer(shield.shieldLayer.phase, { integrity: avgIntegrity });
      shield.lastSync = now;
      crossChainShields.set(shield.blockchain, shield);
    }
  }

  console.log(`[CrossChainShield] Synced ${allShields.length} chain shields (avg integrity: ${(avgIntegrity * 100).toFixed(1)}%)`);
}

/**
 * List all cross-chain shields
 */
export function listCrossChainShields(): CrossChainShield[] {
  return Array.from(crossChainShields.values());
}

/**
 * Get cross-chain shield stats
 */
export function getCrossChainShieldStats(): {
  totalChains: number;
  activeChains: number;
  avgIntegrity: number;
  totalThreats: number;
  totalBlocked: number;
} {
  const allShields = Array.from(crossChainShields.values());
  const activeShields = allShields.filter((s) => s.active);
  const avgIntegrity = activeShields.length > 0
    ? activeShields.reduce((sum, s) => sum + s.shieldLayer.integrity, 0) / activeShields.length
    : 1.0;
  const totalThreats = allShields.reduce((sum, s) => sum + s.threatCount, 0);
  const totalBlocked = allShields.reduce((sum, s) => sum + s.blockedCount, 0);

  return {
    totalChains: allShields.length,
    activeChains: activeShields.length,
    avgIntegrity,
    totalThreats,
    totalBlocked,
  };
}

