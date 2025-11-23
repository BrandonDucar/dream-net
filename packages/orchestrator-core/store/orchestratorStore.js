let lastCycle;
let totalCycles = 0;
export const OrchestratorStore = {
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
