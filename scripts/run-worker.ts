import 'dotenv/config';
import { FarcasterActionWorker } from '../server/workers/FarcasterActionWorker.js';
import { waitDb } from '../server/db.js';

async function main() {
    console.log('🚀 [Worker] Starting Action Processor...');
    await waitDb;
    const worker = new FarcasterActionWorker();
    await worker.processLedger();
    console.log('✅ [Worker] Batch processing finished.');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ [Worker] Fatal error:', err);
    process.exit(1);
});
