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
    droneTelemetry?: any;
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
    droneId?: string;
    droneStatus?: 'docked' | 'patrol' | 'combat' | 'recharging';

    // Main execution function
    run(input: TInput, ctx: AgentInvocationContext): Promise<TOutput>;

    // Optional lifecycle hooks
    initialize?(): Promise<void>;
    shutdown?(): Promise<void>;

    // Avenue 19: Aesthetic hook
    // Allows any agent to emit "Art Residue" based on its own internal logic/input/output
    getAestheticSnapshot?(input: TInput, output: TOutput, ctx: AgentInvocationContext): Promise<{
        title: string;
        description: string;
        metadata?: any;
    } | null>;
}
