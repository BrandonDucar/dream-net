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
exports.OrchestratorCore = void 0;
const runCycle_1 = require("./logic/runCycle");
const orchestratorStore_1 = require("./store/orchestratorStore");
exports.OrchestratorCore = {
    async runSingleCycle(context) {
        const status = orchestratorStore_1.OrchestratorStore.status();
        const nextCycleId = (status.totalCycles ?? 0) + 1;
        return (0, runCycle_1.runCycle)(context, nextCycleId);
    },
    getStatus() {
        return orchestratorStore_1.OrchestratorStore.status();
    },
    /**
     * Convenience helper: run cycles on a fixed interval.
     * Caller is responsible for holding and clearing the interval.
     */
    startIntervalLoop(context, intervalMs) {
        return setInterval(() => {
            void exports.OrchestratorCore.runSingleCycle(context);
        }, intervalMs);
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.OrchestratorCore;
