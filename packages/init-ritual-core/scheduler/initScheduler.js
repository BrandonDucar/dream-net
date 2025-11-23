import { InitStore } from "../store/initStore";
import { ensureDefaultTemplateSeeded } from "../logic/ritualEngine";
export function runInitRitualCycle(ctx) {
    const now = Date.now();
    ensureDefaultTemplateSeeded();
    InitStore.setLastRunAt(now);
    const status = InitStore.status();
    // Optional: narrative entry summarizing initialization progress
    if (ctx.narrativeField?.add && status.activeIdentityCount > 0) {
        ctx.narrativeField.add({
            id: `narrative-init-${now}`,
            timestamp: now,
            title: "Initialization Cycle",
            summary: `Initialization flows tracked for ${status.activeIdentityCount} identities (${status.completedCount} completed).`,
            severity: "info",
            domain: "dream",
            tags: ["init", "onboarding"],
            references: status.sampleStates.map((s) => ({
                kind: "identity",
                id: s.identityId,
            })),
            meta: { status },
        });
    }
    // Optional: store in NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "InitRitualCore",
            activeIdentities: status.activeIdentityCount,
            completed: status.completedCount,
            timestamp: now,
        });
    }
    return status;
}
