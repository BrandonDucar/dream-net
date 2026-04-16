import { randomUUID } from "node:crypto";
import type {
  AnalyzerResult,
  DispatchResult,
  HaloCycleResult,
  HaloStatus,
  Issue,
  SquadTask,
  WeakPoint,
} from "./types";
import { appendHistory, getLatestEntry, getHistory } from "./history/historyStore";
import { agentHealthAnalyzer } from "./analyzers/agentHealthAnalyzer";
import { squadEfficiencyAnalyzer } from "./analyzers/squadEfficiencyAnalyzer";
import { endpointHealthAnalyzer } from "./analyzers/endpointHealthAnalyzer";
import { envConsistencyAnalyzer } from "./analyzers/envConsistencyAnalyzer";
import { repoIntegrityAnalyzer } from "./analyzers/repoIntegrityAnalyzer";
import { graftAnalyzer } from "./analyzers/graftAnalyzer";
import { swarmPatrolAnalyzer } from "./analyzers/swarmPatrol";
import { reviveAgentStrategy } from "./strategies/reviveAgentStrategy";
import { repairEndpointStrategy } from "./strategies/repairEndpointStrategy";
import { envSyncStrategy } from "./strategies/envSyncStrategy";
import { optimizeSquadStrategy } from "./strategies/optimizeSquadStrategy";
import { codeQualityStrategy } from "./strategies/codeQualityStrategy";
import { repairGraftStrategy } from "./strategies/repairGraftStrategy";
import {
  updateTraitsFromEvent,
  computeResonanceSnapshot,
  saveResonanceInsights,
  getRecentInsights,
} from "@dreamnet/memory-dna";

const STRATEGIES = [
  reviveAgentStrategy,
  repairEndpointStrategy,
  envSyncStrategy,
  optimizeSquadStrategy,
  codeQualityStrategy,
  repairGraftStrategy,
];

const DEFAULT_SQUAD_ENDPOINT =
  process.env.SQUAD_API_BASE ?? `http://127.0.0.1:${process.env.PORT ?? 5000}`;

export class HaloEngine {
  private lastCycle: HaloCycleResult | null = null;
  private weakPoints: WeakPoint[] = [];
  private running = false;
  private pendingTriggerNames: Set<string> = new Set();

  public async analyzeState(mode: "light" | "full" = "full"): Promise<AnalyzerResult[]> {
    if (mode === "light") {
      // Light mode: only fast analyzers
      return Promise.all([
        agentHealthAnalyzer(),
        endpointHealthAnalyzer(),
        envConsistencyAnalyzer(),
      ]);
    }
    // Full mode: all analyzers
    return Promise.all([
      agentHealthAnalyzer(),
      squadEfficiencyAnalyzer(),
      endpointHealthAnalyzer(),
      envConsistencyAnalyzer(),
      repoIntegrityAnalyzer(),
      graftAnalyzer(),
      swarmPatrolAnalyzer(),
    ]);
  }

  public detectWeakPoints(analysis: AnalyzerResult[]): WeakPoint[] {
    const points: WeakPoint[] = [];

    analysis.forEach((result) => {
      result.issues.forEach((issue) => {
        if (issue.severity === "low") return;
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

  public generateTasks(analysis: AnalyzerResult[], mode: "light" | "full" = "full"): SquadTask[] {
    const tasks: SquadTask[] = [];

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

  private resolveStrategy(issue: Issue): SquadTask | null {
    for (const strategy of STRATEGIES) {
      const task = strategy(issue);
      if (task) return task;
    }
    return null;
  }

  public async dispatchToSquads(tasks: SquadTask[]): Promise<DispatchResult[]> {
    if (!tasks.length) return [];

    const results: DispatchResult[] = [];

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
        } else {
          const data = (await response.json()) as { squadId?: string };
          results.push({
            task,
            squadId: data?.squadId,
            status: "dispatched",
          });
        }
      } catch (error: any) {
        results.push({
          task,
          status: "failed",
          error: error?.message ?? String(error),
        });
      }
    }

    return results;
  }

  public async recordResults(result: HaloCycleResult): Promise<void> {
    await appendHistory(result);
    this.lastCycle = result;
  }

  public getWeakPoints(): WeakPoint[] {
    return this.weakPoints;
  }

  public async getStatus(): Promise<HaloStatus> {
    const latest = this.lastCycle ?? (await getLatestEntry());
    return {
      lastRunAt: latest?.timestamp ?? null,
      lastSummary: latest?.summary ?? null,
      isRunning: this.running,
      pendingTriggers: Array.from(this.pendingTriggerNames),
    };
  }

  public async getHistory(limit = 20): Promise<HaloCycleResult[]> {
    return getHistory(limit);
  }

  public async runCycle(
    trigger: string = "manual",
    context?: Record<string, unknown>,
    mode: "light" | "full" = "full",
  ): Promise<HaloCycleResult> {
    if (this.running) {
      this.pendingTriggerNames.add(trigger);
      return this.lastCycle ?? (await getLatestEntry()) ?? this.createEmptyCycle();
    }

    this.running = true;
    this.pendingTriggerNames.delete(trigger);

    try {
      const analysis = await this.analyzeState(mode);
      const weakPoints = this.detectWeakPoints(analysis);
      const tasks = this.generateTasks(analysis, mode);
      // In light mode, don't auto-dispatch - tasks are suggested only
      const dispatchResults = mode === "light" ? [] : await this.dispatchToSquads(tasks);

      const reason = (context?.reason as string) || trigger;
      const cycle: HaloCycleResult = {
        id: randomUUID(),
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
        const { emitEvent } = await import("@dreamnet/event-wormholes");
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
      } catch (err) {
        // Event Wormholes not available, continue
        console.warn("[HALO] Event Wormholes not available:", err);
      }

      await updateTraitsFromEvent({
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
        await updateTraitsFromEvent({
          id: `${cycle.id}-${weakPoint.id}`,
          timestamp: cycle.timestamp,
          sourceType: "halo",
          eventType: "halo.weakpoint.critical",
          severity: "critical",
          payload: { weakPoint: weakPoint.summary },
          handled: false,
        });
      }

      const insights = await computeResonanceSnapshot();
      if (insights.length) {
        const existing = await getRecentInsights(50);
        await saveResonanceInsights([...insights, ...existing]);
      }

      // Run Quantum Anticipation Layer (QAL) - non-blocking predictive analysis
      try {
        const { QuantumAnticipation } = await import("@dreamnet/quantum-anticipation");
        const { NeuralMesh } = await import("@dreamnet/neural-mesh");
        
        // Get pheromone store if available
        let pheromoneStore: any = null;
        try {
          const pheromoneModule = await import("./stores/pheromoneStore");
          pheromoneStore = {
            depositPheromone: pheromoneModule.depositPheromone,
            buildPath: pheromoneModule.buildPath,
          };
        } catch {
          // Pheromone store not available
        }

        // Get slime router if available
        let slimeRouter: any = null;
        try {
          // Try to import slime router (dynamic import with path resolution)
          // @ts-ignore - Dynamic import path may not resolve in TS but works at runtime
          const slimeModule = await import("@dreamnet/event-wormholes/src/slimeRouter");
          if (slimeModule?.slimeMoldRouter) {
            slimeRouter = slimeModule.slimeMoldRouter;
          }
        } catch {
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
          const { SquadAlchemy } = await import("@dreamnet/squad-alchemy");
          SquadAlchemy.run({
            pheromoneStore,
            haloLoop: this,
            quantumAnticipation: QuantumAnticipation,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Squad Alchemy not available or failed - continue without it
          console.warn("[HaloEngine] Squad Alchemy cycle failed (non-blocking):", error);
        }

        // Run Wolf-Pack Protocol (WPP) - non-blocking anomaly hunting
        // Runs after Swarm Patrol and QAL to hunt based on their signals
        try {
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          
          // Get Swarm Patrol if available
          let swarmPatrol: any = null;
          try {
            const swarmModule = await import("./analyzers/swarmPatrol");
            swarmPatrol = {
              analyze: swarmModule.swarmPatrolAnalyzer,
            };
          } catch {
            // Swarm Patrol not available
          }

          // Get governance if available
          let governance: any = null;
          try {
            // @ts-ignore - Dynamic import path may not resolve in TS but works at runtime
            const govModule = await import("@dreamnet/governance");
            if (govModule) {
              governance = {
                checkPolicy: govModule.checkPolicy,
                quorumEngine: govModule.quorumEngine,
              };
            }
          } catch {
            // Governance not available - continue without it
          }

          WolfPack.run({
            haloLoop: this,
            swarmPatrol,
            quantumAnticipation: QuantumAnticipation,
            neuralMesh: NeuralMesh,
            governance,
          });
        } catch (error) {
          // Wolf-Pack not available or failed - continue without it
          console.warn("[HaloEngine] Wolf-Pack cycle failed (non-blocking):", error);
        }

        // Run Octopus Executor - 8-arm parallel runtime
        // Runs after other analyzers but before end-of-cycle logging
        try {
          const { OctopusExecutor } = await import("@dreamnet/octopus-executor");
          const { SquadAlchemy } = await import("@dreamnet/squad-alchemy");
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          
          // Get DreamOps, DeployKeeper, EnvKeeper if available
          let dreamOps: any = null;
          let deployKeeper: any = null;
          let envKeeper: any = null;
          
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
        } catch (error) {
          // Octopus Executor not available or failed - continue without it
          console.warn("[HaloEngine] Octopus Executor cycle failed (non-blocking):", error);
        }

        // Run Slug-Time Memory Layer (STM) - low-frequency slow memory
        // Runs on a slower cadence for long-horizon trend tracking
        try {
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");
          
          // Get pheromone store if available
          let pheromoneStore: any = null;
          try {
            const pheromoneModule = await import("./stores/pheromoneStore");
            pheromoneStore = {
              depositPheromone: pheromoneModule.depositPheromone,
              buildPath: pheromoneModule.buildPath,
            };
          } catch {
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
        } catch (error) {
          // Slug-Time Memory not available or failed - continue without it
          console.warn("[HaloEngine] Slug-Time Memory cycle failed (non-blocking):", error);
        }

        // Run Star-Bridge Lungs - cross-chain breathing layer
        // Runs mid-frequency for chain health/pressure monitoring
        try {
          const { StarBridgeLungs } = await import("@dreamnet/star-bridge-lungs");
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");
          
          // Get slime router if available
          let slimeRouter: any = null;
          try {
            // @ts-ignore - Dynamic import path may not resolve in TS but works at runtime
            const slimeModule = await import("@dreamnet/event-wormholes/src/slimeRouter");
            if (slimeModule?.slimeMoldRouter) {
              slimeRouter = slimeModule.slimeMoldRouter;
            }
          } catch {
            // Slime router not available - continue without it
          }

          StarBridgeLungs.run({
            neuralMesh: NeuralMesh,
            quantumAnticipation: QuantumAnticipation,
            slugTimeMemory: SlugTimeMemory,
            slimeRouter,
          });
        } catch (error) {
          // Star-Bridge Lungs not available or failed - continue without it
          console.warn("[HaloEngine] Star-Bridge Lungs cycle failed (non-blocking):", error);
        }

        // Run Predator–Scavenger Loop (PSL) - final metabolic organ
        // Runs low/mid-frequency for decay detection and recycling
        try {
          const { PredatorScavengerLoop } = await import("@dreamnet/predator-scavenger");
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");
          const { OctopusExecutor } = await import("@dreamnet/octopus-executor");

          PredatorScavengerLoop.run({
            haloLoop: this,
            wolfPack: WolfPack,
            slugTime: SlugTimeMemory,
            neuralMesh: NeuralMesh,
            octopusExecutor: OctopusExecutor,
          });
        } catch (error) {
          // Predator–Scavenger Loop not available or failed - continue without it
          console.warn("[HaloEngine] Predator–Scavenger Loop cycle failed (non-blocking):", error);
        }

        // Run Dream Cortex - Tier III global intent + goal engine
        // Runs mid-frequency for goal tracking and directive synthesis
        try {
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { QuantumAnticipation } = await import("@dreamnet/quantum-anticipation");
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          const { StarBridgeLungs } = await import("@dreamnet/star-bridge-lungs");

          DreamCortex.run({
            neuralMesh: NeuralMesh,
            quantumAnticipation: QuantumAnticipation,
            slugTime: SlugTimeMemory,
            wolfPack: WolfPack,
            starBridge: StarBridgeLungs,
          });
        } catch (error) {
          // Dream Cortex not available or failed - continue without it
          console.warn("[HaloEngine] Dream Cortex cycle failed (non-blocking):", error);
        }

        // Run Reputation Lattice - Tier III trust & reputation layer
        // Runs mid-frequency for reputation scoring
        try {
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          const { StarBridgeLungs } = await import("@dreamnet/star-bridge-lungs");

          ReputationLattice.run({
            wolfPack: WolfPack,
            slugTime: SlugTimeMemory,
            starBridge: StarBridgeLungs,
            dreamCortex: DreamCortex,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Reputation Lattice not available or failed - continue without it
          console.warn("[HaloEngine] Reputation Lattice cycle failed (non-blocking):", error);
        }

        // Run Narrative Field - Tier III global story stream
        // Runs mid-frequency for narrative generation
        try {
          const { NarrativeField } = await import("@dreamnet/narrative-field");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          const { StarBridgeLungs } = await import("@dreamnet/star-bridge-lungs");
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");

          NarrativeField.run({
            dreamCortex: DreamCortex,
            reputationLattice: ReputationLattice,
            wolfPack: WolfPack,
            starBridge: StarBridgeLungs,
            slugTime: SlugTimeMemory,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Narrative Field not available or failed - continue without it
          console.warn("[HaloEngine] Narrative Field cycle failed (non-blocking):", error);
        }

        // Run Identity Grid - Tier III unified identity + wallet + agent layer
        // Runs mid-frequency for identity graph synchronization
        try {
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { StarBridgeLungs } = await import("@dreamnet/star-bridge-lungs");

          IdentityGrid.run({
            reputationLattice: ReputationLattice,
            dreamCortex: DreamCortex,
            starBridge: StarBridgeLungs,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Identity Grid not available or failed - continue without it
          console.warn("[HaloEngine] Identity Grid cycle failed (non-blocking):", error);
        }

        // Run Dream Vault - Tier IV central repository (filesystem + library)
        // Runs mid-frequency for vault synchronization and indexing
        try {
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { NarrativeField } = await import("@dreamnet/narrative-field");

          DreamVault.run({
            dreamCortex: DreamCortex,
            identityGrid: IdentityGrid,
            narrativeField: NarrativeField,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Dream Vault not available or failed - continue without it
          console.warn("[HaloEngine] Dream Vault cycle failed (non-blocking):", error);
        }

        // Run Dream Shop - Tier IV marketplace layer (offer engine)
        // Runs mid-frequency for offer synchronization and recommendations
        try {
          const { DreamShop } = await import("@dreamnet/dream-shop");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");

          DreamShop.run({
            dreamVault: DreamVault,
            identityGrid: IdentityGrid,
            reputationLattice: ReputationLattice,
            dreamCortex: DreamCortex,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Dream Shop not available or failed - continue without it
          console.warn("[HaloEngine] Dream Shop cycle failed (non-blocking):", error);
        }

        // Run Field Layer - Tier IV global parameter fields (invisible physics)
        // Runs mid-/high-frequency for field updates and decay
        try {
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { QuantumAnticipation } = await import("@dreamnet/quantum-anticipation");
          const { SlugTimeMemory } = await import("@dreamnet/slug-time-memory");
          const { StarBridgeLungs } = await import("@dreamnet/star-bridge-lungs");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { WolfPack } = await import("@dreamnet/wolf-pack");
          const { PredatorScavengerLoop } = await import("@dreamnet/predator-scavenger");

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
        } catch (error) {
          // Field Layer not available or failed - continue without it
          console.warn("[HaloEngine] Field Layer cycle failed (non-blocking):", error);
        }

        // Run DreamBet Core - Tier IV games + fairness engine
        // Runs mid-frequency for game session management and fairness auditing
        try {
          const { DreamBetCore } = await import("@dreamnet/dreambet-core");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { FieldLayer } = await import("@dreamnet/field-layer");

          DreamBetCore.run({
            identityGrid: IdentityGrid,
            reputationLattice: ReputationLattice,
            fieldLayer: FieldLayer,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // DreamBet Core not available or failed - continue without it
          console.warn("[HaloEngine] DreamBet Core cycle failed (non-blocking):", error);
        }

        // Run Zen Garden Core - Tier IV ritual + activity + reward engine
        // Runs mid-frequency for wellness activity tracking and reward computation
        try {
          const { ZenGardenCore } = await import("@dreamnet/zen-garden-core");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");

          ZenGardenCore.run({
            identityGrid: IdentityGrid,
            fieldLayer: FieldLayer,
            dreamVault: DreamVault,
            dreamCortex: DreamCortex,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Zen Garden Core not available or failed - continue without it
          console.warn("[HaloEngine] Zen Garden Core cycle failed (non-blocking):", error);
        }

        // Run Civic Panel Core - Tier IV admin + status layer
        // Runs on slower cadence for dashboard aggregation and command processing
        try {
          const { CivicPanelCore } = await import("@dreamnet/civic-panel-core");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { DreamShop } = await import("@dreamnet/dream-shop");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { DreamBetCore } = await import("@dreamnet/dreambet-core");
          const { ZenGardenCore } = await import("@dreamnet/zen-garden-core");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { NarrativeField } = await import("@dreamnet/narrative-field");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");

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
        } catch (error) {
          // Civic Panel Core not available or failed - continue without it
          console.warn("[HaloEngine] Civic Panel Core cycle failed (non-blocking):", error);
        }

        // Run Dream Tank Core - Tier IV incubator engine
        // Runs mid-frequency for dream progression and evaluation
        try {
          const { DreamTankCore } = await import("@dreamnet/dream-tank-core");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { NarrativeField } = await import("@dreamnet/narrative-field");

          DreamTankCore.run({
            dreamCortex: DreamCortex,
            dreamVault: DreamVault,
            reputationLattice: ReputationLattice,
            fieldLayer: FieldLayer,
            identityGrid: IdentityGrid,
            narrativeField: NarrativeField,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Dream Tank Core not available or failed - continue without it
          console.warn("[HaloEngine] Dream Tank Core cycle failed (non-blocking):", error);
        }

        // Run Liquidity Engine - Tier IV liquidity pool registry (structure only, no seeding)
        // Runs mid-frequency for pool status tracking
        try {
          const { LiquidityEngine } = await import("@dreamnet/liquidity-engine");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { CivicPanelCore } = await import("@dreamnet/civic-panel-core");

          LiquidityEngine.run({
            fieldLayer: FieldLayer,
            neuralMesh: NeuralMesh,
            civicPanelCore: CivicPanelCore,
          });
        } catch (error) {
          // Liquidity Engine not available or failed - continue without it
          console.warn("[HaloEngine] Liquidity Engine cycle failed (non-blocking):", error);
        }

        // Run Social Hub Core - Tier IV social feed + posts layer
        // Runs mid-frequency for feed assembly and ranking
        try {
          const { SocialHubCore } = await import("@dreamnet/social-hub-core");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { DreamTankCore } = await import("@dreamnet/dream-tank-core");
          const { NarrativeField } = await import("@dreamnet/narrative-field");

          SocialHubCore.run({
            identityGrid: IdentityGrid,
            reputationLattice: ReputationLattice,
            fieldLayer: FieldLayer,
            dreamCortex: DreamCortex,
            dreamTankCore: DreamTankCore,
            narrativeField: NarrativeField,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Social Hub Core not available or failed - continue without it
          console.warn("[HaloEngine] Social Hub Core cycle failed (non-blocking):", error);
        }

        // Run Init & Ritual Core - Tier IV onboarding + initialization layer
        // Runs mid-frequency for initialization flow tracking
        try {
          const { InitRitualCore } = await import("@dreamnet/init-ritual-core");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { DreamCortex } = await import("@dreamnet/dream-cortex");
          const { DreamTankCore } = await import("@dreamnet/dream-tank-core");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { ZenGardenCore } = await import("@dreamnet/zen-garden-core");
          const { SocialHubCore } = await import("@dreamnet/social-hub-core");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { NarrativeField } = await import("@dreamnet/narrative-field");

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
        } catch (error) {
          // Init & Ritual Core not available or failed - continue without it
          console.warn("[HaloEngine] Init & Ritual Core cycle failed (non-blocking):", error);
        }

        // Run Economic Engine Core - Tier IV rewards + tokens layer
        // Runs mid-frequency for reward processing and balance tracking
        try {
          const { EconomicEngineCore } = await import("@dreamnet/economic-engine-core");
          const { IdentityGrid } = await import("@dreamnet/identity-grid");
          const { ZenGardenCore } = await import("@dreamnet/zen-garden-core");
          const { DreamBetCore } = await import("@dreamnet/dreambet-core");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { DreamShop } = await import("@dreamnet/dream-shop");
          const { SocialHubCore } = await import("@dreamnet/social-hub-core");
          const { DreamTankCore } = await import("@dreamnet/dream-tank-core");
          const { InitRitualCore } = await import("@dreamnet/init-ritual-core");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { NarrativeField } = await import("@dreamnet/narrative-field");

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
        } catch (error) {
          // Economic Engine Core not available or failed - continue without it
          console.warn("[HaloEngine] Economic Engine Core cycle failed (non-blocking):", error);
        }

        // Run Agent Registry Core - Tier IV agent catalog + health layer
        // Runs mid-frequency for agent health tracking and status aggregation
        try {
          const { AgentRegistryCore } = await import("@dreamnet/agent-registry-core");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { ReputationLattice } = await import("@dreamnet/reputation-lattice");
          const { NarrativeField } = await import("@dreamnet/narrative-field");

          AgentRegistryCore.run({
            fieldLayer: FieldLayer,
            reputationLattice: ReputationLattice,
            narrativeField: NarrativeField,
            neuralMesh: NeuralMesh,
          });
        } catch (error) {
          // Agent Registry Core not available or failed - continue without it
          console.warn("[HaloEngine] Agent Registry Core cycle failed (non-blocking):", error);
        }

        // Run DreamNet OS Core - Tier IV global status + heartbeat layer
        // Runs mid-frequency as the top-level OS status aggregator
        try {
          const { DreamNetOSCore } = await import("@dreamnet/dreamnet-os-core");
          const { DreamVault } = await import("@dreamnet/dream-vault");
          const { DreamShop } = await import("@dreamnet/dream-shop");
          const { FieldLayer } = await import("@dreamnet/field-layer");
          const { DreamBetCore } = await import("@dreamnet/dreambet-core");
          const { ZenGardenCore } = await import("@dreamnet/zen-garden-core");
          const { CivicPanelCore } = await import("@dreamnet/civic-panel-core");
          const { DreamTankCore } = await import("@dreamnet/dream-tank-core");
          const { LiquidityEngine } = await import("@dreamnet/liquidity-engine");
          const { SocialHubCore } = await import("@dreamnet/social-hub-core");
          const { InitRitualCore } = await import("@dreamnet/init-ritual-core");
          const { EconomicEngineCore } = await import("@dreamnet/economic-engine-core");
          const { AgentRegistryCore } = await import("@dreamnet/agent-registry-core");

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
        } catch (error) {
          // DreamNet OS Core not available or failed - continue without it
          console.warn("[HaloEngine] DreamNet OS Core cycle failed (non-blocking):", error);
        }
      } catch (error) {
        // QAL not available or failed - continue without it
        console.warn("[HaloEngine] QAL cycle failed (non-blocking):", error);
      }

      return cycle;
    } finally {
      this.running = false;
    }
  }

  private buildSummary(
    analysis: AnalyzerResult[],
    tasks: SquadTask[],
    dispatchResults: DispatchResult[],
    context?: Record<string, unknown>,
  ): string {
    const issueCount = analysis.reduce((acc, result) => acc + result.issues.length, 0);
    const dispatched = dispatchResults.filter((r) => r.status === "dispatched").length;
    const failed = dispatchResults.filter((r) => r.status === "failed").length;
    const mode = (context?.mode as string) || "full";
    const reason = (context?.reason as string) || "";

    const source = context?.metadata ? "context trigger" : "HALO loop";
    const modeLabel = mode === "light" ? " [LIGHT MODE]" : "";
    const reasonLabel = reason ? ` [${reason}]` : "";

    return `HALO cycle via ${source}${modeLabel}${reasonLabel}: ${issueCount} findings, ${tasks.length} tasks generated, ${dispatched} dispatched, ${failed} failed.`;
  }

  private createEmptyCycle(): HaloCycleResult {
    return {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      analysis: [],
      weakPoints: [],
      generatedTasks: [],
      dispatchResults: [],
      summary: "HALO loop has not completed a cycle yet.",
    };
  }
}

export const haloEngine = new HaloEngine();


