import type { Agent, AgentContext, AgentResult, AgentRunInput } from "./types";
import { DreamKeeperAgent } from "./agents/dreamkeeper";
import { DeployKeeperAgent } from "./agents/deploykeeper";
import { RelayBotAgent } from "./agents/relaybot";
import { EnvKeeperAgent } from "./agents/envkeeper";
import NeuralMesh from "../../packages/neural-mesh";
import QuantumAnticipation from "../../packages/quantum-anticipation";
import SquadAlchemy from "../../packages/squad-alchemy";
import WolfPack from "../../packages/wolf-pack";
import OctopusExecutor from "../../packages/octopus-executor";
import SlugTimeMemory from "../../packages/slug-time-memory";
import StarBridgeLungs from "../../packages/star-bridge-lungs";
import PredatorScavengerLoop from "../../packages/predator-scavenger";
import DreamCortex from "../../packages/dream-cortex";
import ReputationLattice from "../../packages/reputation-lattice";
import NarrativeField from "../../packages/narrative-field";
import IdentityGrid from "../../packages/identity-grid";
import DreamVault from "../../packages/dream-vault";
import DreamShop from "../../packages/dream-shop";
import FieldLayer from "../../packages/field-layer";
import DreamBetCore from "../../packages/dreambet-core";
import ZenGardenCore from "../../packages/zen-garden-core";
import CivicPanelCore from "../../packages/civic-panel-core";
import DreamTankCore from "../../packages/dream-tank-core";
import LiquidityEngine from "../../packages/liquidity-engine";
import SocialHubCore from "../../packages/social-hub-core";
import InitRitualCore from "../../packages/init-ritual-core";
import EconomicEngineCore from "../../packages/economic-engine-core";
import AgentRegistryCore from "../../packages/agent-registry-core";
import DreamNetOSCore from "../../packages/dreamnet-os-core";
import OrchestratorCore from "../../packages/orchestrator-core";
import RuntimeBridgeCore from "../../packages/runtime-bridge-core";
import WolfPackFundingCore from "../../packages/wolfpack-funding-core";
import WolfPackMailerCore from "../../packages/wolfpack-mailer-core";

export class DreamNetOS {
  private registry: Map<string, Agent> = new Map();
  public neuralMesh = NeuralMesh;
  public quantumAnticipation = QuantumAnticipation;
  public squadAlchemy = SquadAlchemy;
  public wolfPack = WolfPack;
  public octopusExecutor = OctopusExecutor;
  public slugTimeMemory = SlugTimeMemory;
  public starBridgeLungs = StarBridgeLungs;
  public predatorScavengerLoop = PredatorScavengerLoop;
  public dreamCortex = DreamCortex;
  public reputationLattice = ReputationLattice;
  public narrativeField = NarrativeField;
  public identityGrid = IdentityGrid;
  public dreamVault = DreamVault;
  public dreamShop = DreamShop;
  public fieldLayer = FieldLayer;
  public dreamBetCore = DreamBetCore;
  public zenGardenCore = ZenGardenCore;
  public civicPanelCore = CivicPanelCore;
  public dreamTankCore = DreamTankCore;
  public liquidityEngine = LiquidityEngine;
  public socialHubCore = SocialHubCore;
  public initRitualCore = InitRitualCore;
  public economicEngineCore = EconomicEngineCore;
  public agentRegistryCore = AgentRegistryCore;
  public dreamNetOSCore = DreamNetOSCore;
  public orchestratorCore = OrchestratorCore;
  public runtimeBridgeCore = RuntimeBridgeCore;
  public wolfPackFundingCore = WolfPackFundingCore;
  public wolfPackMailerCore = WolfPackMailerCore;

  constructor() {
    [DreamKeeperAgent, DeployKeeperAgent, RelayBotAgent, EnvKeeperAgent].forEach((a) =>
      this.registry.set(a.name, a),
    );

    // Initialize Neural Mesh with subsystems
    this.initializeNeuralMesh();
  }

  private initializeNeuralMesh(): void {
    try {
      // Link subsystems via Neural Mesh
      NeuralMesh.link({
        swarm: {
          onPulse: async (event: any) => {
            // Swarm system pulse handler
            console.log("[NeuralMesh] Swarm pulse:", event);
          },
        },
        governance: {
          onPulse: async (event: any) => {
            // Governance system pulse handler
            console.log("[NeuralMesh] Governance pulse:", event);
          },
        },
        wormholes: {
          onPulse: async (event: any) => {
            // Wormholes system pulse handler
            console.log("[NeuralMesh] Wormholes pulse:", event);
          },
        },
        routing: {
          onPulse: async (event: any) => {
            // Routing system pulse handler
            console.log("[NeuralMesh] Routing pulse:", event);
          },
        },
        haloLoop: {
          onPulse: async (event: any) => {
            // Halo-Loop system pulse handler
            console.log("[NeuralMesh] Halo-Loop pulse:", event);
          },
        },
      });

      console.log("[DreamNetOS] Neural Mesh initialized");
    } catch (error) {
      console.warn("[DreamNetOS] Neural Mesh initialization failed:", error);
    }
  }

  listAgents() {
    return Array.from(this.registry.values()).map((a) => ({
      name: a.name,
      description: a.description,
    }));
  }

  async runAgent(input: AgentRunInput): Promise<AgentResult> {
    const agent = this.registry.get(input.agent.toLowerCase());
    if (!agent) {
      return { ok: false, agent: input.agent, error: "Unknown agent" };
    }
    const ctx: AgentContext = {
      log: (message, extra) => {
        // eslint-disable-next-line no-console
        console.log("[DreamNetOS]", message, extra ?? "");
      },
      env: process.env,
    };
    return agent.run(ctx, input.input);
  }
}

export const dreamNetOS = new DreamNetOS();


