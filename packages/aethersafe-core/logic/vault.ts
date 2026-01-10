
import { vectorStore } from "@dreamnet/memory-dna";

export class VaultController {

    /**
     * Creates a secure snapshot of the agent state.
     * Uses Vector Memory as the immutable ledger.
     */
    static async createSnapshot(agentId: string, state: any): Promise<string> {
        const snapshotId = `snap_${agentId}_${Date.now()}`;
        const protectedData = JSON.stringify(state);

        // In a real system, this would be encrypted.
        // We store it in the Vector Brain as a "backup" memory type.
        await vectorStore.addMemory(`[SNAPSHOT] ${snapshotId}`, {
            type: "BACKUP",
            agentId: agentId,
            payload: protectedData,
            timestamp: Date.now()
        });

        console.log(`🔒 [Aethersafe] Snapshot secured: ${snapshotId}`);
        return snapshotId;
    }

    /**
     * Retrieves the last known good state.
     */
    static async restoreSnapshot(agentId: string): Promise<any | null> {
        // Query the brain for backups
        const memories = await vectorStore.search(`[SNAPSHOT] snap_${agentId}`, 1);

        if (memories.length > 0) {
            const lastBackup = memories[0];
            console.log(`🔓 [Aethersafe] Restoring from: ${lastBackup.metadata.agentId}`);
            return JSON.parse(lastBackup.metadata.payload);
        }

        return null;
    }
}
