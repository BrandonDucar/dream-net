"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meshPulse = meshPulse;
exports.meshPulseBatch = meshPulseBatch;
const index_ts_1 = require("../event-wormholes/src/index.ts");
/**
 * Convert events into "synaptic spikes"
 * Normalize events into a shared schema
 * Emit pulses to the mesh
 */
async function meshPulse(event) {
    // Normalize event into synaptic spike schema
    const spike = {
        type: event.type ?? event.eventType ?? "generic",
        timestamp: event.timestamp ?? Date.now(),
        payload: event.payload ?? event,
        intensity: event.intensity ?? event.severity === "critical" ? 10 : event.severity === "error" ? 5 : 1,
        source: event.source ?? event.sourceType ?? "unknown",
        target: event.target ?? event.targetType,
    };
    // Emit to event wormholes if available
    try {
        await (0, index_ts_1.emitEvent)({
            sourceType: "system", // Use "system" as fallback for neural-mesh
            eventType: "mesh.pulse",
            severity: spike.intensity >= 5 ? "warning" : "info",
            payload: spike,
        });
    }
    catch {
        // Event wormholes might not be available
    }
    return spike;
}
/**
 * Batch pulse multiple events
 */
async function meshPulseBatch(events) {
    return Promise.all(events.map((event) => meshPulse(event)));
}
