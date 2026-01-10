import { listWormholes } from './wormholeRegistry.js';
const SEVERITY_ORDER = {
    info: 0,
    warning: 1,
    error: 2,
    critical: 3,
};
function matchesSeverity(event, minSeverity) {
    if (!minSeverity)
        return true;
    return SEVERITY_ORDER[event.severity] >= SEVERITY_ORDER[minSeverity];
}
function matchesWormhole(event, wormhole) {
    if (!wormhole.enabled)
        return false;
    if (wormhole.from.sourceType !== event.sourceType)
        return false;
    if (wormhole.from.eventType !== event.eventType)
        return false;
    if (!matchesSeverity(event, wormhole.filters?.minSeverity))
        return false;
    return true;
}
async function createSuggestedTask(event, wormhole) {
    const { createTask } = await import("@dreamnet/squad-builder");
    // Special handling for heartbeat.lost events
    if (event.eventType === "heartbeat.lost") {
        createTask({
            type: "infra.repair.suggested",
            status: "pending-approval",
            payload: {
                reason: "heartbeat.lost",
                lastUpdated: event.payload?.lastUpdated ?? null,
                hint: "restart service / check health endpoints",
                eventId: event.id,
                consecutiveFailures: event.payload?.consecutiveFailures ?? 0,
            },
        });
    }
    else {
        createTask({
            type: "wormhole.suggested",
            status: "pending-approval",
            payload: {
                eventId: event.id,
                eventType: event.eventType,
                sourceType: event.sourceType,
                sourceId: event.sourceId,
                originalPayload: event.payload,
                suggestedTargetRole: wormhole.to.targetAgentRole,
            },
        });
    }
}
export async function processEvent(event) {
    const wormholes = listWormholes();
    const matching = wormholes.filter((w) => matchesWormhole(event, w));
    // Trigger HALO Loop for critical events
    if (event.severity === "critical" || event.severity === "error") {
        // Phase 2: HALO Loop should subscribe to event bus instead of direct call
        // to avoid circular dependencies.
        console.log(`[EventWormholes] Critical event detected: ${event.eventType}. Triggering system-wide HALO response.`);
    }
    for (const wormhole of matching) {
        if (wormhole.to.actionType === "log") {
            // Already logged via eventBus
            continue;
        }
        else if (wormhole.to.actionType === "notify") {
            // Phase 2: RelayBot integration
            // TODO: Implement notification system
            console.log(`[EventWormholes] Notify action for event ${event.id} via wormhole ${wormhole.id}`);
        }
        else if (wormhole.to.actionType === "create-task") {
            // Phase 1: Create suggested task (requires approval)
            await createSuggestedTask(event, wormhole);
        }
    }
}
//# sourceMappingURL=wormholeEngine.js.map