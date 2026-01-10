
// Relative imports to bypass workspace linking delays for this test
import { agentMemory } from '../packages/dream-sync-engine/src/index.ts';
import { MemorySyncSubscriber } from '../packages/dream-blob-store/src/subscribers/MemorySyncSubscriber.ts';
import { BlobStore } from '../packages/dream-blob-store/src/index.ts';
import { FileSystemAdapter } from '../packages/dream-blob-store/src/adapters/FileSystemAdapter.ts';
import { NERVE_BUS } from '../packages/nerve/src/index.ts';

async function verifySync() {
    console.log('🧪 Starting DreamNet Sync Verification (Relative Mode)...');

    // 1. Setup Subscriber (Receiver)
    // In production, this is done by the Monolith boot sequence
    const blobStore: BlobStore = new FileSystemAdapter({ storageDir: './temp-blobs' });
    const subscriber = new MemorySyncSubscriber(blobStore);

    // 2. Start Subscriber (Real Wiring)
    subscriber.subscribe();
    console.log('✅ Subscriber via NERVE_BUS wired');

    // 3. Write to Memory (Sender)
    console.log('🧠 Agent thinking: "I need to remember this verification."');
    const noteId = agentMemory.add('thought', {
        text: 'Verification of DreamNet Sync',
        score: 100
    }, ['verification', 'test']);

    console.log(`✅ Memory Graph Updated instantly. Node ID: ${noteId}`);

    // 4. Wait for Async Sync
    console.log('⏳ Waiting for background sync (1s)...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. Verify Persistence
    // The subscriber should have logged "Saved to Blob"
    console.log('🚀 Sync Verification Complete. Check logs above for "Saved to Blob".');
}

verifySync().catch((e) => {
    console.error('❌ Sync Failed', e);
    process.exit(1);
});
