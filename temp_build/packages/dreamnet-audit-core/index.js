"use strict";
/**
 * DreamNet Audit Core
 * Complete audit trail system
 */
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamNetAuditCore = void 0;
const auditStore_1 = require("./store/auditStore");
exports.DreamNetAuditCore = {
    /**
     * Record an audit log entry
     */
    recordAction(action, details, context) {
        const log = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            timestamp: Date.now(),
            action,
            details,
            success: context?.success !== false,
            ...context,
        };
        auditStore_1.auditStore.recordLog(log);
        // Auto-record in Dream Snail
        const identityId = context?.userId || context?.walletAddress || "system";
        Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-snail-core/logic/autoRecord"))).then(({ autoRecordAuditEvent }) => {
            autoRecordAuditEvent(action, identityId, { ...details, ...context });
        })
            .catch(() => { });
        return log;
    },
    /**
     * Query audit logs
     */
    queryLogs(query) {
        return auditStore_1.auditStore.queryLogs(query);
    },
    /**
     * Get audit statistics
     */
    getStats() {
        return auditStore_1.auditStore.getStats();
    },
    /**
     * Export audit logs (for compliance reports)
     */
    exportLogs(query) {
        return auditStore_1.auditStore.exportLogs(query);
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamNetAuditCore;
