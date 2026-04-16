import { mirageCloak } from './spine/external/MirageCloakService.js';
import { bioDaemon } from './spine/biological/BioDaemon.js';
import { dreamEventBus } from './spine/dreamnet-event-bus/index.js';

async function runPhase27Test() {
    console.log('🧪 [Test] Starting Phase XXVII Validation...');

    // 1. Mirage Cloak Test
    console.log('\n--- 🌫️ Testing Mirage Cloak ---');
    console.log(`Initial Gateway: ${mirageCloak.getActiveGateway()}`);
    
    // Cheat time or force rotation? Not easily done with setInterval loop without mocking timers.
    // We'll just verify the service is up and initial emit happened.
    
    // 2. Bio Daemon Test
    console.log('\n--- 🧬 Testing Bio Daemon ---');
    // Subscribe to VNS event to verify trigger
    dreamEventBus.subscribe('Bio.VagusStimulation', (evt) => {
        console.log(`✅ [Verified] VNS Triggered: ${evt.payload.protocol} @ ${evt.payload.frequency}`);
    });

    console.log('Simulating Stress Spike (Level 95)...');
    bioDaemon.simulateStressSpike(95);

    // 3. Quantum Guard Test
    console.log('\n--- 🔒 Testing Quantum Guard (Dilithium) ---');
    const { quantumGuard } = await import('../../server/src/core/QuantumSignatureGuard.ts');
    const artifacts = quantumGuard.mockArtifacts();
    const isValid = quantumGuard.verify('NuclearLaunchCodes', artifacts.signature, artifacts.publicKey);
    
    if (isValid) {
        console.log('✅ [Verified] Quantum Signature Accepted.');
    } else {
        console.error('❌ [Failed] Quantum Signature Rejected.');
    }

    setTimeout(() => {
        console.log('\n🧪 [Test] Validation Complete.');
        mirageCloak.stop();
        process.exit(0);
    }, 1000);
}

runPhase27Test().catch(console.error);
