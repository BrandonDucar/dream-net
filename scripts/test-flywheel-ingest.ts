import { MasteryLibrary, MASTERY_AVENUES } from '../packages/antigravity-core/logic/mastery.js';

async function testFlywheel() {
    console.log('🧪 Starting Sovereign Flywheel Verification...');

    const initialLevel = MASTERY_AVENUES.REAL_TIME_LAMINAR.masteryLevel;
    console.log(`📊 Initial Mastery (Laminar): ${initialLevel}`);

    // 1. Ingest Intel
    await MasteryLibrary.ingestFlywheel({
        avenue: 'REAL_TIME_LAMINAR',
        domain: 'Avenue 21',
        insight: 'Laminar Flow prevents main-thread blocking during HFT spikes.'
    });

    const afterIngest = MASTERY_AVENUES.REAL_TIME_LAMINAR.masteryLevel;
    console.log(`📈 Level after Intel Ingest: ${afterIngest}`);

    // 2. Reward Success
    await MasteryLibrary.rewardSuccess('REAL_TIME_LAMINAR', 0.05);

    const finalLevel = MASTERY_AVENUES.REAL_TIME_LAMINAR.masteryLevel;
    console.log(`🎯 Final Mastery: ${finalLevel}`);

    if (finalLevel > initialLevel) {
        console.log('✅ Flywheel Loop Verified: Intel Ingest -> Outcome Reward -> Mastery Growth.');
    } else {
        console.error('❌ Flywheel Failure: Mastery did not grow.');
    }
}

testFlywheel().catch(console.error);
