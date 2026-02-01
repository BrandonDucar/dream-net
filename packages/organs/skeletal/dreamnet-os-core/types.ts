export interface DreamNetVersionInfo {
  major: number;
  minor: number;
  patch: number;
  label?: string;            // e.g. "Tier IV Beta", "v0.4.0"
}

export interface SubsystemSummary {
  name: string;              // "DreamVault", "DreamShop", etc.
  status: "ok" | "warn" | "error" | "unknown";
  details?: string;
  lastUpdatedAt?: number;
}

export interface GlobalHealthScores {
  infraHealth: number;       // 0–1
  economyHealth: number;     // 0–1
  socialHealth: number;      // 0–1
  dreamPipelineHealth: number; // 0–1
}

export interface DreamNetOSSnapshot {
  version: DreamNetVersionInfo;
  heartbeatAt: number;
  globalHealth: GlobalHealthScores;
  subsystems: SubsystemSummary[];
}

export interface DreamNetOSContext {
  dreamVault?: any;
  dreamShop?: any;
  fieldLayer?: any;
  dreamBetCore?: any;
  zenGardenCore?: any;
  civicPanelCore?: any;
  dreamTankCore?: any;
  liquidityEngine?: any;
  socialHubCore?: any;
  initRitualCore?: any;
  economicEngineCore?: any;
  agentRegistryCore?: any;
  apiKeeperCore?: any;
  aiSeoCore?: any;
  shieldCore?: any;
  wolfPackFundingCore?: any;
  dreamStateCore?: any;
  spiderWebCore?: any;
  neuralMesh?: any;
  starBridgeLungs?: any;
  webhookNervousCore?: any;
  jaggyCore?: any;
  dreamSnailCore?: any;
}

export interface DreamNetOSStatus {
  lastRunAt: number | null;
  snapshot: DreamNetOSSnapshot;
}

