let engineInstance = null;
let isRegistered = false;
export function registerEventWormholeTrigger(engine) {
    engineInstance = engine;
    isRegistered = true;
    return {
        name: "eventWormholeTrigger",
        stop: () => {
            engineInstance = null;
            isRegistered = false;
        },
    };
}
export async function triggerHaloFromEvent(eventType, severity) {
    if (!engineInstance || !isRegistered) {
        return;
    }
    // Only trigger HALO for certain event types and severities
    const triggerEvents = [
        "squad.task.failed",
        "api.endpoint.failed",
        "graft.install.failed",
        "halo.weakpoint.critical",
    ];
    if (triggerEvents.includes(eventType) && (severity === "error" || severity === "critical")) {
        await engineInstance.runCycle("eventWormholeTrigger", {
            eventType,
            severity,
        });
    }
}
//# sourceMappingURL=eventWormholeTrigger.js.map