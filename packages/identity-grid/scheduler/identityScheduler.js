import { IdentityStore } from "../store/identityStore";
import { syncIdentitiesFromContext } from "../logic/identityLinker";
let lastRunAt = null;
export function runIdentityCycle(ctx) {
    syncIdentitiesFromContext(ctx);
    lastRunAt = Date.now();
    const baseStatus = IdentityStore.status();
    const status = {
        ...baseStatus,
        lastRunAt,
    };
    // Optional: push into Neural Mesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "IdentityGrid",
            nodeCount: status.nodeCount,
            edgeCount: status.edgeCount,
            timestamp: lastRunAt,
        });
    }
    return status;
}
export function identityStatus() {
    const baseStatus = IdentityStore.status();
    return {
        ...baseStatus,
        lastRunAt,
    };
}
