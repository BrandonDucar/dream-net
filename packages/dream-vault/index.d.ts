import type { VaultItem, VaultSearchQuery, VaultContext, VaultStatus } from './types.js';
export declare const DreamVault: {
    upsertItem(item: Omit<VaultItem, "createdAt" | "updatedAt" | "version">): VaultItem;
    getItem(id: string): VaultItem | undefined;
    listAll(): VaultItem[];
    search(query: VaultSearchQuery): VaultItem[];
    run(context: VaultContext): VaultStatus;
    status(): VaultStatus;
};
export * from './types.js';
export default DreamVault;
//# sourceMappingURL=index.d.ts.map