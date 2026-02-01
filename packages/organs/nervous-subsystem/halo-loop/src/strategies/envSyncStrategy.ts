import type { Issue, SquadTask } from "../types";

export function envSyncStrategy(issue: Issue): SquadTask | null {
  if (issue.analyzer !== "envConsistency") return null;

  const target = issue.data?.missing || issue.data?.mismatched ? issue.data : null;
  if (!target) return null;

  return {
    type: "env.sync",
    payload: {
      differences: target,
      description: issue.description,
    },
    priority: (issue.severity === "critical" || issue.severity === "error") ? "high" : "normal",
    targetAgents: ["envkeeper"],
  };
}


