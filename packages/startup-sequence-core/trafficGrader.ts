/**
 * Traffic Grader
 * 
 * Gradual traffic opening (1% → 10% → 50% → 100%)
 * Canary deployment support
 * Rollback on health degradation
 */

import type { ServiceNode, TrafficPhase } from './types';

const phaseStartTimes: Map<string, number> = new Map();

/**
 * Get current traffic percentage for a service
 */
export async function getTrafficPercentage(
  service: ServiceNode,
  healthScore: number
): Promise<number> {
  if (!service.trafficGrader) {
    return 100; // Full traffic if no grader configured
  }
  
  const grader = service.trafficGrader;
  const phases = grader.phases;
  const currentPhase = grader.currentPhase;
  
  if (currentPhase >= phases.length) {
    return 100; // All phases complete
  }
  
  const phaseConfig = phases[currentPhase];
  if (!phaseConfig) {
    return 100;
  }
  
  // Check health threshold
  if (healthScore < phaseConfig.healthThreshold) {
    // Rollback to previous phase
    const previousPhase = Math.max(0, currentPhase - 1);
    grader.currentPhase = previousPhase;
    phaseStartTimes.set(service.id, Date.now());
    return phases[previousPhase]?.percentage ?? 0;
  }
  
  // Check if duration met
  const phaseStartTime = phaseStartTimes.get(service.id) ?? Date.now();
  if (!phaseStartTimes.has(service.id)) {
    phaseStartTimes.set(service.id, phaseStartTime);
  }
  
  const elapsed = Date.now() - phaseStartTime;
  if (elapsed >= phaseConfig.duration) {
    // Advance to next phase
    const nextPhase = Math.min(phases.length - 1, currentPhase + 1);
    grader.currentPhase = nextPhase;
    phaseStartTimes.set(service.id, Date.now());
    return phases[nextPhase]?.percentage ?? 100;
  }
  
  return phaseConfig.percentage;
}

/**
 * Reset traffic grader (for testing/rollback)
 */
export function resetTrafficGrader(serviceId: string): void {
  phaseStartTimes.delete(serviceId);
}

/**
 * Get default traffic phases
 */
export function getDefaultTrafficPhases(): TrafficPhase[] {
  return [
    {
      percentage: 1,
      duration: 5 * 60 * 1000, // 5 minutes
      healthThreshold: 80,
    },
    {
      percentage: 10,
      duration: 5 * 60 * 1000, // 5 minutes
      healthThreshold: 85,
    },
    {
      percentage: 50,
      duration: 10 * 60 * 1000, // 10 minutes
      healthThreshold: 90,
    },
    {
      percentage: 100,
      duration: 0, // No duration limit
      healthThreshold: 95,
    },
  ];
}

