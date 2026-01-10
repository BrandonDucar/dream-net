"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIdentityCycle = runIdentityCycle;
exports.identityStatus = identityStatus;
const identityStore_1 = require("../store/identityStore");
const identityLinker_1 = require("../logic/identityLinker");
let lastRunAt = null;
function runIdentityCycle(ctx) {
    (0, identityLinker_1.syncIdentitiesFromContext)(ctx);
    lastRunAt = Date.now();
    const baseStatus = identityStore_1.IdentityStore.status();
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
function identityStatus() {
    const baseStatus = identityStore_1.IdentityStore.status();
    return {
        ...baseStatus,
        lastRunAt,
    };
}
