const themes = new Map();
const ideas = new Map();
const plans = new Map();
const engagements = [];
const insights = [];
const storeInstanceId = Math.random().toString(36).substring(7);
console.log(`[OrcaStore] 🐳 Module Initialized. Instance ID: ${storeInstanceId}`);
let lastRunAt = null;
export const OrcaStore = {
    upsertTheme(theme) {
        themes.set(theme.id, theme);
        return theme;
    },
    listThemes() {
        return Array.from(themes.values());
    },
    upsertIdea(idea) {
        ideas.set(idea.id, idea);
        return idea;
    },
    listIdeas() {
        return Array.from(ideas.values());
    },
    upsertPlan(plan) {
        plans.set(plan.id, plan);
        return plan;
    },
    listPlans() {
        return Array.from(plans.values());
    },
    addEngagement(e) {
        engagements.push(e);
    },
    listEngagementsForPlan(planId) {
        return engagements.filter((x) => x.planId === planId);
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
        const sampleThemes = Array.from(themes.values()).slice(0, 10);
        const sampleIdeas = Array.from(ideas.values()).slice(0, 20);
        const allPlans = Array.from(plans.values());
        const samplePlans = allPlans.slice(0, 20);
        const postedCount = allPlans.filter((p) => p.status === "posted").length;
        const sampleInsights = insights.slice(0, 20);
        return {
            lastRunAt,
            themeCount: themes.size,
            ideaCount: ideas.size,
            planCount: allPlans.length,
            postedCount,
            insightCount: insights.length,
            sampleThemes,
            sampleIdeas,
            samplePlans,
            sampleInsights,
        };
    },
};
//# sourceMappingURL=orcaStore.js.map