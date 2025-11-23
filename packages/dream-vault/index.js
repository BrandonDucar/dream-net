import { VaultStore } from "./store/vaultStore";
import { runVaultCycle, vaultStatus } from "./scheduler/vaultScheduler";
import { searchVault } from "./logic/vaultSearch";
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
export * from "./types";
export default DreamVault;
