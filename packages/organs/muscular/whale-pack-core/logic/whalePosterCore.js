import { WhaleStore } from '../store/whaleStore.js';
export async function simulateWhalePosting(ctx) {
    const plans = WhaleStore.listPlans();
    const now = Date.now();
    for (const plan of plans) {
        if (plan.status === "planned" || plan.status === "ready") {
            console.log("[WhalePosterCore] Simulated TikTok post:", {
                planId: plan.id,
                productId: plan.productId,
                audienceId: plan.audienceId,
                hookLine: plan.hookLine,
            });
            const updated = {
                ...plan,
                status: "posted",
                postedAt: now,
                updatedAt: now,
            };
            WhaleStore.upsertPlan(updated);
            // Optionally log to NarrativeField if provided
            ctx.narrativeField?.add?.({
                id: `narrative-whale-post-${plan.id}-${now}`,
                timestamp: now,
                title: "Whale posted TikTok plan",
                summary: `Simulated post for product ${plan.productId} to ${plan.audienceId}.`,
                severity: "info",
                domain: "social",
                tags: ["whale", "tiktok", "commerce"],
                references: [],
                meta: { planId: plan.id },
            });
        }
    }
}
//# sourceMappingURL=whalePosterCore.js.map