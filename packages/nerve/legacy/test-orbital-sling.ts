import { dreamEventBus } from './spine/dreamnet-event-bus/DreamEventBus.js';
import { orbitalSling } from './spine/external/OrbitalSlingClient.js';

async function runOrbitalTest() {
    console.log('🧪 [Test] Starting Orbital Redundancy Verification...');

    // 1. Subscribe to launch events
    dreamEventBus.subscribe('LAUNCH_SPIN_UP', (env) => {
        console.log(`🧪 [Event] 🛰️ SPIN-UP Detected: Payload ${env.payload.payloadId} | Status: ${env.payload.status}`);
    });

    dreamEventBus.subscribe('LAUNCH_RELEASE', (env) => {
        console.log(`🧪 [Event] 🚀 RELEASE Detected: Velocity ${env.payload.velocityMps} m/s`);
    });

    dreamEventBus.subscribe('LAUNCH_SUCCESS', (env) => {
        console.log(`🧪 [Event] ✅ ORBIT REACHED: Altitude ${env.payload.orbitAltitudeKm} km`);
    });

    // 2. Simulate DreamSeed Packaging
    console.log('🧪 [Test] 1. Packaging DreamSeed...');
    const podId = await orbitalSling.packDreamSeed({ 
        registry: { agentCount: 143, active: true }, 
        memory: { vectorCount: 15000, shard: 'QDRANT_L3' } 
    });
    console.log(`🧪 [Test] Pod Packed: ${podId}`);

    // 3. Initiate Launch
    console.log('🧪 [Test] 2. Initiating Kinetic Launch Sequence...');
    const launch = await orbitalSling.initiateLaunch(podId);

    console.log('🧪 [Test] Final Launch Status:', launch);

    // 4. Verify System Critical Trigger
    console.log('🧪 [Test] 3. Testing Emergency Trigger...');
    dreamEventBus.publish(dreamEventBus.createEnvelope('System.Critical', 'TestScript', { reason: 'Simulation' }));
    
    // Wait for async emergency launch
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('🧪 [Test] Orbital Verification Complete.');
}

runOrbitalTest().catch(console.error);
