"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runVaultCycle = runVaultCycle;
exports.vaultStatus = vaultStatus;
const vaultStore_1 = require("../store/vaultStore");
const vaultIndexer_1 = require("../logic/vaultIndexer");
let lastRunAt = null;
function runVaultCycle(ctx) {
    // Rebuild index from current items
    (0, vaultIndexer_1.rebuildVaultIndex)();
    lastRunAt = Date.now();
    const status = vaultStore_1.VaultStore.status(lastRunAt);
    // Optional: write a narrative entry when vault changes
    if (ctx.narrativeField?.add && status.itemCount > 0) {
        ctx.narrativeField.add({
            id: `narrative-vault-${lastRunAt}`,
            timestamp: lastRunAt,
            title: "Dream Vault synchronized",
            summary: `Dream Vault currently tracks ${status.itemCount} items (${status.indexCount} indexed).`,
            severity: "info",
            domain: "dream",
            tags: ["vault", "library", "blueprints"],
            references: [],
        });
    }
    // Optional: store summary in NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "DreamVault",
            status,
            timestamp: lastRunAt,
        });
    }
    return status;
}
function vaultStatus() {
    return vaultStore_1.VaultStore.status(lastRunAt);
}
