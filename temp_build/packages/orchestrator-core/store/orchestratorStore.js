"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorStore = void 0;
let lastCycle;
let totalCycles = 0;
exports.OrchestratorStore = {
    recordCycle(telemetry) {
        lastCycle = telemetry;
        totalCycles += 1;
    },
    status() {
        return {
            lastCycle,
            totalCycles,
        };
    },
};
