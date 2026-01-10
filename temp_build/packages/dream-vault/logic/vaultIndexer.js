"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildVaultIndex = rebuildVaultIndex;
const vaultStore_1 = require("../store/vaultStore");
function rebuildVaultIndex() {
    const all = vaultStore_1.VaultStore.listAll();
    all.forEach((item) => {
        const entry = {
            id: item.id,
            kind: item.kind,
            state: item.state,
            title: item.title,
            tags: item.tags ?? [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
        vaultStore_1.VaultStore.upsertIndex(entry);
    });
}
