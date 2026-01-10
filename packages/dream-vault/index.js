import { VaultStore } from './store/vaultStore.js';
import { runVaultCycle, vaultStatus } from './scheduler/vaultScheduler.js';
import { searchVault } from './logic/vaultSearch.js';
export const DreamVault = {
    upsertItem(item) {
        return VaultStore.upsert(item);
    },
    getItem(id) {
        return VaultStore.get(id);
    },
    listAll() {
        return VaultStore.listAll();
    },
    search(query) {
        return searchVault(query);
    },
    run(context) {
        return runVaultCycle(context);
    },
    status() {
        return vaultStatus();
    },
};
export * from './types.js';
export default DreamVault;
//# sourceMappingURL=index.js.map