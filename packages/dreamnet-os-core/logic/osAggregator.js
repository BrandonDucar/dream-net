function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}
export function buildOSSnapshot(ctx) {
    const now = Date.now();
    const version = {
        major: 0,
        minor: 4,
        patch: 0,
        label: "Tier IV Scaffold",
    };
    const subsystems = [];
    // Helper to push a subsystem summary safely
    const push = (name, ok, details, lastUpdatedAt) => {
        let status = "unknown";
        if (ok === true)
            status = "ok";
        else if (ok === false)
            status = "warn";
        subsystems.push({ name, status, details, lastUpdatedAt });
    };
    // DreamVault
    if (ctx.dreamVault?.status) {
        const st = ctx.dreamVault.status();
        const ok = st.itemCount > 0;
        push("DreamVault", ok, `Items=${st.itemCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("DreamVault", null, "No status");
    }
    // DreamShop
    if (ctx.dreamShop?.status) {
        const st = ctx.dreamShop.status();
        const ok = st.offerCount >= 0;
        push("DreamShop", ok, `Offers=${st.offerCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("DreamShop", null, "No status");
    }
    // FieldLayer
    if (ctx.fieldLayer?.status) {
        const st = ctx.fieldLayer.status();
        const ok = st.totalSamples >= 0;
        push("FieldLayer", ok, `Samples=${st.totalSamples}`, st.lastRunAt ?? undefined);
    }
    else {
        push("FieldLayer", null, "No status");
    }
    // DreamBet
    if (ctx.dreamBetCore?.status) {
        const st = ctx.dreamBetCore.status();
        const ok = st.errorCount ? st.errorCount === 0 : true;
        push("DreamBetCore", ok, `Games=${st.gameCount}, Rounds=${st.roundCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("DreamBetCore", null, "No status");
    }
    // ZenGarden
    if (ctx.zenGardenCore?.status) {
        const st = ctx.zenGardenCore.status();
        const ok = st.sessionCount >= 0;
        push("ZenGardenCore", ok, `Sessions=${st.sessionCount}, Rewards=${st.rewardCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("ZenGardenCore", null, "No status");
    }
    // DreamTank
    if (ctx.dreamTankCore?.status) {
        const st = ctx.dreamTankCore.status();
        const ok = st.dreamCount >= 0;
        push("DreamTankCore", ok, `Dreams=${st.dreamCount}, Evaluations=${st.evaluationCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("DreamTankCore", null, "No status");
    }
    // LiquidityEngine
    if (ctx.liquidityEngine?.status) {
        const st = ctx.liquidityEngine.status();
        const ok = st.poolCount >= 0;
        push("LiquidityEngine", ok, `Pools=${st.poolCount}, Planned=${st.plannedCount}, Active=${st.activeCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("LiquidityEngine", null, "No status");
    }
    // SocialHub
    if (ctx.socialHubCore?.status) {
        const st = ctx.socialHubCore.status();
        const ok = st.postCount >= 0;
        push("SocialHubCore", ok, `Posts=${st.postCount}, Comments=${st.commentCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("SocialHubCore", null, "No status");
    }
    // EconomicEngine
    if (ctx.economicEngineCore?.status) {
        const st = ctx.economicEngineCore.status();
        const ok = st.tokenCount > 0;
        push("EconomicEngineCore", ok, `Tokens=${st.tokenCount}, Balances=${st.balanceCount}, Rewards=${st.appliedRewardCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("EconomicEngineCore", null, "No status");
    }
    // AgentRegistry
    if (ctx.agentRegistryCore?.status) {
        const st = ctx.agentRegistryCore.status();
        const ok = st.errorCount === 0;
        push("AgentRegistryCore", ok, `Agents=${st.agentCount}, Errors=${st.errorCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("AgentRegistryCore", null, "No status");
    }
    // InitRitual
    if (ctx.initRitualCore?.status) {
        const st = ctx.initRitualCore.status();
        const ok = st.completedCount >= 0;
        push("InitRitualCore", ok, `Active=${st.activeIdentityCount}, Completed=${st.completedCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("InitRitualCore", null, "No status");
    }
    // CivicPanelCore is more of a consumer, optional
    // APIKeeperCore
    if (ctx.apiKeeperCore?.status) {
        const st = ctx.apiKeeperCore.status();
        const ok = st.keyCount > 0 && st.activeKeyCount > 0;
        push("APIKeeperCore", ok, `Providers=${st.providerCount}, Keys=${st.keyCount}, Active=${st.activeKeyCount}, Cost=$${st.costToday.toFixed(2)}`, st.lastRunAt ?? undefined);
    }
    else {
        push("APIKeeperCore", null, "No status");
    }
    // AISEOCore
    if (ctx.aiSeoCore?.status) {
        const st = ctx.aiSeoCore.status();
        const ok = st.optimizationCount >= 0;
        push("AISEOCore", ok, `Optimizations=${st.optimizationCount}, Keywords=${st.keywordCount}, Geofences=${st.geofenceCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("AISEOCore", null, "No status");
    }
    // ShieldCore
    if (ctx.shieldCore?.status) {
        const st = ctx.shieldCore.status();
        const ok = st.status === "armed" || st.status === "standby";
        push("ShieldCore", ok, `Status=${st.status}, Layers=${st.layerCount}, Threats=${st.activeThreats}, Neutralized=${st.neutralizedThreats}`, st.lastRunAt ?? undefined);
    }
    else {
        push("ShieldCore", null, "No status");
    }
    // WolfPackFundingCore
    if (ctx.wolfPackFundingCore?.status) {
        const st = ctx.wolfPackFundingCore.status();
        const ok = st.activeLeads > 0 || st.totalLeads >= 0;
        push("WolfPackFundingCore", ok, `Leads=${st.totalLeads}, Active=${st.activeLeads}, Grants=${st.grantsDrafted}`, st.lastRunAt ?? undefined);
    }
    else {
        push("WolfPackFundingCore", null, "No status");
    }
    // DreamStateCore
    if (ctx.dreamStateCore?.status) {
        const st = ctx.dreamStateCore.status();
        const ok = st.departmentCount > 0;
        push("DreamStateCore", ok, `Departments=${st.departmentCount}, Proposals=${st.proposalCount}, Actions=${st.recentActionCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("DreamStateCore", null, "No status");
    }
    // SpiderWebCore
    if (ctx.spiderWebCore?.status) {
        const st = ctx.spiderWebCore.status();
        const ok = st.threadCount >= 0;
        push("SpiderWebCore", ok, `Threads=${st.threadCount}, Active=${st.activeThreadCount}`, st.lastRunAt ?? undefined);
    }
    else {
        push("SpiderWebCore", null, "No status");
    }
    // StarBridgeLungs
    if (ctx.starBridgeLungs?.status) {
        const st = ctx.starBridgeLungs.status();
        const ok = st.chainMetrics.length > 0 && st.lastRunAt !== null;
        push("StarBridgeLungs", ok, `Chains=${st.chainMetrics.length}, Breaths=${st.lastBreaths.length}, LastRun=${st.lastRunAt ? new Date(st.lastRunAt).toISOString() : "never"}`, st.lastRunAt ?? undefined);
    }
    else {
        push("StarBridgeLungs", null, "No status");
    }
    // WebhookNervousCore
    if (ctx.webhookNervousCore?.status) {
        const st = ctx.webhookNervousCore.status();
        const ok = st.neurons.total > 0;
        push("WebhookNervousCore", ok, `Neurons=${st.neurons.total}, Synapses=${st.synapses.total}, Networks=${st.mycelium.networks}`, st.lastRunAt ?? undefined);
    }
    else {
        push("WebhookNervousCore", null, "No status");
    }
    // JaggyCore
    if (ctx.jaggyCore?.status) {
        const st = ctx.jaggyCore.status();
        const ok = st.status === "active" || st.status === "prowling";
        push("JaggyCore", ok, `Status=${st.status}, Fame=${st.baseFame.toFixed(1)}, Hunts=${st.hunts.length}, Territories=${st.territories.length}`, st.lastHuntAt ?? undefined);
    }
    else {
        push("JaggyCore", null, "No status");
    }
    // Dream Snail Core
    if (ctx.dreamSnailCore?.status) {
        const st = ctx.dreamSnailCore.status();
        const ok = st.integrityValid && st.totalTrails >= 0;
        push("DreamSnailCore", ok, `Trails=${st.totalTrails}, Identities=${st.totalIdentities}, Privacy=${st.privacyScore}%`, st.lastTrailAt > 0 ? st.lastTrailAt : undefined);
    }
    else {
        push("DreamSnailCore", null, "No status");
    }
    // DREAMKEEPER Core (if available globally)
    if (typeof global.DREAMKEEPER_CORE !== "undefined") {
        const dk = global.DREAMKEEPER_CORE;
        if (dk.getStatus) {
            const st = dk.getStatus();
            const ok = st.networkVitals.networkHealth !== "critical";
            push("DREAMKEEPER_CORE", ok, `Health=${st.networkVitals.networkHealth}, Dreams=${st.networkVitals.totalDreams}, Threat=${st.networkVitals.threatLevel}`, undefined);
        }
    }
    // DreamDefenseNet (if available globally)
    if (typeof global.DreamDefenseNet !== "undefined") {
        const dd = global.DreamDefenseNet;
        if (dd.status) {
            const ok = dd.status === "armed" || dd.status === "standby";
            push("DreamDefenseNet", ok, `Status=${dd.status}, Threats=${dd.activeThreats}, Neutralized=${dd.neutralizedThreats}`, undefined);
        }
    }
    // SurgeonAgent (if available globally)
    if (typeof global.SurgeonAgent !== "undefined") {
        const sa = global.SurgeonAgent;
        if (sa.getStatus) {
            const st = sa.getStatus();
            const ok = st.status === "active";
            push("SurgeonAgent", ok, `Status=${st.status}, Tasks=${st.taskQueue.length}, Completed=${st.completedTasks}`, undefined);
        }
    }
    // EvolutionEngine (if available globally)
    if (typeof global.EvolutionEngine !== "undefined") {
        const ee = global.EvolutionEngine;
        if (ee.getStatus) {
            const st = ee.getStatus();
            const ok = st.status === "active";
            push("EvolutionEngine", ok, `Status=${st.status}, Cycles=${st.totalCycles}, Upgrades=${st.totalUpgrades}`, undefined);
        }
    }
    // --- Global health scores (very simple heuristics) ---
    const infraHealth = clamp01(1 -
        (subsystems.find((s) => s.name === "AgentRegistryCore" && s.status === "error")
            ? 0.4
            : 0) -
        (subsystems.find((s) => s.name === "DreamBetCore" && s.status === "error")
            ? 0.2
            : 0));
    const economyHealth = clamp01((subsystems.find((s) => s.name === "EconomicEngineCore" && s.status === "ok")
        ? 0.7
        : 0.4) +
        (subsystems.find((s) => s.name === "LiquidityEngine" && s.status === "ok")
            ? 0.3
            : 0));
    const socialHealth = clamp01(subsystems.find((s) => s.name === "SocialHubCore" && s.status === "ok")
        ? 0.8
        : 0.4);
    const dreamPipelineHealth = clamp01((subsystems.find((s) => s.name === "DreamTankCore" && s.status === "ok")
        ? 0.6
        : 0.3) +
        (subsystems.find((s) => s.name === "InitRitualCore" && s.status === "ok")
            ? 0.2
            : 0));
    const globalHealth = {
        infraHealth,
        economyHealth,
        socialHealth,
        dreamPipelineHealth,
    };
    const snapshot = {
        version,
        heartbeatAt: now,
        globalHealth,
        subsystems,
    };
    return snapshot;
}
