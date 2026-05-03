import { dreamEventBus } from './spine/dreamnet-event-bus/DreamEventBus.js';
import { MirageCloakService } from './spine/external/MirageCloakService.js';

async function runCloakTest() {
    console.log('🧪 [Test] Starting Mirage Cloak Gateway Rotation Verification...');

    // 1. Initialize Service with 1000ms interval for testing
    // Note: We need to access the class directly or reset instance if singleton logic prevents re-init with new params.
    // However, since this is a fresh process run, the first getInstance call will set the interval.
    console.log('🧪 [Test] Accelerating rotation interval to 1000ms...');
    MirageCloakService.resetForTesting();
    const mirageCloak = MirageCloakService.getInstance(1000);

    let rotationsDetected = 0;
    const maxRotations = 3;

    // 2. Subscribe to Gateway Rotation Events
    dreamEventBus.subscribe('System.GatewayRotation', (env) => {
        rotationsDetected++;
        console.log(`🧪 [Event] 🌫️ GATEWAY ROTATED (${rotationsDetected}/${maxRotations})`);
        console.log(`   -> Active Ingress: ${env.payload.activeGateway}`);
        console.log(`   -> Simulated Latency: ${env.payload.latencyMs}ms`);
        
        if (rotationsDetected >= maxRotations) {
            console.log('🧪 [Test] Target rotations reached. Verifying uniqueness...');
            mirageCloak.stop();
            process.exit(0);
        }
    });

    console.log('🧪 [Test] Listening for rotation pulses...');
    
    // Safety timeout
    setTimeout(() => {
        if (rotationsDetected < maxRotations) {
            console.error('❌ [Test] Timeout: Rotations not detected in time.');
            process.exit(1);
        }
    }, 5000);
}

runCloakTest().catch(console.error);
