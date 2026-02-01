import { OSStore } from './store/osStore.js';
import { runDreamNetOSCycle } from './scheduler/osScheduler.js';
import { getActiveAlerts, getRecentAlerts, getHealthHistory, getHealthStats, detectTrends, resolveAlert, } from './logic/heartbeatAlerts.js';
import { generateRecoveryActions } from './logic/autoRecovery.js';
import { detectIntegrationGaps, autoFixIntegrationGaps, getIntegrationGaps, } from './logic/autoIntegration.js';
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
export * from './types.js';
export * from './src/bio-core.js';
export * from './logic/heartbeatAlerts.js';
export * from './logic/autoRecovery.js';
export * from './logic/autoIntegration.js';
export * from './logic/alertNotifier.js';
export default DreamNetOSCore;
//# sourceMappingURL=index.js.map