import { OrcaPackContext, OrcaPostPlan } from "../types";
import { OrcaStore } from "../store/orcaStore";

export async function simulateOrcaPosting(ctx: OrcaPackContext): Promise<void> {
  const plans = OrcaStore.listPlans();
  const now = Date.now();

  for (const plan of plans) {
    if (plan.status === "draft" || plan.status === "scheduled") {
      console.log("[OrcaPosterCore] Simulated post:", {
        planId: plan.id,
        channel: plan.channel,
        ideaId: plan.ideaId,
        title: plan.renderedTitle,
      });

      const updated: OrcaPostPlan = {
        ...plan,
        status: "posted",
        postedAt: now,
        updatedAt: now,
      };

      OrcaStore.upsertPlan(updated);

      if (ctx.narrativeField?.add) {
        ctx.narrativeField.add({
          id: `narrative-orca-post-${plan.id}-${now}`,
          timestamp: now,
          title: "Orca Pack simulated post",
          summary: `Posted idea ${plan.ideaId} to ${plan.channel}.`,
          severity: "info",
          domain: "social",
          tags: ["orca", "social", "post"],
          references: [],
          meta: { planId: plan.id },
        });
      }
    }
  }
}


