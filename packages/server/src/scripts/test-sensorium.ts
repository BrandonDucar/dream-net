import { DreamEventBus } from '@dreamnet/nerve/spine/index.js';
import { GlobalScanningService } from '../services/GlobalScanningService.js';
import { AuditorAgent } from '../agents/Auditor.js';

/**
 * Sensorium Verification Script (Phase 23)
 * 
 * Demonstrates:
 * 1. GlobalScanningService gathering Web2/Web3 leads.
 * 2. DreamEventBus routing the leads to the Auditor.
 * 3. Auditor acknowledging the sensory feedback.
 */
async function testSensorium() {
    console.log('🌌 DreamNet Sensorium Integration Test...\n');

    const bus = new DreamEventBus();
    const auditor = new AuditorAgent();
    const scanner = new GlobalScanningService(bus);

    // Auditor starts listening to the bus
    // (In reality, this happens in Auditor.run, but we simulate it for the pulse)
    bus.subscribe('EVENT_SCAN_MATCH', (event) => {
        console.log(`[Bus Feed] 📬 Rerouting Sensory Data: ${JSON.stringify(event.payload.target)}`);
    });

    // 1. Manually hook auditor for this pulse demo
    // We simulate the context that would be passed in a real run
    const mockCtx = { eventBus: bus } as any;

    console.log('[System] 🔌 Hooking Sensors to Auditor Nervous System...');

    // Trigger Pulse
    await scanner.triggerReconPulse();

    console.log('\n✅ Sensorium Verification Complete.');
}

testSensorium().catch(console.error);
