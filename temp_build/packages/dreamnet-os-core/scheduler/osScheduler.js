"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDreamNetOSCycle = runDreamNetOSCycle;
const osStore_1 = require("../store/osStore");
const osAggregator_1 = require("../logic/osAggregator");
const heartbeatAlerts_1 = require("../logic/heartbeatAlerts");
const autoRecovery_1 = require("../logic/autoRecovery");
const autoIntegration_1 = require("../logic/autoIntegration");
const alertNotifier_1 = require("../logic/alertNotifier");
let previousSnapshot = null;
function runDreamNetOSCycle(ctx) {
    const now = Date.now();
    const snapshot = (0, osAggregator_1.buildOSSnapshot)(ctx);
    // Analyze for alerts and trends
    const alerts = (0, heartbeatAlerts_1.analyzeHeartbeat)(snapshot, previousSnapshot);
    // Log and notify critical alerts
    const criticalAlerts = alerts.filter((a) => a.severity === "critical");
    const warningAlerts = alerts.filter((a) => a.severity === "warning");
    if (criticalAlerts.length > 0) {
        console.log(`🚨 [Heartbeat] ${criticalAlerts.length} critical alert(s) detected:`);
        criticalAlerts.forEach((alert) => {
            console.log(`   ⚠️  ${alert.message}`);
            (0, alertNotifier_1.notifyAlert)(alert); // Send notification
        });
    }
    // Notify about warnings too
    warningAlerts.forEach((alert) => {
        (0, alertNotifier_1.notifyAlert)(alert);
    });
    // Generate recovery actions for failed subsystems
    const failedSubsystems = snapshot.subsystems.filter((s) => s.status === "error");
    if (failedSubsystems.length > 0) {
        const recoveryActions = (0, autoRecovery_1.generateRecoveryActions)(failedSubsystems);
        console.log(`🔧 [Heartbeat] ${recoveryActions.length} recovery action(s) suggested`);
        // Could auto-execute low-risk actions here
    }
    // Auto-detect and fix integration gaps
    const gaps = (0, autoIntegration_1.detectIntegrationGaps)(ctx);
    if (gaps.length > 0) {
        console.log(`🔍 [Heartbeat] Detected ${gaps.length} integration gap(s)`);
        const fixResult = (0, autoIntegration_1.autoFixIntegrationGaps)(ctx);
        if (fixResult.fixed.length > 0) {
            console.log(`✅ [Heartbeat] Auto-fixed ${fixResult.fixed.length} integration gap(s)`);
        }
        if (fixResult.failed.length > 0) {
            console.log(`⚠️  [Heartbeat] Failed to fix ${fixResult.failed.length} gap(s)`);
        }
    }
    // Store snapshot
    osStore_1.OSStore.setSnapshot(snapshot);
    osStore_1.OSStore.setLastRunAt(now);
    previousSnapshot = snapshot;
    // Optional: write a condensed summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const stats = (0, heartbeatAlerts_1.getHealthStats)();
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
    return osStore_1.OSStore.getStatus();
}
