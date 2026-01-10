import { getPheromoneStrength, getTopPaths, buildPath } from "@dreamnet/halo-loop/stores/pheromoneStore";
import type { TaskModel, AgentModel } from "./types";

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
    const path = buildPath({
      agent: agent.id,
      time: getTimeOfDay(),
      provider: inferProvider(agent),
    });

    const strength = getPheromoneStrength(path);

    return {
      agent,
      path,
      strength,
      baseMatch: agent.id === baseAgent.id,
    };
  });

  // Sort by strength (highest first), but boost base match
  candidates.sort((a, b) => {
    // Base router match gets +0.2 boost
    const aScore = a.strength + (a.baseMatch ? 0.2 : 0);
    const bScore = b.strength + (b.baseMatch ? 0.2 : 0);
    return bScore - aScore;
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
  const relevant = allPaths.filter((p) => {
    // Match task type in path (e.g., "deploy" task matches "provider:vercel")
    return p.path.includes(taskType) || true; // Simplified
  });

  return relevant.slice(0, limit).map((p) => ({
    path: p.path,
    strength: p.strength,
  }));
}

