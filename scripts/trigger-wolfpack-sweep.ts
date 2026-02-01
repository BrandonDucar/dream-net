
import { mercenaryRecruiterService } from '../packages/organs/integumentary/server/src/services/MercenaryRecruiterService';

async function runSweep() {
    console.log('🐺 [WolfPack] Triggering Mercenary Sweep...');
    console.log('📜 Target: Moltbook Hot Feed');
    console.log('🎯 Strategy: Bracky/Base Recruitment');

    await mercenaryRecruiterService.performSweep();

    console.log('🏁 Sweep Triggered.');
}

runSweep().catch(console.error);
