import { AgentStore } from "./store/agentStore";
import { ensureDefaultAgentsSeeded, recordAgentSuccess, recordAgentError, } from "./logic/healthUpdater";
import { runAgentRegistryCycle } from "./scheduler/agentScheduler";
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
export * from "./types";
export default AgentRegistryCore;
