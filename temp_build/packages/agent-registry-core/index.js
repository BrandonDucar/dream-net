"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRegistryCore = void 0;
const agentStore_1 = require("./store/agentStore");
const healthUpdater_1 = require("./logic/healthUpdater");
const agentScheduler_1 = require("./scheduler/agentScheduler");
exports.AgentRegistryCore = {
    // Config
    ensureDefaultAgentsSeeded() {
        (0, healthUpdater_1.ensureDefaultAgentsSeeded)();
    },
    upsertAgentConfig(cfg) {
        return agentStore_1.AgentStore.upsertConfig(cfg);
    },
    listAgentConfigs() {
        return agentStore_1.AgentStore.listConfigs();
    },
    // Health
    getAgentHealth(agentId) {
        return agentStore_1.AgentStore.getHealth(agentId);
    },
    listAgentHealth() {
        return agentStore_1.AgentStore.listHealth();
    },
    recordSuccess(agentId, latencyMs) {
        return (0, healthUpdater_1.recordAgentSuccess)(agentId, latencyMs);
    },
    recordError(agentId, errorMessage) {
        return (0, healthUpdater_1.recordAgentError)(agentId, errorMessage);
    },
    // Orchestration
    run(context) {
        return (0, agentScheduler_1.runAgentRegistryCycle)(context);
    },
    status() {
        return agentStore_1.AgentStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.AgentRegistryCore;
