export type AgentId = string;

export interface AgentInvocationContext {
    // High-level ambient context
    tenantId?: string;
    userId?: string;
    sessionId?: string;
    requestId: string;
    timestamp: string;

    // DreamHub snapshot reference
    dreamHubSnapshotId?: string;

    // Guardian Framework status
    guardianStatus?: any;
}

export interface AgentResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    logs?: string[];
    executionTimeMs?: number;
}

export interface Agent<TInput = unknown, TOutput = unknown> {
    id: AgentId;
    name: string;
    description: string;
    category: 'core' | 'analysis' | 'monitoring' | 'action' | 'utility';
    version: string;

    // Main execution function
    run(input: TInput, ctx: AgentInvocationContext): Promise<TOutput>;

    // Optional lifecycle hooks
    initialize?(): Promise<void>;
    shutdown?(): Promise<void>;
}
