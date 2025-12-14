export interface OrchestratorContext {
  // Injected subsystems (usually imported from core exports)
  DreamVault?: any;
  DreamShop?: any;
  FieldLayer?: any;
  DreamBetCore?: any;
  ZenGardenCore?: any;
  CivicPanelCore?: any;
  DreamTankCore?: any;
  LiquidityEngine?: any;
  SocialHubCore?: any;
  InitRitualCore?: any;
  EconomicEngineCore?: any;
  AgentRegistryCore?: any;
  DreamNetOSCore?: any;
  WolfPackFundingCore?: any;
  WolfPackAnalystCore?: any;
  CitadelCore?: any;

  // Shared objects
  IdentityGrid?: any;
  ReputationLattice?: any;
  NarrativeField?: any;
  NeuralMesh?: any;

  // Latent Collaboration
  LatentCollaboration?: {
    run: (context: any) => Promise<void>;
  };
  AgentWalletManager?: any;

  // Optional Tier II/III subsystems (for FieldLayer context)
  QuantumAnticipation?: any;
  SlugTimeMemory?: any;
  StarBridgeLungs?: any;
  DreamCortex?: any;
  WolfPack?: any;
  PredatorScavengerLoop?: any;
}

export interface CycleTelemetry {
  cycleId: number;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  error?: string;
}

export interface OrchestratorStatus {
  lastCycle?: CycleTelemetry;
  totalCycles: number;
}

