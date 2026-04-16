
import { solarYieldPredictor } from './spine/energy/SolarYieldPredictor.ts';
import { dreamEventBus } from './spine/dreamnet-event-bus/DreamEventBus.ts';

async function runPhase31Pilot() {
    console.log('🔭 [Solar Reach] Phase XXXI Pilot Initiated...');
    console.log('=================================================');
    
    // 1. Subscribe to the new Solar.Telemetry channel
    const telemetryPromise = new Promise((resolve) => {
        dreamEventBus.subscribe('Solar.Telemetry', (event: any) => {
            console.log(`[📡 Telemetry RX] Yield: ${event.payload.prediction.toFixed(1)}kWh | Directive: ${event.payload.directive}`);
            resolve(true);
        });
    });

    // 2. Trigger the predictor 5 times to generate a stream
    console.log('☀️ Generating Orbital Telemetry Stream...');
    for(let i=0; i<5; i++) {
        solarYieldPredictor.predictYield('DAY');
        await new Promise(r => setTimeout(r, 100));
    }

    // 3. Wait for at least one event
    await telemetryPromise;

    console.log('=================================================');
    console.log('✅ Phase XXXI Pilot Complete. Telemetry Stream Verification: PASS.');
    process.exit(0);
}

runPhase31Pilot().catch(e => {
    console.error(e);
    process.exit(1);
});
