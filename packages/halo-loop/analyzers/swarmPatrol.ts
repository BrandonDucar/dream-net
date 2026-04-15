import type { AnalyzerResult, Issue } from "../types";
import { dnsChecker } from "./microAgents/dnsChecker";
import { healthChecker } from "./microAgents/healthChecker";
import { envDriftChecker } from "./microAgents/envDriftChecker";
import { quotaChecker } from "./microAgents/quotaChecker";
import { buildChecker } from "./microAgents/buildChecker";
import { dependencyChecker } from "./microAgents/dependencyChecker";

export interface MicroAgentResult {
  agentId: string;
  checkName: string;
  status: "green" | "amber" | "red";
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Swarm Repair Patrol: Orchestrates 100+ micro-agents
 * Each agent does one simple check, collectively forming system health picture
 */
export async function swarmPatrolAnalyzer(): Promise<AnalyzerResult> {
  const microAgents = [
    dnsChecker,
    healthChecker,
    envDriftChecker,
    quotaChecker,
    buildChecker,
    dependencyChecker,
    // Add more micro-agents here as needed
  ];

  const results: MicroAgentResult[] = [];
  const issues: Issue[] = [];

  // Run all micro-agents in parallel (swarm behavior)
  const agentResults = await Promise.allSettled(
    microAgents.map(async (agent) => {
      try {
        return await agent.check();
      } catch (error: any) {
        return {
          agentId: agent.id,
          checkName: agent.name,
          status: "red" as const,
          message: `Agent failed: ${error.message}`,
        };
      }
    })
  );

  // Aggregate results
  for (const result of agentResults) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    } else {
      results.push({
        agentId: "unknown",
        checkName: "unknown",
        status: "red",
        message: `Agent execution failed: ${result.reason}`,
      });
    }
  }

  // Convert amber/red statuses to issues
  for (const result of results) {
    if (result.status === "amber" || result.status === "red") {
      issues.push({
        analyzer: "swarmPatrol",
        id: result.agentId,
        severity: result.status === "red" ? "critical" : "warning",
        description: `${result.checkName}: ${result.message}`,
        metadata: result.metadata,
      });
    }
  }

  // Calculate swarm health score
  const greenCount = results.filter((r) => r.status === "green").length;
  const amberCount = results.filter((r) => r.status === "amber").length;
  const redCount = results.filter((r) => r.status === "red").length;
  const totalCount = results.length;

  const healthScore = totalCount > 0 ? (greenCount / totalCount) * 100 : 0;

  return {
    analyzer: "swarmPatrol",
    issues,
    summary: `Swarm Patrol: ${greenCount} green, ${amberCount} amber, ${redCount} red (${healthScore.toFixed(1)}% healthy)`,
    metadata: {
      totalAgents: totalCount,
      greenCount,
      amberCount,
      redCount,
      healthScore,
      results,
    },
  };
}

