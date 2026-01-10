import { OrcaPackContext, OrcaPostPlan, OrcaChannel } from '../types.js';
import { OrcaStore } from '../store/orcaStore.js';

export interface OrcaOutputAdapter {
  post(channel: OrcaChannel, content: string, meta?: any): Promise<string | undefined>;
}

let _adapter: OrcaOutputAdapter | null = null;

export function setOrcaOutputAdapter(adapter: OrcaOutputAdapter) {
  _adapter = adapter;
  console.log("[OrcaPosterCore] Output Adapter Linked.");
}

export async function simulateOrcaPosting(ctx: OrcaPackContext): Promise<void> {
  const plans = OrcaStore.listPlans();
  const now = Date.now();

  for (const plan of plans) {
    if (plan.status === "draft" || plan.status === "scheduled") {
      let postId: string | undefined;

      if (_adapter) {
        console.log(`[OrcaPosterCore] 🚀 TRANSMITTING to ${plan.channel.toUpperCase()}: "${plan.renderedTitle || plan.renderedBody.substring(0, 20)}..."`);
        try {
          // Use specific body or title depending on platform
          const content = plan.renderedBody;
          postId = await _adapter.post(plan.channel, content, plan.renderedMeta);
        } catch (e: any) {
          console.error(`[OrcaPosterCore] ❌ Transmission Failed: ${e.message}`);
          // Mark as failed? For now we just don't mark as posted
          continue;
        }
      } else {
        // Simulation / Dry Run
        console.log("[OrcaPosterCore] 💤 Simulated post:", {
          planId: plan.id,
          channel: plan.channel,
          title: plan.renderedTitle,
        });
        postId = `sim-${Date.now()}`;
      }

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
          title: _adapter ? "Orca Pack LIVE TRANSMISSION" : "Orca Pack simulated post",
          summary: `Posted idea ${plan.ideaId} to ${plan.channel}.`,
          severity: "info",
          domain: "social",
          tags: ["orca", "social", "post"],
          references: [],
          meta: { planId: plan.id, postId },
        });
      }
    }
  }
}


