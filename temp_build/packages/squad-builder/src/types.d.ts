export type AgentRole = "DreamOps" | "DeployKeeper" | "BuildKeeper" | "EnvKeeper" | "ConnectorBot" | "DreamKeeper" | "RelayBot" | "NarrativeWeaver" | "GraftBuilder" | "Custom";
export interface AgentModel {
    id: string;
    name: string;
    role: AgentRole;
    description?: string;
    capabilities: string[];
    config?: Record<string, unknown>;
    isOnline: boolean;
    lastSeen: Date;
}
export interface SquadModel {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    agents: AgentModel[];
    activeTaskId: string | null;
}
export type TaskStatus = "pending" | "running" | "success" | "failed" | "suggested" | "pending-approval";
export interface TaskModel {
    id: string;
    squadId?: string;
    type: string;
    payload: Record<string, unknown>;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    logs: string[];
    assignedAgent?: string;
}
export interface MessageModel {
    id: string;
    fromAgent: string;
    toAgent: string;
    content: Record<string, unknown>;
    timestamp: Date;
}
