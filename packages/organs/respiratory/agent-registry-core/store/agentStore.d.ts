import type { AgentConfig, AgentHealth, AgentRegistryStatus } from '../types.js';
export declare const AgentStore: {
    upsertConfig(cfg: AgentConfig): AgentConfig;
    getConfig(id: string): AgentConfig | undefined;
    listConfigs(): AgentConfig[];
    upsertHealth(health: AgentHealth): AgentHealth;
    getHealth(agentId: string): AgentHealth | undefined;
    listHealth(): AgentHealth[];
    setLastRunAt(ts: number | null): void;
    status(): AgentRegistryStatus;
};
//# sourceMappingURL=agentStore.d.ts.map