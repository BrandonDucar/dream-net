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
exports.DreamNetOSCore = void 0;
const osStore_1 = require("./store/osStore");
const osScheduler_1 = require("./scheduler/osScheduler");
const heartbeatAlerts_1 = require("./logic/heartbeatAlerts");
const autoRecovery_1 = require("./logic/autoRecovery");
const autoIntegration_1 = require("./logic/autoIntegration");
exports.DreamNetOSCore = {
    run(context) {
        return (0, osScheduler_1.runDreamNetOSCycle)(context);
    },
    status() {
        return osStore_1.OSStore.getStatus();
    },
    getSnapshot() {
        return osStore_1.OSStore.getStatus().snapshot;
    },
    // Alert system
    getActiveAlerts: heartbeatAlerts_1.getActiveAlerts,
    getRecentAlerts: heartbeatAlerts_1.getRecentAlerts,
    getHealthHistory: heartbeatAlerts_1.getHealthHistory,
    getHealthStats: heartbeatAlerts_1.getHealthStats,
    detectTrends: heartbeatAlerts_1.detectTrends,
    resolveAlert: heartbeatAlerts_1.resolveAlert,
    // Recovery system
    generateRecoveryActions: autoRecovery_1.generateRecoveryActions,
    // Auto-integration system
    detectIntegrationGaps: autoIntegration_1.detectIntegrationGaps,
    autoFixIntegrationGaps: autoIntegration_1.autoFixIntegrationGaps,
    getIntegrationGaps: autoIntegration_1.getIntegrationGaps,
};
__exportStar(require("./types"), exports);
__exportStar(require("./logic/heartbeatAlerts"), exports);
__exportStar(require("./logic/autoRecovery"), exports);
__exportStar(require("./logic/autoIntegration"), exports);
exports.default = exports.DreamNetOSCore;
