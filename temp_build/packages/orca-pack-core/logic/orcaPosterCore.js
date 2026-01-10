"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateOrcaPosting = simulateOrcaPosting;
const orcaStore_1 = require("../store/orcaStore");
async function simulateOrcaPosting(ctx) {
    const plans = orcaStore_1.OrcaStore.listPlans();
    const now = Date.now();
    for (const plan of plans) {
        if (plan.status === "draft" || plan.status === "scheduled") {
            console.log("[OrcaPosterCore] Simulated post:", {
                planId: plan.id,
                channel: plan.channel,
                ideaId: plan.ideaId,
                title: plan.renderedTitle,
            });
            const updated = {
                ...plan,
                status: "posted",
                postedAt: now,
                updatedAt: now,
            };
            orcaStore_1.OrcaStore.upsertPlan(updated);
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
