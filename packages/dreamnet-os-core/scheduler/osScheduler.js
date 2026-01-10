import { OSStore } from '../store/osStore.js';
import { buildOSSnapshot } from '../logic/osAggregator.js';
import { analyzeHeartbeat, getHealthStats } from '../logic/heartbeatAlerts.js';
import { generateRecoveryActions } from '../logic/autoRecovery.js';
import { detectIntegrationGaps, autoFixIntegrationGaps } from '../logic/autoIntegration.js';
import { notifyAlert } from '../logic/alertNotifier.js';
let previousSnapshot = null;
export function runDreamNetOSCycle(ctx) {
    const now = Date.now();
    const snapshot = buildOSSnapshot(ctx);
    // Analyze for alerts and trends
    const alerts = analyzeHeartbeat(snapshot, previousSnapshot);
    // Log and notify critical alerts
    const criticalAlerts = alerts.filter((a) => a.severity === "critical");
    const warningAlerts = alerts.filter((a) => a.severity === "warning");
    if (criticalAlerts.length > 0) {
        console.log(`🚨 [Heartbeat] ${criticalAlerts.length} critical alert(s) detected:`);
        criticalAlerts.forEach((alert) => {
            console.log(`   ⚠️  ${alert.message}`);
            notifyAlert(alert); // Send notification
        });
    }
    // Notify about warnings too
    warningAlerts.forEach((alert) => {
        notifyAlert(alert);
    });
    // Generate recovery actions for failed subsystems
    const failedSubsystems = snapshot.subsystems.filter((s) => s.status === "error");
    if (failedSubsystems.length > 0) {
        const recoveryActions = generateRecoveryActions(failedSubsystems);
        console.log(`🔧 [Heartbeat] ${recoveryActions.length} recovery action(s) suggested`);
        // Could auto-execute low-risk actions here
    }
    // Auto-detect and fix integration gaps
    const gaps = detectIntegrationGaps(ctx);
    if (gaps.length > 0) {
        console.log(`🔍 [Heartbeat] Detected ${gaps.length} integration gap(s)`);
        const fixResult = autoFixIntegrationGaps(ctx);
        if (fixResult.fixed.length > 0) {
            console.log(`✅ [Heartbeat] Auto-fixed ${fixResult.fixed.length} integration gap(s)`);
        }
        if (fixResult.failed.length > 0) {
            console.log(`⚠️  [Heartbeat] Failed to fix ${fixResult.failed.length} gap(s)`);
        }
    }
    // Store snapshot
    OSStore.setSnapshot(snapshot);
    OSStore.setLastRunAt(now);
    previousSnapshot = snapshot;
    // Optional: write a condensed summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const stats = getHealthStats();
        ctx.neuralMesh.remember({
            source: "DreamNetOSCore",
            heartbeatAt: snapshot.heartbeatAt,
            infraHealth: snapshot.globalHealth.infraHealth,
            economyHealth: snapshot.globalHealth.economyHealth,
            socialHealth: snapshot.globalHealth.socialHealth,
            dreamPipelineHealth: snapshot.globalHealth.dreamPipelineHealth,
            alerts: alerts.length,
            criticalAlerts: criticalAlerts.length,
            uptime: stats.uptime,
            timestamp: now,
        });
    }
    return OSStore.getStatus();
}
//# sourceMappingURL=osScheduler.js.map