"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.haloEngine = exports.HaloEngine = void 0;
const node_crypto_1 = require("node:crypto");
const historyStore_1 = require("./history/historyStore");
const agentHealthAnalyzer_1 = require("./analyzers/agentHealthAnalyzer");
const squadEfficiencyAnalyzer_1 = require("./analyzers/squadEfficiencyAnalyzer");
const endpointHealthAnalyzer_1 = require("./analyzers/endpointHealthAnalyzer");
const envConsistencyAnalyzer_1 = require("./analyzers/envConsistencyAnalyzer");
const repoIntegrityAnalyzer_1 = require("./analyzers/repoIntegrityAnalyzer");
const graftAnalyzer_1 = require("./analyzers/graftAnalyzer");
const swarmPatrol_1 = require("./analyzers/swarmPatrol");
const reviveAgentStrategy_1 = require("./strategies/reviveAgentStrategy");
const repairEndpointStrategy_1 = require("./strategies/repairEndpointStrategy");
const envSyncStrategy_1 = require("./strategies/envSyncStrategy");
const optimizeSquadStrategy_1 = require("./strategies/optimizeSquadStrategy");
const codeQualityStrategy_1 = require("./strategies/codeQualityStrategy");
const repairGraftStrategy_1 = require("./strategies/repairGraftStrategy");
const memory_dna_1 = require("@dreamnet/memory-dna");
const STRATEGIES = [
    reviveAgentStrategy_1.reviveAgentStrategy,
    repairEndpointStrategy_1.repairEndpointStrategy,
    envSyncStrategy_1.envSyncStrategy,
    optimizeSquadStrategy_1.optimizeSquadStrategy,
    codeQualityStrategy_1.codeQualityStrategy,
    repairGraftStrategy_1.repairGraftStrategy,
];
const DEFAULT_SQUAD_ENDPOINT = process.env.SQUAD_API_BASE ?? `http://127.0.0.1:${process.env.PORT ?? 5000}`;
class HaloEngine {
    lastCycle = null;
    weakPoints = [];
    running = false;
    pendingTriggerNames = new Set();
    async analyzeState(mode = "full") {
        if (mode === "light") {
            // Light mode: only fast analyzers
            return Promise.all([
                (0, agentHealthAnalyzer_1.agentHealthAnalyzer)(),
                (0, endpointHealthAnalyzer_1.endpointHealthAnalyzer)(),
                (0, envConsistencyAnalyzer_1.envConsistencyAnalyzer)(),
            ]);
        }
        // Full mode: all analyzers
        return Promise.all([
            (0, agentHealthAnalyzer_1.agentHealthAnalyzer)(),
            (0, squadEfficiencyAnalyzer_1.squadEfficiencyAnalyzer)(),
            (0, endpointHealthAnalyzer_1.endpointHealthAnalyzer)(),
            (0, envConsistencyAnalyzer_1.envConsistencyAnalyzer)(),
            (0, repoIntegrityAnalyzer_1.repoIntegrityAnalyzer)(),
            (0, graftAnalyzer_1.graftAnalyzer)(),
            (0, swarmPatrol_1.swarmPatrolAnalyzer)(),
        ]);
    }
    detectWeakPoints(analysis) {
        const points = [];
        analysis.forEach((result) => {
            result.issues.forEach((issue) => {
                if (issue.severity === "low")
                    return;
                points.push({
                    id: `${issue.analyzer}-${issue.id}`,
                    severity: issue.severity,
                    summary: issue.description,
                    relatedIssues: [issue],
                });
            });
        });
        this.weakPoints = points;
        return points;
    }
    generateTasks(analysis, mode = "full") {
        const tasks = [];
        analysis.forEach((result) => {
            result.issues.forEach((issue) => {
                const task = this.resolveStrategy(issue);
                if (task) {
                    // In light mode, all tasks are suggested (pending-approval)
                    if (mode === "light") {
                        task.status = "suggested";
                    }
                    tasks.push(task);
                }
            });
        });
        return tasks;
    }
    resolveStrategy(issue) {
        for (const strategy of STRATEGIES) {
            const task = strategy(issue);
            if (task)
                return task;
        }
        return null;
    }
    async dispatchToSquads(tasks) {
        if (!tasks.length)
            return [];
        const results = [];
        for (const task of tasks) {
            try {
                const response = await fetch(`${DEFAULT_SQUAD_ENDPOINT}/api/squad/tasks`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task }),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    results.push({
                        task,
                        status: "failed",
                        error: `HTTP ${response.status}: ${errorText.slice(0, 200)}`,
                    });
                }
                else {
                    const data = (await response.json());
                    results.push({
                        task,
                        squadId: data?.squadId,
                        status: "dispatched",
                    });
                }
            }
            catch (error) {
                results.push({
                    task,
                    status: "failed",
                    error: error?.message ?? String(error),
                });
            }
        }
        return results;
    }
    async recordResults(result) {
        await (0, historyStore_1.appendHistory)(result);
        this.lastCycle = result;
    }
    getWeakPoints() {
        return this.weakPoints;
    }
    async getStatus() {
        const latest = this.lastCycle ?? (await (0, historyStore_1.getLatestEntry)());
        return {
            lastRunAt: latest?.timestamp ?? null,
            lastSummary: latest?.summary ?? null,
            isRunning: this.running,
            pendingTriggers: Array.from(this.pendingTriggerNames),
        };
    }
    async getHistory(limit = 20) {
        return (0, historyStore_1.getHistory)(limit);
    }
    async runCycle(trigger = "manual", context, mode = "full") {
        if (this.running) {
            this.pendingTriggerNames.add(trigger);
            return this.lastCycle ?? (await (0, historyStore_1.getLatestEntry)()) ?? this.createEmptyCycle();
        }
        this.running = true;
        this.pendingTriggerNames.delete(trigger);
        try {
            const analysis = await this.analyzeState(mode);
            const weakPoints = this.detectWeakPoints(analysis);
            const tasks = this.generateTasks(analysis, mode);
            // In light mode, don't auto-dispatch - tasks are suggested only
            const dispatchResults = mode === "light" ? [] : await this.dispatchToSquads(tasks);
            const reason = context?.reason || trigger;
            const cycle = {
                id: (0, node_crypto_1.randomUUID)(),
                timestamp: new Date().toISOString(),
                analysis,
                weakPoints,
                generatedTasks: tasks,
                dispatchResults,
                summary: this.buildSummary(analysis, tasks, dispatchResults, { ...context, mode, reason }),
            };
            await this.recordResults(cycle);
            // Emit Event Wormhole event
            try {
                const { emitEvent } = await Promise.resolve().then(() => __importStar(require("@dreamnet/event-wormholes")));
                await emitEvent({
                    sourceType: "halo",
                    eventType: "halo.cycle.completed",
                    severity: cycle.weakPoints.length ? "warning" : "info",
                    payload: {
                        issuesFound: cycle.weakPoints.length,
                        tasksGenerated: tasks.length,
                        cycleId: cycle.id,
                    },
                });
                // Emit critical weakpoint events
                const criticalWeakPoints = cycle.weakPoints.filter((wp) => wp.severity === "critical");
                for (const wp of criticalWeakPoints) {
                    await emitEvent({
                        sourceType: "halo",
                        eventType: "halo.weakpoint.critical",
                        severity: "critical",
                        payload: { weakpoint: wp },
                    });
                }
            }
            catch (err) {
                // Event Wormholes not available, continue
                console.warn("[HALO] Event Wormholes not available:", err);
            }
            await (0, memory_dna_1.updateTraitsFromEvent)({
                id: cycle.id,
                timestamp: cycle.timestamp,
                sourceType: "halo",
                eventType: "halo.cycle.completed",
                severity: cycle.weakPoints.length ? "warning" : "info",
                payload: {
                    issuesFound: cycle.weakPoints.length,
                    tasksGenerated: cycle.generatedTasks.length,
                    primarySquadId: cycle.dispatchResults.find((result) => result.squadId)?.squadId,
                },
                handled: true,
            });
            for (const weakPoint of cycle.weakPoints.filter((point) => point.severity === "critical")) {
                await (0, memory_dna_1.updateTraitsFromEvent)({
                    id: `${cycle.id}-${weakPoint.id}`,
                    timestamp: cycle.timestamp,
                    sourceType: "halo",
                    eventType: "halo.weakpoint.critical",
                    severity: "critical",
                    payload: { weakPoint: weakPoint.summary },
                    handled: false,
                });
            }
            const insights = await (0, memory_dna_1.computeResonanceSnapshot)();
            if (insights.length) {
                const existing = await (0, memory_dna_1.getRecentInsights)(50);
                await (0, memory_dna_1.saveResonanceInsights)([...insights, ...existing]);
            }
            // Run Quantum Anticipation Layer (QAL) - non-blocking predictive analysis
            try {
                const { QuantumAnticipation } = await Promise.resolve().then(() => __importStar(require("@dreamnet/quantum-anticipation")));
                const { NeuralMesh } = await Promise.resolve().then(() => __importStar(require("@dreamnet/neural-mesh")));
                // Get pheromone store if available
                let pheromoneStore = null;
                try {
                    const pheromoneModule = await Promise.resolve().then(() => __importStar(require("./stores/pheromoneStore")));
                    pheromoneStore = {
                        depositPheromone: pheromoneModule.depositPheromone,
                        buildPath: pheromoneModule.buildPath,
                    };
                }
                catch {
                    // Pheromone store not available
                }
                // Get slime router if available
                let slimeRouter = null;
                try {
                    // Try to import slime router (dynamic import with path resolution)
                    // @ts-ignore - Dynamic import path may not resolve in TS but works at runtime
                    const slimeModule = await Promise.resolve().then(() => __importStar(require("@dreamnet/event-wormholes/src/slimeRouter")));
                    if (slimeModule?.slimeMoldRouter) {
                        slimeRouter = slimeModule.slimeMoldRouter;
                    }
                }
                catch {
                    // Slime router not available - continue without it
                }
                // Run QAL cycle with available subsystems
                QuantumAnticipation.run({
                    haloLoop: this,
                    slimeRouter,
                    pheromoneStore,
                    governance: null, // TODO: Import governance when needed
                    neuralMesh: NeuralMesh,
                });
                // Run Squad Alchemy Engine - non-blocking squad optimization
                try {
                    const { SquadAlchemy } = await Promise.resolve().then(() => __importStar(require("@dreamnet/squad-alchemy")));
                    SquadAlchemy.run({
                        pheromoneStore,
                        haloLoop: this,
                        quantumAnticipation: QuantumAnticipation,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Squad Alchemy not available or failed - continue without it
                    console.warn("[HaloEngine] Squad Alchemy cycle failed (non-blocking):", error);
                }
                // Run Wolf-Pack Protocol (WPP) - non-blocking anomaly hunting
                // Runs after Swarm Patrol and QAL to hunt based on their signals
                try {
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    // Get Swarm Patrol if available
                    let swarmPatrol = null;
                    try {
                        const swarmModule = await Promise.resolve().then(() => __importStar(require("./analyzers/swarmPatrol")));
                        swarmPatrol = {
                            analyze: swarmModule.swarmPatrolAnalyzer,
                        };
                    }
                    catch {
                        // Swarm Patrol not available
                    }
                    // Get governance if available
                    let governance = null;
                    try {
                        // @ts-ignore - Dynamic import path may not resolve in TS but works at runtime
                        const govModule = await Promise.resolve().then(() => __importStar(require("@dreamnet/governance")));
                        if (govModule) {
                            governance = {
                                checkPolicy: govModule.checkPolicy,
                                quorumEngine: govModule.quorumEngine,
                            };
                        }
                    }
                    catch {
                        // Governance not available - continue without it
                    }
                    WolfPack.run({
                        haloLoop: this,
                        swarmPatrol,
                        quantumAnticipation: QuantumAnticipation,
                        neuralMesh: NeuralMesh,
                        governance,
                    });
                }
                catch (error) {
                    // Wolf-Pack not available or failed - continue without it
                    console.warn("[HaloEngine] Wolf-Pack cycle failed (non-blocking):", error);
                }
                // Run Octopus Executor - 8-arm parallel runtime
                // Runs after other analyzers but before end-of-cycle logging
                try {
                    const { OctopusExecutor } = await Promise.resolve().then(() => __importStar(require("@dreamnet/octopus-executor")));
                    const { SquadAlchemy } = await Promise.resolve().then(() => __importStar(require("@dreamnet/squad-alchemy")));
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    // Get DreamOps, DeployKeeper, EnvKeeper if available
                    let dreamOps = null;
                    let deployKeeper = null;
                    let envKeeper = null;
                    // TODO: Wire actual DreamOps, DeployKeeper, EnvKeeper when available
                    // For now, these are null but OctopusExecutor handles missing context gracefully
                    await OctopusExecutor.run({
                        dreamOps,
                        deployKeeper,
                        envKeeper,
                        haloLoop: this,
                        neuralMesh: NeuralMesh,
                        quantumAnticipation: QuantumAnticipation,
                        squadAlchemy: SquadAlchemy,
                        wolfPack: WolfPack,
                    });
                }
                catch (error) {
                    // Octopus Executor not available or failed - continue without it
                    console.warn("[HaloEngine] Octopus Executor cycle failed (non-blocking):", error);
                }
                // Run Slug-Time Memory Layer (STM) - low-frequency slow memory
                // Runs on a slower cadence for long-horizon trend tracking
                try {
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    // Get pheromone store if available
                    let pheromoneStore = null;
                    try {
                        const pheromoneModule = await Promise.resolve().then(() => __importStar(require("./stores/pheromoneStore")));
                        pheromoneStore = {
                            depositPheromone: pheromoneModule.depositPheromone,
                            buildPath: pheromoneModule.buildPath,
                        };
                    }
                    catch {
                        // Pheromone store not available
                    }
                    SlugTimeMemory.run({
                        pheromoneStore,
                        neuralMesh: NeuralMesh,
                        quantumAnticipation: QuantumAnticipation,
                        haloLoop: this,
                    });
                    // TODO: Feed samples from Halo-Loop analysis into STM
                    // Example: failure-rate metrics from weak points
                    if (weakPoints.length > 0) {
                        const failureRate = weakPoints.filter(wp => wp.severity === "critical" || wp.severity === "high").length / Math.max(weakPoints.length, 1);
                        SlugTimeMemory.addSample({
                            id: `failure-rate-halo-${Date.now()}`,
                            key: "halo-loop",
                            kind: "failure-rate",
                            value: failureRate,
                            source: "HaloLoop",
                            createdAt: Date.now(),
                        });
                    }
                }
                catch (error) {
                    // Slug-Time Memory not available or failed - continue without it
                    console.warn("[HaloEngine] Slug-Time Memory cycle failed (non-blocking):", error);
                }
                // Run Star-Bridge Lungs - cross-chain breathing layer
                // Runs mid-frequency for chain health/pressure monitoring
                try {
                    const { StarBridgeLungs } = await Promise.resolve().then(() => __importStar(require("@dreamnet/star-bridge-lungs")));
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    // Get slime router if available
                    let slimeRouter = null;
                    try {
                        // @ts-ignore - Dynamic import path may not resolve in TS but works at runtime
                        const slimeModule = await Promise.resolve().then(() => __importStar(require("@dreamnet/event-wormholes/src/slimeRouter")));
                        if (slimeModule?.slimeMoldRouter) {
                            slimeRouter = slimeModule.slimeMoldRouter;
                        }
                    }
                    catch {
                        // Slime router not available - continue without it
                    }
                    StarBridgeLungs.run({
                        neuralMesh: NeuralMesh,
                        quantumAnticipation: QuantumAnticipation,
                        slugTimeMemory: SlugTimeMemory,
                        slimeRouter,
                    });
                }
                catch (error) {
                    // Star-Bridge Lungs not available or failed - continue without it
                    console.warn("[HaloEngine] Star-Bridge Lungs cycle failed (non-blocking):", error);
                }
                // Run Predator–Scavenger Loop (PSL) - final metabolic organ
                // Runs low/mid-frequency for decay detection and recycling
                try {
                    const { PredatorScavengerLoop } = await Promise.resolve().then(() => __importStar(require("@dreamnet/predator-scavenger")));
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    const { OctopusExecutor } = await Promise.resolve().then(() => __importStar(require("@dreamnet/octopus-executor")));
                    PredatorScavengerLoop.run({
                        haloLoop: this,
                        wolfPack: WolfPack,
                        slugTime: SlugTimeMemory,
                        neuralMesh: NeuralMesh,
                        octopusExecutor: OctopusExecutor,
                    });
                }
                catch (error) {
                    // Predator–Scavenger Loop not available or failed - continue without it
                    console.warn("[HaloEngine] Predator–Scavenger Loop cycle failed (non-blocking):", error);
                }
                // Run Dream Cortex - Tier III global intent + goal engine
                // Runs mid-frequency for goal tracking and directive synthesis
                try {
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { QuantumAnticipation } = await Promise.resolve().then(() => __importStar(require("@dreamnet/quantum-anticipation")));
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    const { StarBridgeLungs } = await Promise.resolve().then(() => __importStar(require("@dreamnet/star-bridge-lungs")));
                    DreamCortex.run({
                        neuralMesh: NeuralMesh,
                        quantumAnticipation: QuantumAnticipation,
                        slugTime: SlugTimeMemory,
                        wolfPack: WolfPack,
                        starBridge: StarBridgeLungs,
                    });
                }
                catch (error) {
                    // Dream Cortex not available or failed - continue without it
                    console.warn("[HaloEngine] Dream Cortex cycle failed (non-blocking):", error);
                }
                // Run Reputation Lattice - Tier III trust & reputation layer
                // Runs mid-frequency for reputation scoring
                try {
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    const { StarBridgeLungs } = await Promise.resolve().then(() => __importStar(require("@dreamnet/star-bridge-lungs")));
                    ReputationLattice.run({
                        wolfPack: WolfPack,
                        slugTime: SlugTimeMemory,
                        starBridge: StarBridgeLungs,
                        dreamCortex: DreamCortex,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Reputation Lattice not available or failed - continue without it
                    console.warn("[HaloEngine] Reputation Lattice cycle failed (non-blocking):", error);
                }
                // Run Narrative Field - Tier III global story stream
                // Runs mid-frequency for narrative generation
                try {
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    const { StarBridgeLungs } = await Promise.resolve().then(() => __importStar(require("@dreamnet/star-bridge-lungs")));
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    NarrativeField.run({
                        dreamCortex: DreamCortex,
                        reputationLattice: ReputationLattice,
                        wolfPack: WolfPack,
                        starBridge: StarBridgeLungs,
                        slugTime: SlugTimeMemory,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Narrative Field not available or failed - continue without it
                    console.warn("[HaloEngine] Narrative Field cycle failed (non-blocking):", error);
                }
                // Run Identity Grid - Tier III unified identity + wallet + agent layer
                // Runs mid-frequency for identity graph synchronization
                try {
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { StarBridgeLungs } = await Promise.resolve().then(() => __importStar(require("@dreamnet/star-bridge-lungs")));
                    IdentityGrid.run({
                        reputationLattice: ReputationLattice,
                        dreamCortex: DreamCortex,
                        starBridge: StarBridgeLungs,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Identity Grid not available or failed - continue without it
                    console.warn("[HaloEngine] Identity Grid cycle failed (non-blocking):", error);
                }
                // Run Dream Vault - Tier IV central repository (filesystem + library)
                // Runs mid-frequency for vault synchronization and indexing
                try {
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    DreamVault.run({
                        dreamCortex: DreamCortex,
                        identityGrid: IdentityGrid,
                        narrativeField: NarrativeField,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Dream Vault not available or failed - continue without it
                    console.warn("[HaloEngine] Dream Vault cycle failed (non-blocking):", error);
                }
                // Run Dream Shop - Tier IV marketplace layer (offer engine)
                // Runs mid-frequency for offer synchronization and recommendations
                try {
                    const { DreamShop } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-shop")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    DreamShop.run({
                        dreamVault: DreamVault,
                        identityGrid: IdentityGrid,
                        reputationLattice: ReputationLattice,
                        dreamCortex: DreamCortex,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Dream Shop not available or failed - continue without it
                    console.warn("[HaloEngine] Dream Shop cycle failed (non-blocking):", error);
                }
                // Run Field Layer - Tier IV global parameter fields (invisible physics)
                // Runs mid-/high-frequency for field updates and decay
                try {
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { QuantumAnticipation } = await Promise.resolve().then(() => __importStar(require("@dreamnet/quantum-anticipation")));
                    const { SlugTimeMemory } = await Promise.resolve().then(() => __importStar(require("@dreamnet/slug-time-memory")));
                    const { StarBridgeLungs } = await Promise.resolve().then(() => __importStar(require("@dreamnet/star-bridge-lungs")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { WolfPack } = await Promise.resolve().then(() => __importStar(require("@dreamnet/wolf-pack")));
                    const { PredatorScavengerLoop } = await Promise.resolve().then(() => __importStar(require("@dreamnet/predator-scavenger")));
                    FieldLayer.run({
                        reputationLattice: ReputationLattice,
                        quantumAnticipation: QuantumAnticipation,
                        slugTimeMemory: SlugTimeMemory,
                        starBridge: StarBridgeLungs,
                        dreamCortex: DreamCortex,
                        wolfPack: WolfPack,
                        predatorScavenger: PredatorScavengerLoop,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Field Layer not available or failed - continue without it
                    console.warn("[HaloEngine] Field Layer cycle failed (non-blocking):", error);
                }
                // Run DreamBet Core - Tier IV games + fairness engine
                // Runs mid-frequency for game session management and fairness auditing
                try {
                    const { DreamBetCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dreambet-core")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    DreamBetCore.run({
                        identityGrid: IdentityGrid,
                        reputationLattice: ReputationLattice,
                        fieldLayer: FieldLayer,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // DreamBet Core not available or failed - continue without it
                    console.warn("[HaloEngine] DreamBet Core cycle failed (non-blocking):", error);
                }
                // Run Zen Garden Core - Tier IV ritual + activity + reward engine
                // Runs mid-frequency for wellness activity tracking and reward computation
                try {
                    const { ZenGardenCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/zen-garden-core")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    ZenGardenCore.run({
                        identityGrid: IdentityGrid,
                        fieldLayer: FieldLayer,
                        dreamVault: DreamVault,
                        dreamCortex: DreamCortex,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Zen Garden Core not available or failed - continue without it
                    console.warn("[HaloEngine] Zen Garden Core cycle failed (non-blocking):", error);
                }
                // Run Civic Panel Core - Tier IV admin + status layer
                // Runs on slower cadence for dashboard aggregation and command processing
                try {
                    const { CivicPanelCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/civic-panel-core")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { DreamShop } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-shop")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { DreamBetCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dreambet-core")));
                    const { ZenGardenCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/zen-garden-core")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    await CivicPanelCore.run({
                        dreamVault: DreamVault,
                        dreamShop: DreamShop,
                        fieldLayer: FieldLayer,
                        dreamBetCore: DreamBetCore,
                        zenGardenCore: ZenGardenCore,
                        dreamCortex: DreamCortex,
                        reputationLattice: ReputationLattice,
                        narrativeField: NarrativeField,
                        identityGrid: IdentityGrid,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Civic Panel Core not available or failed - continue without it
                    console.warn("[HaloEngine] Civic Panel Core cycle failed (non-blocking):", error);
                }
                // Run Dream Tank Core - Tier IV incubator engine
                // Runs mid-frequency for dream progression and evaluation
                try {
                    const { DreamTankCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-tank-core")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    DreamTankCore.run({
                        dreamCortex: DreamCortex,
                        dreamVault: DreamVault,
                        reputationLattice: ReputationLattice,
                        fieldLayer: FieldLayer,
                        identityGrid: IdentityGrid,
                        narrativeField: NarrativeField,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Dream Tank Core not available or failed - continue without it
                    console.warn("[HaloEngine] Dream Tank Core cycle failed (non-blocking):", error);
                }
                // Run Liquidity Engine - Tier IV liquidity pool registry (structure only, no seeding)
                // Runs mid-frequency for pool status tracking
                try {
                    const { LiquidityEngine } = await Promise.resolve().then(() => __importStar(require("@dreamnet/liquidity-engine")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { CivicPanelCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/civic-panel-core")));
                    LiquidityEngine.run({
                        fieldLayer: FieldLayer,
                        neuralMesh: NeuralMesh,
                        civicPanelCore: CivicPanelCore,
                    });
                }
                catch (error) {
                    // Liquidity Engine not available or failed - continue without it
                    console.warn("[HaloEngine] Liquidity Engine cycle failed (non-blocking):", error);
                }
                // Run Social Hub Core - Tier IV social feed + posts layer
                // Runs mid-frequency for feed assembly and ranking
                try {
                    const { SocialHubCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/social-hub-core")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { DreamTankCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-tank-core")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    SocialHubCore.run({
                        identityGrid: IdentityGrid,
                        reputationLattice: ReputationLattice,
                        fieldLayer: FieldLayer,
                        dreamCortex: DreamCortex,
                        dreamTankCore: DreamTankCore,
                        narrativeField: NarrativeField,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Social Hub Core not available or failed - continue without it
                    console.warn("[HaloEngine] Social Hub Core cycle failed (non-blocking):", error);
                }
                // Run Init & Ritual Core - Tier IV onboarding + initialization layer
                // Runs mid-frequency for initialization flow tracking
                try {
                    const { InitRitualCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/init-ritual-core")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { DreamCortex } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-cortex")));
                    const { DreamTankCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-tank-core")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { ZenGardenCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/zen-garden-core")));
                    const { SocialHubCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/social-hub-core")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    InitRitualCore.run({
                        identityGrid: IdentityGrid,
                        dreamCortex: DreamCortex,
                        dreamTankCore: DreamTankCore,
                        dreamVault: DreamVault,
                        zenGardenCore: ZenGardenCore,
                        socialHubCore: SocialHubCore,
                        fieldLayer: FieldLayer,
                        narrativeField: NarrativeField,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Init & Ritual Core not available or failed - continue without it
                    console.warn("[HaloEngine] Init & Ritual Core cycle failed (non-blocking):", error);
                }
                // Run Economic Engine Core - Tier IV rewards + tokens layer
                // Runs mid-frequency for reward processing and balance tracking
                try {
                    const { EconomicEngineCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/economic-engine-core")));
                    const { IdentityGrid } = await Promise.resolve().then(() => __importStar(require("@dreamnet/identity-grid")));
                    const { ZenGardenCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/zen-garden-core")));
                    const { DreamBetCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dreambet-core")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { DreamShop } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-shop")));
                    const { SocialHubCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/social-hub-core")));
                    const { DreamTankCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-tank-core")));
                    const { InitRitualCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/init-ritual-core")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    EconomicEngineCore.run({
                        identityGrid: IdentityGrid,
                        zenGardenCore: ZenGardenCore,
                        dreamBetCore: DreamBetCore,
                        dreamVault: DreamVault,
                        dreamShop: DreamShop,
                        socialHubCore: SocialHubCore,
                        dreamTankCore: DreamTankCore,
                        initRitualCore: InitRitualCore,
                        fieldLayer: FieldLayer,
                        narrativeField: NarrativeField,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Economic Engine Core not available or failed - continue without it
                    console.warn("[HaloEngine] Economic Engine Core cycle failed (non-blocking):", error);
                }
                // Run Agent Registry Core - Tier IV agent catalog + health layer
                // Runs mid-frequency for agent health tracking and status aggregation
                try {
                    const { AgentRegistryCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/agent-registry-core")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { ReputationLattice } = await Promise.resolve().then(() => __importStar(require("@dreamnet/reputation-lattice")));
                    const { NarrativeField } = await Promise.resolve().then(() => __importStar(require("@dreamnet/narrative-field")));
                    AgentRegistryCore.run({
                        fieldLayer: FieldLayer,
                        reputationLattice: ReputationLattice,
                        narrativeField: NarrativeField,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // Agent Registry Core not available or failed - continue without it
                    console.warn("[HaloEngine] Agent Registry Core cycle failed (non-blocking):", error);
                }
                // Run DreamNet OS Core - Tier IV global status + heartbeat layer
                // Runs mid-frequency as the top-level OS status aggregator
                try {
                    const { DreamNetOSCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-os-core")));
                    const { DreamVault } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-vault")));
                    const { DreamShop } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-shop")));
                    const { FieldLayer } = await Promise.resolve().then(() => __importStar(require("@dreamnet/field-layer")));
                    const { DreamBetCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dreambet-core")));
                    const { ZenGardenCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/zen-garden-core")));
                    const { CivicPanelCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/civic-panel-core")));
                    const { DreamTankCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dream-tank-core")));
                    const { LiquidityEngine } = await Promise.resolve().then(() => __importStar(require("@dreamnet/liquidity-engine")));
                    const { SocialHubCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/social-hub-core")));
                    const { InitRitualCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/init-ritual-core")));
                    const { EconomicEngineCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/economic-engine-core")));
                    const { AgentRegistryCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/agent-registry-core")));
                    DreamNetOSCore.run({
                        dreamVault: DreamVault,
                        dreamShop: DreamShop,
                        fieldLayer: FieldLayer,
                        dreamBetCore: DreamBetCore,
                        zenGardenCore: ZenGardenCore,
                        civicPanelCore: CivicPanelCore,
                        dreamTankCore: DreamTankCore,
                        liquidityEngine: LiquidityEngine,
                        socialHubCore: SocialHubCore,
                        initRitualCore: InitRitualCore,
                        economicEngineCore: EconomicEngineCore,
                        agentRegistryCore: AgentRegistryCore,
                        neuralMesh: NeuralMesh,
                    });
                }
                catch (error) {
                    // DreamNet OS Core not available or failed - continue without it
                    console.warn("[HaloEngine] DreamNet OS Core cycle failed (non-blocking):", error);
                }
            }
            catch (error) {
                // QAL not available or failed - continue without it
                console.warn("[HaloEngine] QAL cycle failed (non-blocking):", error);
            }
            return cycle;
        }
        finally {
            this.running = false;
        }
    }
    buildSummary(analysis, tasks, dispatchResults, context) {
        const issueCount = analysis.reduce((acc, result) => acc + result.issues.length, 0);
        const dispatched = dispatchResults.filter((r) => r.status === "dispatched").length;
        const failed = dispatchResults.filter((r) => r.status === "failed").length;
        const mode = context?.mode || "full";
        const reason = context?.reason || "";
        const source = context?.metadata ? "context trigger" : "HALO loop";
        const modeLabel = mode === "light" ? " [LIGHT MODE]" : "";
        const reasonLabel = reason ? ` [${reason}]` : "";
        return `HALO cycle via ${source}${modeLabel}${reasonLabel}: ${issueCount} findings, ${tasks.length} tasks generated, ${dispatched} dispatched, ${failed} failed.`;
    }
    createEmptyCycle() {
        return {
            id: (0, node_crypto_1.randomUUID)(),
            timestamp: new Date().toISOString(),
            analysis: [],
            weakPoints: [],
            generatedTasks: [],
            dispatchResults: [],
            summary: "HALO loop has not completed a cycle yet.",
        };
    }
}
exports.HaloEngine = HaloEngine;
exports.haloEngine = new HaloEngine();
