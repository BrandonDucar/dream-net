import { emitEvent } from "@dreamnet/event-wormholes";
/**
 * Convert events into "synaptic spikes"
 * Normalize events into a shared schema
 * Emit pulses to the mesh
 */
export async function meshPulse(event) {
    // Normalize event into synaptic spike schema
    const spike = {
        type: event.type ?? event.eventType ?? "generic",
        timestamp: event.timestamp ?? Date.now(),
        payload: event.payload ?? event,
        intensity: event.intensity ?? (event.severity === "critical" ? 10 : event.severity === "error" ? 5 : 1),
        source: event.source ?? event.sourceType ?? "unknown",
        target: event.target ?? event.targetType,
    };
    // Emit to event wormholes if available
    try {
        await emitEvent({
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
export async function meshPulseBatch(events) {
    return Promise.all(events.map((event) => meshPulse(event)));
}
//# sourceMappingURL=meshPulse.js.map