"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCycle = runCycle;
const orchestratorStore_1 = require("../store/orchestratorStore");
/**
 * Main runtime cycle.
 * This is intentionally simple and sequential.
 */
async function runCycle(ctx, cycleId) {
    const startedAt = Date.now();
    let error;
    try {
        // 1) FieldLayer first (fields updated, other systems can sample)
        if (ctx.FieldLayer?.run) {
            await ctx.FieldLayer.run({
                reputationLattice: ctx.ReputationLattice,
                quantumAnticipation: ctx.QuantumAnticipation, // optional future
                slugTimeMemory: ctx.SlugTimeMemory, // if you expose it
                starBridge: ctx.StarBridgeLungs, // if you expose it
                dreamCortex: ctx.DreamCortex,
                wolfPack: ctx.WolfPack,
                predatorScavenger: ctx.PredatorScavengerLoop,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        // 2) Core analytics / economy / agents
        if (ctx.AgentRegistryCore?.run) {
            await ctx.AgentRegistryCore.run({
                fieldLayer: ctx.FieldLayer,
                reputationLattice: ctx.ReputationLattice,
                narrativeField: ctx.NarrativeField,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.EconomicEngineCore?.run) {
            await ctx.EconomicEngineCore.run({
                identityGrid: ctx.IdentityGrid,
                zenGardenCore: ctx.ZenGardenCore,
                dreamBetCore: ctx.DreamBetCore,
                dreamVault: ctx.DreamVault,
                dreamShop: ctx.DreamShop,
                socialHubCore: ctx.SocialHubCore,
                dreamTankCore: ctx.DreamTankCore,
                initRitualCore: ctx.InitRitualCore,
                fieldLayer: ctx.FieldLayer,
                narrativeField: ctx.NarrativeField,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        // 3) Dream subsystems
        if (ctx.DreamTankCore?.run) {
            await ctx.DreamTankCore.run({
                dreamCortex: ctx.DreamCortex,
                dreamVault: ctx.DreamVault,
                reputationLattice: ctx.ReputationLattice,
                fieldLayer: ctx.FieldLayer,
                identityGrid: ctx.IdentityGrid,
                narrativeField: ctx.NarrativeField,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.InitRitualCore?.run) {
            await ctx.InitRitualCore.run({
                identityGrid: ctx.IdentityGrid,
                dreamCortex: ctx.DreamCortex,
                dreamTankCore: ctx.DreamTankCore,
                dreamVault: ctx.DreamVault,
                zenGardenCore: ctx.ZenGardenCore,
                socialHubCore: ctx.SocialHubCore,
                fieldLayer: ctx.FieldLayer,
                narrativeField: ctx.NarrativeField,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        // 4) User-facing "civilization" subsystems
        if (ctx.ZenGardenCore?.run) {
            await ctx.ZenGardenCore.run({
                identityGrid: ctx.IdentityGrid,
                fieldLayer: ctx.FieldLayer,
                dreamVault: ctx.DreamVault,
                dreamCortex: ctx.DreamCortex,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.DreamBetCore?.run) {
            await ctx.DreamBetCore.run({
                identityGrid: ctx.IdentityGrid,
                reputationLattice: ctx.ReputationLattice,
                fieldLayer: ctx.FieldLayer,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.SocialHubCore?.run) {
            await ctx.SocialHubCore.run({
                identityGrid: ctx.IdentityGrid,
                reputationLattice: ctx.ReputationLattice,
                fieldLayer: ctx.FieldLayer,
                dreamCortex: ctx.DreamCortex,
                dreamTankCore: ctx.DreamTankCore,
                narrativeField: ctx.NarrativeField,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.DreamShop?.run) {
            await ctx.DreamShop.run({
                dreamVault: ctx.DreamVault,
                identityGrid: ctx.IdentityGrid,
                reputationLattice: ctx.ReputationLattice,
                dreamCortex: ctx.DreamCortex,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.DreamVault?.run) {
            await ctx.DreamVault.run({
                dreamCortex: ctx.DreamCortex,
                identityGrid: ctx.IdentityGrid,
                narrativeField: ctx.NarrativeField,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        if (ctx.LiquidityEngine?.run) {
            await ctx.LiquidityEngine.run({
                fieldLayer: ctx.FieldLayer,
                neuralMesh: ctx.NeuralMesh,
                civicPanelCore: ctx.CivicPanelCore,
            });
        }
        // 4.5) Funding Wolf Pack (read-only: lead scoring + queue generation)
        if (ctx.WolfPackFundingCore?.run) {
            await ctx.WolfPackFundingCore.run({
                reputationLattice: ctx.ReputationLattice,
                fieldLayer: ctx.FieldLayer,
                dreamTankCore: ctx.DreamTankCore,
                economicEngineCore: ctx.EconomicEngineCore,
                narrativeField: ctx.NarrativeField,
                agentRegistryCore: ctx.AgentRegistryCore,
                neuralMesh: ctx.NeuralMesh,
            });
        }
        // 4.6) Wolf Pack Analyst (learns patterns, generates insights)
        if (ctx.WolfPackAnalystCore?.run) {
            await ctx.WolfPackAnalystCore.run({
                wolfPackFundingCore: ctx.WolfPackFundingCore,
                neuralMesh: ctx.NeuralMesh,
                narrativeField: ctx.NarrativeField,
            });
        }
        // 5) Panel + OS summary
        if (ctx.CivicPanelCore?.run) {
            await ctx.CivicPanelCore.run({
                dreamVault: ctx.DreamVault,
                dreamShop: ctx.DreamShop,
                fieldLayer: ctx.FieldLayer,
                dreamBetCore: ctx.DreamBetCore,
                zenGardenCore: ctx.ZenGardenCore,
                dreamCortex: ctx.DreamCortex,
                reputationLattice: ctx.ReputationLattice,
                narrativeField: ctx.NarrativeField,
                identityGrid: ctx.IdentityGrid,
                dreamTankCore: ctx.DreamTankCore,
                liquidityEngine: ctx.LiquidityEngine,
                socialHubCore: ctx.SocialHubCore,
                initRitualCore: ctx.InitRitualCore,
                economicEngineCore: ctx.EconomicEngineCore,
                agentRegistryCore: ctx.AgentRegistryCore,
                neuralMesh: ctx.NeuralMesh,
                wolfPackFundingCore: ctx.WolfPackFundingCore,
            });
        }
        if (ctx.DreamNetOSCore?.run) {
            await ctx.DreamNetOSCore.run({
                dreamVault: ctx.DreamVault,
                dreamShop: ctx.DreamShop,
                fieldLayer: ctx.FieldLayer,
                dreamBetCore: ctx.DreamBetCore,
                zenGardenCore: ctx.ZenGardenCore,
                civicPanelCore: ctx.CivicPanelCore,
                dreamTankCore: ctx.DreamTankCore,
                liquidityEngine: ctx.LiquidityEngine,
                socialHubCore: ctx.SocialHubCore,
                initRitualCore: ctx.InitRitualCore,
                economicEngineCore: ctx.EconomicEngineCore,
                agentRegistryCore: ctx.AgentRegistryCore,
                neuralMesh: ctx.NeuralMesh,
            });
        }
    }
    catch (err) {
        error = String(err);
    }
    const finishedAt = Date.now();
    const durationMs = finishedAt - startedAt;
    const telemetry = {
        cycleId,
        startedAt,
        finishedAt,
        durationMs,
        error,
    };
    orchestratorStore_1.OrchestratorStore.recordCycle(telemetry);
    return telemetry;
}
