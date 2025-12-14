import type { Agent, AgentContext, AgentResult, AgentRunInput } from "./types";
import { DreamKeeperAgent } from "./agents/dreamkeeper";
import { DeployKeeperAgent } from "./agents/deploykeeper";
import { RelayBotAgent } from "./agents/relaybot";
import { EnvKeeperAgent } from "./agents/envkeeper";
import { OpenAIReActAgent } from "./agents/openai-react-agent";
import { OpenAIAssistantAgent } from "./agents/openai-assistant-agent";
import { OpenAICodeAgent } from "./agents/openai-code-agent";
import { loadAllGPTAgents } from "./agents/gpt-agent-factory";
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

// 19 New Integration Packages
import { DreamNetLangChainBridge } from "@dreamnet/agent-langchain";
import { CrewAICrewOrchestrator } from "@dreamnet/agent-crewai";
import { SuperAGIMarketplace } from "@dreamnet/agent-superagi";
import { LensProtocolClient } from "@dreamnet/social-lens";
import { FarcasterClient } from "@dreamnet/social-farcaster";
import { JellyfinMediaServer } from "@dreamnet/media-jellyfin";
import { PeerTubeClient } from "@dreamnet/media-peertube";
import { ResearchHubClient } from "@dreamnet/research-researchhub";
import { DeSciProtocols } from "@dreamnet/research-desci";
import { OpenTripPlannerClient } from "@dreamnet/travel-opentripplanner";
import { ValhallaRouter } from "@dreamnet/travel-valhalla";
import { GhidraSecurityAnalyzer } from "@dreamnet/security-ghidra";
import { MetasploitFramework } from "@dreamnet/security-metasploit";
import { AragonGovernanceClient } from "@dreamnet/governance-aragon";
import { SnapshotVoting } from "@dreamnet/governance-snapshot";
import { MusicGenClient } from "@dreamnet/music-musicgen";
import { MusicLMClient } from "@dreamnet/music-musiclm";
import { MatrixFederationClient } from "@dreamnet/chat-matrix";
import { RocketChatClient } from "@dreamnet/chat-rocketchat";

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
  public citadelCore?: any;

  // 19 New Integration Packages
  public langChainBridge?: DreamNetLangChainBridge;
  public crewAICrewOrchestrator?: CrewAICrewOrchestrator;
  public superAGIMarketplace?: SuperAGIMarketplace;
  public lensProtocolClient?: LensProtocolClient;
  public farcasterClient?: FarcasterClient;
  public jellyfinMediaServer?: JellyfinMediaServer;
  public peerTubeClient?: PeerTubeClient;
  public researchHubClient?: ResearchHubClient;
  public deSciProtocols?: DeSciProtocols;
  public openTripPlannerClient?: OpenTripPlannerClient;
  public valhallaRouter?: ValhallaRouter;
  public ghidraSecurityAnalyzer?: GhidraSecurityAnalyzer;
  public metasploitFramework?: MetasploitFramework;
  public aragonGovernanceClient?: AragonGovernanceClient;
  public snapshotVoting?: SnapshotVoting;
  public musicGenClient?: MusicGenClient;
  public musicLMClient?: MusicLMClient;
  public matrixFederationClient?: MatrixFederationClient;
  public rocketChatClient?: RocketChatClient;

  constructor() {
    // Core agents
    [
      DreamKeeperAgent, 
      DeployKeeperAgent, 
      RelayBotAgent, 
      EnvKeeperAgent,
      OpenAIReActAgent,
      OpenAIAssistantAgent,
      OpenAICodeAgent
    ].forEach((a) =>
      this.registry.set(a.name, a),
    );

    // Load all GPT agents from registry.json
    try {
      const gptAgents = loadAllGPTAgents();
      for (const agent of gptAgents) {
        this.registry.set(agent.name, agent);
      }
      console.log(`✅ [DreamNet OS] Loaded ${gptAgents.length} GPT agents`);
    } catch (error: any) {
      console.warn(`⚠️ [DreamNet OS] Failed to load GPT agents: ${error.message}`);
    }

    // Initialize Neural Mesh with subsystems
    this.initializeNeuralMesh();
  }

  private initializeNeuralMesh(): void {
    try {
      // Skip Neural Mesh for minimal startup - will add in Layer 6
      if (!NeuralMesh || typeof NeuralMesh.link !== 'function') {
        console.log("[DreamNetOS] Neural Mesh skipped - not available for minimal startup");
        return;
      }
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

// Lazy initialization - only create when accessed
// This allows minimal server startup without loading all subsystems
let _dreamNetOSInstance: DreamNetOS | null = null;

export function getDreamNetOS(): DreamNetOS {
  if (!_dreamNetOSInstance) {
    _dreamNetOSInstance = new DreamNetOS();
  }
  return _dreamNetOSInstance;
}

// Export for backward compatibility, but it's now lazy
export const dreamNetOS = new Proxy({} as DreamNetOS, {
  get(_target, prop) {
    return getDreamNetOS()[prop as keyof DreamNetOS];
  }
});


