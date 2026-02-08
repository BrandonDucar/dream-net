import { FlashTrader } from './src/agents/FlashTrader.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function trigger() {
    console.log('--- 🚀 Launching Metabolic Test Run (Avenue 25) ---');

    const ctx = {
        requestId: 'test-metabolic-' + Date.now().toString(),
        userId: 'admin'
    } as any;

    try {
        const result = await FlashTrader.run({
            targetToken: 'METABOLIC_TEST'
        }, ctx);

        console.log('\n--- 📊 Metabolic Scan Result ---');
        console.log(`Action: ${result.action}`);
        console.log(`Reason: ${result.reason}`);

        if (result.metadata) {
            console.log('\nMetadata Snapshot:');
            console.log(JSON.stringify(result.metadata, null, 2));
        }
    } catch (e: any) {
        console.error('❌ Execution Error:', e);
    }
}

trigger().catch(console.error);
