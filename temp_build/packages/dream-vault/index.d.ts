import type { VaultItem, VaultSearchQuery, VaultContext, VaultStatus } from "./types";
export declare const DreamVault: {
    upsertItem(item: Omit<VaultItem, "createdAt" | "updatedAt" | "version">): VaultItem;
    getItem(id: string): VaultItem | undefined;
    listAll(): VaultItem[];
    search(query: VaultSearchQuery): VaultItem[];
    run(context: VaultContext): VaultStatus;
    status(): VaultStatus;
};
export * from "./types";
export default DreamVault;
