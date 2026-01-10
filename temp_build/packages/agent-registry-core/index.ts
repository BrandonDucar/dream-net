import type {
  AgentKind,
  AgentState,
  AgentConfig,
  AgentHealth,
  AgentRegistryContext,
  AgentRegistryStatus,
} from "./types";
import { AgentStore } from "./store/agentStore";
import {
  ensureDefaultAgentsSeeded,
  recordAgentSuccess,
  recordAgentError,
} from "./logic/healthUpdater";
import { runAgentRegistryCycle } from "./scheduler/agentScheduler";

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

export * from "./types";
export default AgentRegistryCore;

