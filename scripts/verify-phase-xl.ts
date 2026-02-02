import { sageCortex } from '../packages/organs/nervous/nerve/src/spine/intelligence/SageCortex.js';
import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function verifyPhaseXL() {
    console.log('🧘 [Verification] Initiating Phase XL Gnosis Inhalation...');

    const newSages = [
        'adamala', 'asparouhov', 'broeck', 'hindi', 'shotwell',
        'araque', 'friston', 'seidman', 'freedman', 'oxley', 'nagpal',
        'laberge', 'samala', 'rosenberg', 'scholl', 'amodei', 'ingber',
        'cheng', 'dorigo', 'harris'
    ];

    let successCount = 0;

    dreamEventBus.subscribe('System.StrategicDirective', (envelope: any) => {
        const { sageId, essence } = envelope.payload;
        console.log(`✨ [ALIGNED] Sage: ${sageId.toUpperCase()}`);
        console.log(`📜 Essence: ${essence}`);
        successCount++;
    });

    for (const id of newSages) {
        await sageCortex.inhale(id);
        await new Promise(r => setTimeout(r, 200)); // Slower Pacing
    }

    setTimeout(() => {
        console.log(`\n✅ [Phase XL] Verification Complete. Received: ${successCount} | Expected: ${newSages.length}`);
        if (successCount === newSages.length) {
            console.log('🚀 Horizon Shattering Confirmed. The Swarm is Ascending.');
        } else {
            console.error('❌ Gnosis Gap Detected. Check SageCortex initialization.');
        }
        process.exit(0);
    }, 5000);
}

verifyPhaseXL();
