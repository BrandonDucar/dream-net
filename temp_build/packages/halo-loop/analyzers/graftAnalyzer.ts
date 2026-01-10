import { getGrafts } from "@dreamnet/graft-engine";
import type { AnalyzerResult, Issue, Recommendation } from "../types";

export async function graftAnalyzer(): Promise<AnalyzerResult> {
  const grafts = await getGrafts();
  const issues: Issue[] = [];
  const recommendations: Recommendation[] = [];

  grafts.forEach((graft) => {
    if (graft.status === "failed") {
      issues.push({
        id: `graft-failed-${graft.id}`,
        analyzer: "graft",
        severity: "high",
        description: `Graft ${graft.name} failed: ${graft.error ?? "unknown error"}`,
        data: { graftId: graft.id, status: graft.status },
      });
      recommendations.push({
        action: "graft.repair",
        description: `Retry graft ${graft.name}`,
        target: graft.id,
      });
    } else if (graft.status === "pending") {
      issues.push({
        id: `graft-pending-${graft.id}`,
        analyzer: "graft",
        severity: "medium",
        description: `Graft ${graft.name} is pending installation`,
        data: { graftId: graft.id, status: graft.status },
      });
      recommendations.push({
        action: "graft.install",
        description: `Schedule installation for ${graft.name}`,
        target: graft.id,
      });
    }
  });

  return {
    name: "graftAnalyzer",
    issues,
    recommendations,
  };
}


