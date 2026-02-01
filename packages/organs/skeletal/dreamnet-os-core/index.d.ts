import type { DreamNetOSSnapshot, DreamNetOSContext, DreamNetOSStatus } from './types.js';
import { getActiveAlerts, getRecentAlerts, getHealthHistory, getHealthStats, detectTrends, resolveAlert } from './logic/heartbeatAlerts.js';
import { generateRecoveryActions } from './logic/autoRecovery.js';
import { detectIntegrationGaps, autoFixIntegrationGaps, getIntegrationGaps } from './logic/autoIntegration.js';
export declare const DreamNetOSCore: {
    run(context: DreamNetOSContext): DreamNetOSStatus;
    status(): DreamNetOSStatus;
    getSnapshot(): DreamNetOSSnapshot;
    getActiveAlerts: typeof getActiveAlerts;
    getRecentAlerts: typeof getRecentAlerts;
    getHealthHistory: typeof getHealthHistory;
    getHealthStats: typeof getHealthStats;
    detectTrends: typeof detectTrends;
    resolveAlert: typeof resolveAlert;
    generateRecoveryActions: typeof generateRecoveryActions;
    detectIntegrationGaps: typeof detectIntegrationGaps;
    autoFixIntegrationGaps: typeof autoFixIntegrationGaps;
    getIntegrationGaps: typeof getIntegrationGaps;
};
export * from './types.js';
export * from './src/bio-core.js';
export * from './logic/heartbeatAlerts.js';
export * from './logic/autoRecovery.js';
export * from './logic/autoIntegration.js';
export * from './logic/alertNotifier.js';
export default DreamNetOSCore;
//# sourceMappingURL=index.d.ts.map