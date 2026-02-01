import { OrcaStore } from '../store/orcaStore.js';
let insightCounter = 0;
function nextInsightId() {
    insightCounter += 1;
    return `orca:insight:${Date.now()}:${insightCounter}`;
}
export function runOrcaAnalysis(ctx) {
    const plans = OrcaStore.listPlans();
    const insights = [];
    const postedByChannel = {};
    for (const p of plans) {
        if (p.status !== "posted")
            continue;
        postedByChannel[p.channel] = (postedByChannel[p.channel] ?? 0) + 1;
    }
    for (const [channel, count] of Object.entries(postedByChannel)) {
        const insight = {
            id: nextInsightId(),
            type: "pattern",
            title: `Channel ${channel} is active`,
            description: `You have ${count} simulated posts on ${channel}. Consider focusing on this channel for real tests.`,
            createdAt: Date.now(),
            meta: { channel, postedCount: count },
        };
        OrcaStore.addInsight(insight);
        insights.push(insight);
    }
    if (ctx.neuralMesh?.remember && insights.length > 0) {
        ctx.neuralMesh.remember({
            source: "OrcaAnalystCore",
            insightsCount: insights.length,
            timestamp: Date.now(),
        });
    }
    return insights;
}
//# sourceMappingURL=orcaAnalystCore.js.map