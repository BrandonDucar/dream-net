export interface RuntimeContext {
  // Core subsystems
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

  // Shared infra
  IdentityGrid?: any;
  ReputationLattice?: any;
  NarrativeField?: any;
  NeuralMesh?: any;

  // Orchestrator
  OrchestratorCore?: any;
}

export interface RuntimeSnapshot {
  lastCycleAt: number | null;
  lastCycleDurationMs: number | null;
  lastCycleError?: string;

  osStatus?: any;         // DreamNetOSCore.status()
  civicStatus?: any;      // CivicPanelCore.status()
  econStatus?: any;       // EconomicEngineCore.status()
}

export interface RuntimeBridgeStatus {
  initialized: boolean;
  snapshots: RuntimeSnapshot;
}

