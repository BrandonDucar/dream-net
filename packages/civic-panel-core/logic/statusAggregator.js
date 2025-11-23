import { CommandStore } from "../store/commandStore";
export function buildDashboardSnapshot(ctx) {
    const now = Date.now();
    const widgets = [];
    // DreamVault
    if (ctx.dreamVault?.status) {
        const st = ctx.dreamVault.status();
        const metrics = [
            { label: "Items", value: st.itemCount },
            { label: "Indexed", value: st.indexCount },
        ];
        widgets.push({
            id: "widget:dream-vault",
            kind: "metric-card",
            title: "Dream Vault",
            description: "Core blueprints, rituals, and assets.",
            metrics,
            payload: st.sampleIndex,
            updatedAt: now,
        });
    }
    // DreamShop
    if (ctx.dreamShop?.status) {
        const st = ctx.dreamShop.status();
        widgets.push({
            id: "widget:dream-shop",
            kind: "metric-card",
            title: "Dream Shop",
            metrics: [
                { label: "Offers", value: st.offerCount },
            ],
            payload: st.sampleOffers,
            updatedAt: now,
        });
    }
    // FieldLayer
    if (ctx.fieldLayer?.status) {
        const st = ctx.fieldLayer.status();
        widgets.push({
            id: "widget:field-layer",
            kind: "metric-card",
            title: "Field Layer",
            description: "Global risk/trust/liquidity/load fields.",
            metrics: [
                { label: "Samples", value: st.totalSamples },
            ],
            payload: st.samplePreview,
            updatedAt: now,
        });
    }
    // DreamBet
    if (ctx.dreamBetCore?.status) {
        const st = ctx.dreamBetCore.status();
        widgets.push({
            id: "widget:dreambet",
            kind: "metric-card",
            title: "DreamBet Core",
            metrics: [
                { label: "Games", value: st.gameCount },
                { label: "Rounds", value: st.roundCount },
                { label: "Fairness Records", value: st.fairnessCount },
            ],
            payload: st.sampleGames,
            updatedAt: now,
        });
    }
    // Zen Garden
    if (ctx.zenGardenCore?.status) {
        const st = ctx.zenGardenCore.status();
        widgets.push({
            id: "widget:zen-garden",
            kind: "metric-card",
            title: "Zen Garden",
            metrics: [
                { label: "Sessions", value: st.sessionCount },
                { label: "Activities", value: st.activityCount },
                { label: "Rewards", value: st.rewardCount },
            ],
            payload: st.sampleSessions,
            updatedAt: now,
        });
    }
    // Dream Cortex
    if (ctx.dreamCortex?.status) {
        const st = ctx.dreamCortex.status();
        widgets.push({
            id: "widget:dream-cortex",
            kind: "metric-card",
            title: "Dream Cortex",
            metrics: [
                { label: "Dreams", value: st.dreamCount },
                { label: "Directives", value: st.directiveCount },
            ],
            payload: st.lastDirectives,
            updatedAt: now,
        });
    }
    // Reputation
    if (ctx.reputationLattice?.status) {
        const st = ctx.reputationLattice.status();
        widgets.push({
            id: "widget:reputation-lattice",
            kind: "metric-card",
            title: "Reputation Lattice",
            metrics: [
                { label: "Entities", value: st.entityCount },
                { label: "Signals", value: st.signalCount },
            ],
            payload: st.scoresSample,
            updatedAt: now,
        });
    }
    // Identity Grid
    if (ctx.identityGrid?.status) {
        const st = ctx.identityGrid.status();
        widgets.push({
            id: "widget:identity-grid",
            kind: "metric-card",
            title: "Identity Grid",
            metrics: [
                { label: "Nodes", value: st.nodeCount },
                { label: "Edges", value: st.edgeCount },
            ],
            payload: {
                nodes: st.sampleNodes,
                edges: st.sampleEdges,
            },
            updatedAt: now,
        });
    }
    // Narrative Field (as log widget)
    if (ctx.narrativeField?.status) {
        const st = ctx.narrativeField.status();
        widgets.push({
            id: "widget:narrative-field",
            kind: "log",
            title: "Narrative Stream (Recent)",
            metrics: [
                { label: "Entries", value: st.entryCount },
            ],
            payload: st.recentEntries,
            updatedAt: now,
        });
    }
    // Economic Engine
    if (ctx.economicEngineCore?.status) {
        const st = ctx.economicEngineCore.status();
        widgets.push({
            id: "widget:economic-engine",
            kind: "metric-card",
            title: "Economic Engine",
            description: "Simulated token balances and reward flows.",
            metrics: [
                { label: "Tokens", value: st.tokenCount },
                { label: "Balances", value: st.balanceCount },
                { label: "Applied Rewards", value: st.appliedRewardCount },
            ],
            payload: st.sampleBalances,
            updatedAt: now,
        });
    }
    // Funding Wolf Pack
    if (ctx.wolfPackFundingCore?.status) {
        const st = ctx.wolfPackFundingCore.status();
        widgets.push({
            id: "widget:funding-wolf-pack",
            kind: "metric-card",
            title: "Funding Wolf Pack",
            description: "VC leads, scoring, and email queue.",
            metrics: [
                { label: "Leads", value: st.leadCount },
                { label: "Queue Items", value: st.queueCount },
                { label: "Pending", value: st.pendingCount },
                { label: "Hot Leads", value: st.hotLeadCount },
            ],
            payload: {
                sampleLeads: st.sampleLeads,
                sampleQueue: st.sampleQueue,
            },
            updatedAt: now,
        });
    }
    // Wolf Pack Analyst
    if (ctx.wolfPackAnalystCore?.status) {
        const st = ctx.wolfPackAnalystCore.status();
        widgets.push({
            id: "widget:wolf-pack-analyst",
            kind: "metric-card",
            title: "Wolf Pack Analyst",
            description: "AI agent that learns patterns and generates insights from funding data.",
            metrics: [
                { label: "Patterns Learned", value: st.trainingMetrics.totalPatternsLearned },
                { label: "Insights Generated", value: st.trainingMetrics.totalInsightsGenerated },
                { label: "Active Predictions", value: st.predictions.length },
                { label: "Training Cycles", value: st.trainingMetrics.trainingCycles },
            ],
            payload: {
                recentInsights: st.recentInsights.slice(0, 5),
                activePatterns: st.activePatterns.slice(0, 5),
                predictions: st.predictions.slice(0, 5),
            },
            updatedAt: now,
        });
    }
    const snapshot = {
        generatedAt: now,
        widgets,
        recentCommands: CommandStore.listRecentCommands(),
    };
    return snapshot;
}
