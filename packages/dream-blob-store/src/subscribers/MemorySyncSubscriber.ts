
import { NERVE_BUS, NerveEvent } from '@dreamnet/nerve';
import { BlobStore } from '../index.js';

export class MemorySyncSubscriber {
    private blobStore: BlobStore;

    constructor(blobStore: BlobStore) {
        this.blobStore = blobStore;
    }

    /**
     * Start listening for Memory Sync events
     */
    public subscribe() {
        console.log('⚡ [MemorySync] Subscribing to "dream-blob-store" channel...');

        // Subscribe to strict channel
        NERVE_BUS.subscribe('dream-blob-store', (event) => {
            this.handleEvent(event);
        });
    }

    public async handleEvent(event: NerveEvent) {
        // Double check kind just in case
        if (event.kind !== 'MEMORY_SYNC_EVENT') return;

        console.log(`🧠 [MemorySync] Persisting Node ${event.payload.node.id}`);

        try {
            const content = JSON.stringify(event.payload.node);
            const metadata = await this.blobStore.put(content, 'application/json');

            console.log(`💾 [MemorySync] Saved to Blob: ${metadata.id} (Commitment: ${metadata.commitment.substring(0, 8)}...)`);
        } catch (e) {
            console.error('[MemorySync] Failed to save blob', e);
        }
    }
}
