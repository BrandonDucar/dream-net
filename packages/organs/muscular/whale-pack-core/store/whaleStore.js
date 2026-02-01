const products = new Map();
const audiences = new Map();
const plans = new Map();
const engagements = [];
const insights = [];
let lastRunAt = null;
export const WhaleStore = {
    upsertProduct(product) {
        products.set(product.id, product);
        return product;
    },
    listProducts() {
        return Array.from(products.values());
    },
    upsertAudience(aud) {
        audiences.set(aud.id, aud);
        return aud;
    },
    listAudiences() {
        return Array.from(audiences.values());
    },
    upsertPlan(plan) {
        plans.set(plan.id, plan);
        return plan;
    },
    listPlans() {
        return Array.from(plans.values());
    },
    addEngagement(stats) {
        engagements.push(stats);
    },
    listEngagementsForPlan(planId) {
        return engagements.filter((e) => e.planId === planId);
    },
    addInsight(insight) {
        insights.push(insight);
        return insight;
    },
    listInsights() {
        return insights;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const sampleProducts = Array.from(products.values()).slice(0, 10);
        const sampleAudiences = Array.from(audiences.values()).slice(0, 10);
        const allPlans = Array.from(plans.values());
        const samplePlans = allPlans.slice(0, 20);
        const postedCount = allPlans.filter((p) => p.status === "posted").length;
        const sampleInsights = insights.slice(0, 20);
        return {
            lastRunAt,
            productCount: products.size,
            audienceCount: audiences.size,
            planCount: allPlans.length,
            postedCount,
            insightCount: insights.length,
            sampleProducts,
            sampleAudiences,
            samplePlans,
            sampleInsights,
        };
    },
};
//# sourceMappingURL=whaleStore.js.map