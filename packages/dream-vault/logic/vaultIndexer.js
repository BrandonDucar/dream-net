import { VaultStore } from "../store/vaultStore";
export function rebuildVaultIndex() {
    const all = VaultStore.listAll();
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
        VaultStore.upsertIndex(entry);
    });
}
