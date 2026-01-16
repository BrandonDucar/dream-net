
import { dreamEventBus } from '../packages/nerve/src/spine/dreamnet-event-bus/index.js';
import '../packages/server/src/core/AliveMode.js'; // Start Monitor
import { GlobalScanningService } from '../packages/server/src/services/GlobalScanningService.js';

async function main() {
    console.log("🏥 TESTING ALIVE MODE...");

    // Listen for Stabilization
    dreamEventBus.subscribe('System.Stabilized', (env: any) => {
        console.log("✅ SYSTEM STABILIZED:", JSON.stringify(env.payload));
        process.exit(0);
    });

    dreamEventBus.subscribe('System.Arrhythmia', (env: any) => {
        console.log("⚠️ SYSTEM ARRHYTHMIA:", JSON.stringify(env.payload));
    });

    // Manually trigger a pulse to satisfy the monitor (mocking WolfPack for now)
    const { aliveMode } = await import('../packages/server/src/core/AliveMode.js');
    aliveMode.pulse('WolfPackFundingAgent');

    // Trigger Scanner (Real Pulse)
    const sensorium = new GlobalScanningService(dreamEventBus as any);
    await sensorium.triggerReconPulse();

    console.log("... Waiting for Health Check Cycle (30s) ...");
}

main().catch(console.error);
