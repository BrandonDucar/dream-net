import { getPheromoneStrength, getPheromoneTrail, getTopPaths, buildPath } from "@dreamnet/halo-loop";
import type { TaskModel, AgentModel } from './types.js';

/**
 * Route task to agent using pheromone trails
 * Biases selection toward paths with higher success rates
 */
export function routeWithPheromones(
  task: TaskModel,
  availableAgents: AgentModel[],
  baseRouter: (task: TaskModel, agents: AgentModel[]) => AgentModel | null
): AgentModel | null {
  // First, try base router
  const baseAgent = baseRouter(task, availableAgents);
  if (!baseAgent) {
    return null;
  }

  // Build candidate paths
  const candidates = availableAgents.map((agent) => {
    const context = {
      agent: agent.id,
      time: getTimeOfDay(),
      provider: inferProvider(agent),
    };
    const path = buildPath(context);
    const trail = getPheromoneTrail(path); // Need to add this helper or use getPheromoneStrength

    // Factor 1: Success Strength (0.0 to 1.0)
    const strength = trail?.strength || 0;

    // Qualitative Factors (Stigmergy Hijack)
    const honey = trail?.types?.HONEY || 0;
    const slime = trail?.types?.SLIME || 0;
    const heat = trail?.types?.HEAT || 0;

    // Factor 2: Reward Density (Normalized)
    const rewardDensity = Math.min(1.0, (trail?.rewardDensity || 0) / 100);

    // Factor 3: Latency Heat (Lower is better, Penalty if > 500ms)
    const latencyPenalty = Math.max(heat, trail?.avgLatency ? Math.min(0.5, trail.avgLatency / 2000) : 0);

    // Factor 4: Congestion Tax (Penalty for current load)
    const congestionTax = (trail?.currentLoad || 0) * 0.1;

    // Factor 5: Freshness (Bonus for recently updated)
    const pulse = trail?.types?.PULSE || 0;

    // The Hive Mind Equation: Avoid the Slime, Chase the Honey
    const swarmScore =
      (strength * 0.2) +
      (honey * 0.4) -
      (slime * 0.8) - // High penalty for error residue (Slime)
      (latencyPenalty * 0.1) -
      (congestionTax * 0.1) +
      (pulse * 0.1);

    return {
      agent,
      path,
      swarmScore,
      baseMatch: agent.id === baseAgent.id,
    };
  });

  // Sort by swarm score (highest first)
  candidates.sort((a, b) => {
    // Base router match gets +0.1 boost to swarm score
    const aFinal = a.swarmScore + (a.baseMatch ? 0.1 : 0);
    const bFinal = b.swarmScore + (b.baseMatch ? 0.1 : 0);
    return bFinal - aFinal;
  });

  // Return top candidate
  return candidates[0]?.agent || baseAgent;
}

/**
 * Get time of day category
 */
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

/**
 * Infer provider from agent context
 */
function inferProvider(agent: AgentModel): string {
  // In production, this would check agent metadata
  // For now, return a default
  return "dreamnet";
}

/**
 * Get recommended paths for a task type
 */
export function getRecommendedPaths(taskType: string, limit: number = 5): Array<{ path: string; strength: number }> {
  // Filter paths relevant to task type
  const allPaths = getTopPaths(50);
  const relevant = allPaths.filter((p: any) => {
    // Match task type in path (e.g., "deploy" task matches "provider:vercel")
    return p.path.includes(taskType) || true; // Simplified
  });

  return relevant.slice(0, limit).map((p: any) => ({
    path: p.path,
    strength: p.strength,
  }));
}

