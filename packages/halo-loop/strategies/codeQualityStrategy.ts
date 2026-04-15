import type { Issue, SquadTask } from "../types";

export function codeQualityStrategy(issue: Issue): SquadTask | null {
  if (issue.analyzer !== "repoIntegrity") return null;

  if (issue.id === "repo-typecheck-failed" || issue.id === "repo-lint-failed") {
    return {
      type: issue.id === "repo-typecheck-failed" ? "build.fix-imports" : "build.relint",
      payload: {
        description: issue.description,
        output: issue.data?.output,
      },
      priority: "medium",
      targetAgents: ["buildkeeper"],
    };
  }

  return null;
}


