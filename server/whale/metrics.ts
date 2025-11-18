/**
 * Whale Pack Metrics Aggregator
 * Collects metrics from all mini-apps
 */

import { MiniAppMetric, MiniAppId } from './types';
import { getDb } from '../db';

/**
 * Get metrics for a specific mini-app
 */
export async function getMiniAppMetrics(appId: MiniAppId): Promise<MiniAppMetric> {
  const now = Date.now();
  
  switch (appId) {
    case 'passport':
      return await getPassportMetrics(now);
    case 'governance':
      return await getGovernanceMetrics(now);
    case 'vault':
      return await getVaultMetrics(now);
    case 'bounty':
      return await getBountyMetrics(now);
    case 'timeCapsule':
      return await getTimeCapsuleMetrics(now);
    case 'prediction':
      return await getPredictionMetrics(now);
    case 'dreamscopeOps':
      return await getDreamscopeOpsMetrics(now);
    case 'onboarding':
      return await getOnboardingMetrics(now);
    case 'creatorStudio':
      return await getCreatorStudioMetrics(now);
    default:
      throw new Error(`Unknown app ID: ${appId}`);
  }
}

/**
 * Get all metrics
 */
export async function getAllMetrics(): Promise<MiniAppMetric[]> {
  const appIds: MiniAppId[] = [
    'passport',
    'governance',
    'vault',
    'bounty',
    'timeCapsule',
    'prediction',
    'dreamscopeOps',
    'onboarding',
    'creatorStudio',
  ];

  const metrics = await Promise.all(
    appIds.map(id => getMiniAppMetrics(id).catch(err => {
      console.error(`Failed to get metrics for ${id}:`, err);
      return createErrorMetric(id, err.message);
    }))
  );

  return metrics;
}

function createErrorMetric(id: MiniAppId, error: string): MiniAppMetric {
  return {
    id,
    label: id,
    category: 'utility',
    stats: { error: 1 },
    health: 'unhealthy',
    updatedAt: Date.now(),
  };
}

async function getPassportMetrics(now: number): Promise<MiniAppMetric> {
  // Placeholder - would query contract or DB
  // For now, return simple counts
  const db = getDb();
  let totalMinted = 0;
  let recentMints = 0;

  try {
    // Would query contract events or DB
    // For now, use placeholder
    totalMinted = 0; // Placeholder
    recentMints = 0; // Placeholder
  } catch (err) {
    console.error('Error getting passport metrics:', err);
  }

  return {
    id: 'passport',
    label: 'Dream Passport Mint',
    category: 'identity',
    stats: {
      totalMinted,
      recentMints24h: recentMints,
      activeHolders: totalMinted, // Placeholder
    },
    health: totalMinted > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

async function getGovernanceMetrics(now: number): Promise<MiniAppMetric> {
  // Placeholder - would query governance contract
  let activeProposals = 0;
  let totalProposals = 0;
  let totalVotes = 0;

  try {
    // Would query contract
    activeProposals = 0; // Placeholder
    totalProposals = 0; // Placeholder
    totalVotes = 0; // Placeholder
  } catch (err) {
    console.error('Error getting governance metrics:', err);
  }

  return {
    id: 'governance',
    label: 'Dream State Governance',
    category: 'governance',
    stats: {
      activeProposals,
      totalProposals,
      totalVotes,
      participationRate: totalVotes > 0 ? (totalVotes / totalProposals) : 0,
    },
    health: activeProposals > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

async function getVaultMetrics(now: number): Promise<MiniAppMetric> {
  let totalVaults = 0;
  let activeVaults = 0;

  try {
    // Would query contract
    totalVaults = 0; // Placeholder
    activeVaults = 0; // Placeholder
  } catch (err) {
    console.error('Error getting vault metrics:', err);
  }

  return {
    id: 'vault',
    label: 'Dream Vault',
    category: 'utility',
    stats: {
      totalVaults,
      activeVaults,
      totalRevenue: 0, // Placeholder
    },
    health: totalVaults > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

async function getBountyMetrics(now: number): Promise<MiniAppMetric> {
  let activeBounties = 0;
  let totalBounties = 0;
  let totalValue = 0;

  try {
    // Would query contract
    activeBounties = 0; // Placeholder
    totalBounties = 0; // Placeholder
    totalValue = 0; // Placeholder
  } catch (err) {
    console.error('Error getting bounty metrics:', err);
  }

  return {
    id: 'bounty',
    label: 'Bounty Board',
    category: 'utility',
    stats: {
      activeBounties,
      totalBounties,
      totalValueETH: totalValue,
      avgBountyValue: totalBounties > 0 ? totalValue / totalBounties : 0,
    },
    health: activeBounties > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

async function getTimeCapsuleMetrics(now: number): Promise<MiniAppMetric> {
  let totalCapsules = 0;
  let unlockedCapsules = 0;
  let lockedCapsules = 0;

  try {
    // Would query contract
    totalCapsules = 0; // Placeholder
    unlockedCapsules = 0; // Placeholder
    lockedCapsules = 0; // Placeholder
  } catch (err) {
    console.error('Error getting time capsule metrics:', err);
  }

  return {
    id: 'timeCapsule',
    label: 'Dream Time Capsule',
    category: 'creative',
    stats: {
      totalCapsules,
      unlockedCapsules,
      lockedCapsules,
      unlockRate: totalCapsules > 0 ? unlockedCapsules / totalCapsules : 0,
    },
    health: totalCapsules > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

async function getPredictionMetrics(now: number): Promise<MiniAppMetric> {
  let activeMarkets = 0;
  let totalMarkets = 0;
  let totalStaked = 0;

  try {
    // Would query contract
    activeMarkets = 0; // Placeholder
    totalMarkets = 0; // Placeholder
    totalStaked = 0; // Placeholder
  } catch (err) {
    console.error('Error getting prediction metrics:', err);
  }

  return {
    id: 'prediction',
    label: 'Dream Prediction Market',
    category: 'utility',
    stats: {
      activeMarkets,
      totalMarkets,
      totalStakedETH: totalStaked,
      avgMarketSize: activeMarkets > 0 ? totalStaked / activeMarkets : 0,
    },
    health: activeMarkets > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

async function getDreamscopeOpsMetrics(now: number): Promise<MiniAppMetric> {
  // Get system health from /api/system/graph and other endpoints
  let apiErrorRate = 0;
  let avgLatency = 0;
  let txSuccessRate = 1.0;

  try {
    // Would query system metrics
    // For now, use placeholders
    apiErrorRate = 0; // Placeholder
    avgLatency = 0; // Placeholder
    txSuccessRate = 1.0; // Placeholder
  } catch (err) {
    console.error('Error getting ops metrics:', err);
  }

  return {
    id: 'dreamscopeOps',
    label: 'DreamScope Ops Console',
    category: 'ops',
    stats: {
      apiErrorRate,
      avgLatencyMs: avgLatency,
      txSuccessRate,
      systemHealth: 1.0, // Placeholder
    },
    health: apiErrorRate < 0.05 ? 'healthy' : apiErrorRate < 0.1 ? 'degraded' : 'unhealthy',
    updatedAt: now,
  };
}

async function getOnboardingMetrics(now: number): Promise<MiniAppMetric> {
  const db = getDb();
  let totalStarted = 0;
  let totalCompleted = 0;
  let completionRate = 0;

  try {
    // Would query onboarding DB
    // For now, use placeholders
    totalStarted = 0; // Placeholder
    totalCompleted = 0; // Placeholder
    completionRate = totalStarted > 0 ? totalCompleted / totalStarted : 0;
  } catch (err) {
    console.error('Error getting onboarding metrics:', err);
  }

  return {
    id: 'onboarding',
    label: 'Onboarding Wizard',
    category: 'onboarding',
    stats: {
      totalStarted,
      totalCompleted,
      completionRate,
      activeUsers: totalStarted - totalCompleted,
    },
    health: completionRate > 0.5 ? 'healthy' : completionRate > 0.2 ? 'degraded' : 'unhealthy',
    updatedAt: now,
  };
}

async function getCreatorStudioMetrics(now: number): Promise<MiniAppMetric> {
  const db = getDb();
  let totalDreams = 0;
  let recentDreams = 0;
  let activeCreators = 0;

  try {
    // Would query dreams DB
    // For now, use placeholders
    totalDreams = 0; // Placeholder
    recentDreams = 0; // Placeholder
    activeCreators = 0; // Placeholder
  } catch (err) {
    console.error('Error getting creator studio metrics:', err);
  }

  return {
    id: 'creatorStudio',
    label: 'Creator Studio',
    category: 'creative',
    stats: {
      totalDreams,
      recentDreams24h: recentDreams,
      activeCreators,
      avgDreamsPerCreator: activeCreators > 0 ? totalDreams / activeCreators : 0,
    },
    health: totalDreams > 0 ? 'healthy' : 'degraded',
    updatedAt: now,
  };
}

