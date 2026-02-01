import { AgentStore } from './store/agentStore.js';
import { ensureDefaultAgentsSeeded, recordAgentSuccess, recordAgentError, } from './logic/healthUpdater.js';
import { runAgentRegistryCycle } from './scheduler/agentScheduler.js';
export const AgentRegistryCore = {
    // Config
    ensureDefaultAgentsSeeded() {
        ensureDefaultAgentsSeeded();
    },
    upsertAgentConfig(cfg) {
        return AgentStore.upsertConfig(cfg);
    },
    listAgentConfigs() {
        return AgentStore.listConfigs();
    },
    // Health
    getAgentHealth(agentId) {
        return AgentStore.getHealth(agentId);
    },
    listAgentHealth() {
        return AgentStore.listHealth();
    },
    recordSuccess(agentId, latencyMs) {
        return recordAgentSuccess(agentId, latencyMs);
    },
    recordError(agentId, errorMessage) {
        return recordAgentError(agentId, errorMessage);
    },
    // Orchestration
    run(context) {
        return runAgentRegistryCycle(context);
    },
    status() {
        return AgentStore.status();
    },
};
export * from './types.js';
export default AgentRegistryCore;
//# sourceMappingURL=index.js.map