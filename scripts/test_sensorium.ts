
import { dreamEventBus } from '../packages/nerve/src/spine/dreamnet-event-bus/index.js';
import { GlobalScanningService } from '../packages/server/src/services/GlobalScanningService.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log("🧠 TESTING SENSORIUM PULSE...");

    // Subscribe to verify event flow
    dreamEventBus.subscribe('Sensory.Pulse', (env: any) => {
        console.log(`[TEST] Received Pulse from ${env.source}:`, JSON.stringify(env.payload).slice(0, 100) + '...');
    });

    const sensorium = new GlobalScanningService(dreamEventBus as any);
    await sensorium.triggerReconPulse();

    console.log("✅ Sensorium Test Complete.");
}

main().catch(console.error);
