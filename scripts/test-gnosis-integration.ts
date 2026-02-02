import { metabolicCortex } from '../packages/organs/nervous/nerve/src/spine/MetabolicCortex.js';
import { sporeEngine } from '../packages/organs/nervous/nerve/src/spine/SporeEngine.js';
import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function testGnosisIntegration() {
    console.log('🧬 [Verification] Testing Gnosis Integration (Avenue-Scout)...');

    let fusionSignalReceived = false;
    let bioElectricSignalReceived = false;

    // 1. Test Helion Fusion Directive
    dreamEventBus.subscribe('System.ResearchDirective', (envelope: any) => {
        if (envelope.payload.topic === 'Helion' && envelope.payload.query.includes('sub-millisecond')) {
            console.log('✨ [ALIGNED] MetabolicCortex: Helion Fusion Directive Recognized.');
            fusionSignalReceived = true;
        }
    });

    // 2. Test Bio-Electric Resonance Charge
    const initialSP = sporeEngine.getStatus().sentiencePoints;
    dreamEventBus.publish({
        type: 'System.BioElectricResonance',
        source: 'TestHarness',
        payload: { intensity: 1.0, fieldStatus: 'RESONATING' }
    });

    // Wait for processing
    await new Promise(r => setTimeout(r, 500));

    const finalSP = sporeEngine.getStatus().sentiencePoints;
    if (finalSP > initialSP) {
        console.log(`✨ [ALIGNED] SporeEngine: Bio-Electric Resonance Charge Recorded (+${(finalSP - initialSP).toFixed(2)} SP).`);
        bioElectricSignalReceived = true;
    }

    // Trigger Metabolic Analysis for Helion
    await metabolicCortex.processHorizonSignal({
        id: 'OP-123',
        title: 'Helion Fusion Opportunity',
        description: 'Exploring Helion magneto-inertial confinement.'
    });

    setTimeout(() => {
        if (fusionSignalReceived && bioElectricSignalReceived) {
            console.log('\n✅ [Avenue-Scout] Integration Verified. Gnosis Flowing through the Substrate.');
        } else {
            console.error('\n❌ [Avenue-Scout] Integration Gaps Detected.');
            if (!fusionSignalReceived) console.error('- Fusion Directive Failed.');
            if (!bioElectricSignalReceived) console.error('- Bio-Electric Resonance Failed.');
        }
        process.exit(0);
    }, 1000);
}

testGnosisIntegration();
