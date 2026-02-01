import type {
  AgentKind,
  AgentState,
  AgentConfig,
  AgentHealth,
  AgentRegistryContext,
  AgentRegistryStatus,
} from './types.js';
import { AgentStore } from './store/agentStore.js';
import {
  ensureDefaultAgentsSeeded,
  recordAgentSuccess,
  recordAgentError,
} from './logic/healthUpdater.js';
import { runAgentRegistryCycle } from './scheduler/agentScheduler.js';

export const AgentRegistryCore = {
  // Config
  ensureDefaultAgentsSeeded() {
    ensureDefaultAgentsSeeded();
  },

  upsertAgentConfig(cfg: AgentConfig): AgentConfig {
    return AgentStore.upsertConfig(cfg);
  },

  listAgentConfigs(): AgentConfig[] {
    return AgentStore.listConfigs();
  },

  // Health
  getAgentHealth(agentId: string): AgentHealth | undefined {
    return AgentStore.getHealth(agentId);
  },

  listAgentHealth(): AgentHealth[] {
    return AgentStore.listHealth();
  },

  recordSuccess(agentId: string, latencyMs?: number) {
    return recordAgentSuccess(agentId, latencyMs);
  },

  recordError(agentId: string, errorMessage: string) {
    return recordAgentError(agentId, errorMessage);
  },

  // Orchestration
  run(context: AgentRegistryContext): AgentRegistryStatus {
    return runAgentRegistryCycle(context);
  },

  status(): AgentRegistryStatus {
    return AgentStore.status();
  },
};

export * from './types.js';
export default AgentRegistryCore;

