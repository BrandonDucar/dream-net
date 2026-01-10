import type { AgentConfig, AgentHealth, AgentRegistryContext, AgentRegistryStatus } from './types.js';
export declare const AgentRegistryCore: {
    ensureDefaultAgentsSeeded(): void;
    upsertAgentConfig(cfg: AgentConfig): AgentConfig;
    listAgentConfigs(): AgentConfig[];
    getAgentHealth(agentId: string): AgentHealth | undefined;
    listAgentHealth(): AgentHealth[];
    recordSuccess(agentId: string, latencyMs?: number): void;
    recordError(agentId: string, errorMessage: string): void;
    run(context: AgentRegistryContext): AgentRegistryStatus;
    status(): AgentRegistryStatus;
};
export * from './types.js';
export default AgentRegistryCore;
//# sourceMappingURL=index.d.ts.map