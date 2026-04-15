export type AgentKind =
  | "system"
  | "infra"
  | "swarm"
  | "governance"
  | "economy"
  | "social"
  | "game"
  | "wellness"
  | "init"
  | "other";

export type AgentState =
  | "idle"
  | "active"
  | "degraded"
  | "error"
  | "disabled";

export interface AgentConfig {
  id: string;                 // e.g. "agent:DreamOps", "agent:WolfPack"
  name: string;               // human-friendly label
  kind: AgentKind;
  description?: string;

  // Optional: what subsystem this agent belongs to
  subsystem?: string;         // e.g. "DreamVault", "FieldLayer", "DreamBetCore"

  // Optional: tags for filtering
  tags?: string[];
}

export interface AgentHealth {
  agentId: string;
  state: AgentState;

  lastRunAt?: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorMessage?: string;

  successCount: number;
  errorCount: number;
  avgLatencyMs?: number;

  // Optional: external trust/risk scores (e.g. from ReputationLattice/FieldLayer)
  trustScore?: number;        // 0–1
  riskScore?: number;         // 0–1

  updatedAt: number;
}

export interface AgentRegistryContext {
  fieldLayer?: any;
  reputationLattice?: any;
  narrativeField?: any;
  neuralMesh?: any;
}

export interface AgentRegistryStatus {
  lastRunAt: number | null;
  agentCount: number;
  activeCount: number;
  degradedCount: number;
  errorCount: number;
  sampleAgents: Array<{
    config: AgentConfig;
    health: AgentHealth;
  }>;
}

