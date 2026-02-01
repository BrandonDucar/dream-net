import type {
  VaultItem,
  VaultItemKind,
  VaultState,
  VaultMetaRef,
  VaultSearchQuery,
  VaultIndexEntry,
  VaultContext,
  VaultStatus,
} from './types.js';
import { VaultStore } from './store/vaultStore.js';
import { runVaultCycle, vaultStatus } from './scheduler/vaultScheduler.js';
import { searchVault } from './logic/vaultSearch.js';

export const DreamVault = {
  upsertItem(item: Omit<VaultItem, "createdAt" | "updatedAt" | "version">): VaultItem {
    return VaultStore.upsert(item);
  },

  getItem(id: string): VaultItem | undefined {
    return VaultStore.get(id);
  },

  listAll(): VaultItem[] {
    return VaultStore.listAll();
  },

  search(query: VaultSearchQuery): VaultItem[] {
    return searchVault(query);
  },

  run(context: VaultContext): VaultStatus {
    return runVaultCycle(context);
  },

  status(): VaultStatus {
    return vaultStatus();
  },
};

export * from './types.js';
export default DreamVault;

