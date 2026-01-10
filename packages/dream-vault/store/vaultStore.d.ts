import type { VaultItem, VaultIndexEntry, VaultStatus } from '../types.js';
export declare const VaultStore: {
    upsert(item: Omit<VaultItem, "createdAt" | "updatedAt" | "version">): VaultItem;
    get(id: string): VaultItem | undefined;
    listAll(): VaultItem[];
    upsertIndex(entry: VaultIndexEntry): void;
    getIndex(): Map<string, VaultIndexEntry>;
    status(lastRunAt: number | null): VaultStatus;
};
//# sourceMappingURL=vaultStore.d.ts.map