import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import type { AnalyzerResult, Issue, Recommendation } from "../types";

type AgentEntry = {
  id: string;
  name: string;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
};

function loadAgentRegistry(): AgentEntry[] {
  const require = createRequire(import.meta.url);
  try {
    // Dynamically import to avoid hard dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const registry = require("@dreamnet/agents/registry");
    if (Array.isArray(registry.agents)) {
      return registry.agents as AgentEntry[];
    }
  } catch {
    // fall through
  }

  // Minimal fallback registry
  return [
    { id: "dreamops", name: "DreamOps", role: "DreamOps" },
    { id: "deploykeeper", name: "DeployKeeper", role: "DeployKeeper" },
    { id: "envkeeper", name: "EnvKeeper", role: "EnvKeeper" },
  ];
}

export async function agentHealthAnalyzer(): Promise<AnalyzerResult> {
  const agents = loadAgentRegistry();
  const issues: Issue[] = [];
  const recommendations: Recommendation[] = [];

  const now = Date.now();

  agents.forEach((agent) => {
    const lastSeen = agent.lastSeen ? new Date(agent.lastSeen).getTime() : now - 60_000;
    const offlineThreshold = 5 * 60_000; // 5 minutes
    const isOnline = agent.isOnline ?? true;

    if (!isOnline || now - lastSeen > offlineThreshold) {
      issues.push({
        id: `agent-offline-${agent.id}`,
        analyzer: "agentHealth",
        severity: "high",
        description: `${agent.name} appears offline or unresponsive`,
        data: {
          agentId: agent.id,
          lastSeen: agent.lastSeen ?? "unknown",
        },
      });

      recommendations.push({
        action: "agent.revive",
        description: `Revive agent ${agent.name}`,
        target: agent.id,
        meta: { agentId: agent.id },
      });
    }
  });

  if (!issues.length) {
    recommendations.push({
      action: "observe",
      description: "All agents responding within threshold",
    });
  }

  return {
    name: "agentHealthAnalyzer",
    issues: issues.length
      ? issues
      : [
          {
            id: randomUUID(),
            analyzer: "agentHealth",
            severity: "low",
            description: "All agents healthy",
          },
        ],
    recommendations,
  };
}


