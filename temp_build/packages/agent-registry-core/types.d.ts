export type AgentKind = "system" | "infra" | "swarm" | "governance" | "economy" | "social" | "game" | "wellness" | "init" | "other";
export type AgentState = "idle" | "active" | "degraded" | "error" | "disabled";
export interface AgentConfig {
    id: string;
    name: string;
    kind: AgentKind;
    description?: string;
    subsystem?: string;
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
    trustScore?: number;
    riskScore?: number;
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
