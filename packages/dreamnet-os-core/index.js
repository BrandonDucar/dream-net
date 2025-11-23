import { OSStore } from "./store/osStore";
import { runDreamNetOSCycle } from "./scheduler/osScheduler";
import { getActiveAlerts, getRecentAlerts, getHealthHistory, getHealthStats, detectTrends, resolveAlert, } from "./logic/heartbeatAlerts";
import { generateRecoveryActions } from "./logic/autoRecovery";
import { detectIntegrationGaps, autoFixIntegrationGaps, getIntegrationGaps, } from "./logic/autoIntegration";
export const DreamNetOSCore = {
    run(context) {
        return runDreamNetOSCycle(context);
    },
    status() {
        return OSStore.getStatus();
    },
    getSnapshot() {
        return OSStore.getStatus().snapshot;
    },
    // Alert system
    getActiveAlerts,
    getRecentAlerts,
    getHealthHistory,
    getHealthStats,
    detectTrends,
    resolveAlert,
    // Recovery system
    generateRecoveryActions,
    // Auto-integration system
    detectIntegrationGaps,
    autoFixIntegrationGaps,
    getIntegrationGaps,
};
export * from "./types";
export * from "./logic/heartbeatAlerts";
export * from "./logic/autoRecovery";
export * from "./logic/autoIntegration";
export default DreamNetOSCore;
