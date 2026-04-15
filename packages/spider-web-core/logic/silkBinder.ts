import { SpiderWebContext, SpiderInsight } from "../types";
import { SpiderStore } from "../store/spiderStore";

let insightCounter = 0;
function nextInsightId() {
  insightCounter += 1;
  return `silk:insight:${Date.now()}:${insightCounter}`;
}

export function runSilkBinder(ctx: SpiderWebContext): SpiderInsight[] {
  const insights: SpiderInsight[] = [];

  // Future: inspect threads/payloads and require legal checks for certain operations.
  // For now: simple heuristic. If DreamState is present or Wolf has many leads,
  // generate a recommendation insight.

  if (ctx.dreamStateCore?.status) {
    const st = ctx.dreamStateCore.status();
    if (st?.passportCount && st.passportCount > 0) {
      const ins: SpiderInsight = {
        id: nextInsightId(),
        type: "recommendation",
        title: "Legal: consider formalizing Dream STATE terms",
        description: "Dream STATE has active passports; draft or refine terms of use, privacy, and DAO participation docs.",
        createdAt: Date.now(),
        meta: { passportCount: st.passportCount },
      };
      SpiderStore.addInsight(ins);
      insights.push(ins);
      console.log("[SilkBinder] Generated legal insight: formalize terms");
    }
  }

  if (ctx.wolfPackCore?.status) {
    const wolfStatus = ctx.wolfPackCore.status();
    if (wolfStatus.leadCount && wolfStatus.leadCount > 50) {
      const ins: SpiderInsight = {
        id: nextInsightId(),
        type: "warning",
        title: "Legal: large outbound funding pipeline",
        description: "Wolf Pack has many leads. Ensure outreach complies with relevant regulations and no unsolicited spam laws are violated.",
        createdAt: Date.now(),
        meta: { leadCount: wolfStatus.leadCount },
      };
      SpiderStore.addInsight(ins);
      insights.push(ins);
      console.log("[SilkBinder] Generated legal warning: large lead pipeline");
    }
  }

  // Future: Inspect threads for legal flags
  // - Flag threads that might require human review
  // - Check for compliance issues
  // - Generate legal recommendations

  return insights;
}

