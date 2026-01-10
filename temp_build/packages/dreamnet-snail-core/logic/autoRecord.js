"use strict";
/**
 * Auto-Record Operational Events in Dream Snail
 * Biomimetic: All events leave a trail
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRecordOperationalEvent = autoRecordOperationalEvent;
exports.autoRecordAuditEvent = autoRecordAuditEvent;
exports.autoRecordPassportAction = autoRecordPassportAction;
const index_1 = require("../index");
/**
 * Auto-record operational events in Dream Snail
 */
function autoRecordOperationalEvent(event, identityId) {
    // Record event in Dream Snail trail
    index_1.DreamSnailCore.recordTrail(identityId, `operational:${event.type}`, {
        clusterId: event.clusterId,
        severity: event.severity,
        message: event.message,
        metadata: event.metadata,
    }, {
        source: "operational-bridge",
        system: "dreamnet",
        clusterId: event.clusterId,
        privacyLevel: event.severity === "critical" ? "private" : "public",
    });
}
/**
 * Auto-record audit events in Dream Snail
 */
function autoRecordAuditEvent(action, identityId, metadata) {
    index_1.DreamSnailCore.recordTrail(identityId, `audit:${action}`, metadata || {}, {
        source: "audit-core",
        system: "dreamnet",
        privacyLevel: "private", // Audit events are private by default
    });
}
/**
 * Auto-record passport actions in Dream Snail
 */
function autoRecordPassportAction(action, identityId, tier) {
    index_1.DreamSnailCore.recordTrail(identityId, `passport:${action}`, { tier }, {
        source: "dream-state",
        system: "dreamnet",
        privacyLevel: "public", // Passport actions are public
    });
}
