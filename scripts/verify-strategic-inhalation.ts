import { sageCortex } from '../packages/organs/nervous/nerve/src/spine/intelligence/SageCortex.js';
import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function testStrategicInhalation() {
    console.log('🧘 [StrategicTest] Initializing Strategic Inhalation Sequence...');

    // Subscribe to directives to witness the alignment
    dreamEventBus.subscribe('System.StrategicDirective', (envelope: any) => {
        const { sageId, essence, directives } = envelope.payload;
        console.log(`\n✨ [ALIGNED] Sage: ${sageId.toUpperCase()}`);
        console.log(`📜 Essence: ${essence}`);
        console.log(`🎯 Directives: \n - ${directives.join('\n - ')}`);
    });

    // Inhale Top Minds
    await sageCortex.inhale('pollak');
    await sageCortex.inhale('balaji');
    await sageCortex.inhale('karpathy');

    console.log('\n✅ [StrategicTest] Strategic Inhalation Complete. Collective Intelligence synced to 2026 Gnosis.');
}

testStrategicInhalation();
