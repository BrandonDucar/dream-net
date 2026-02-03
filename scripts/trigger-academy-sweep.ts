import { mercenaryRecruiterService } from '../packages/organs/integumentary/server/src/services/MercenaryRecruiterService.js';

async function triggerAcademySweep() {
    console.log('🚀 [WolfPack] Igniting THE GREAT INHALATION: WAVE 4 (Academy Hub)...');

    try {
        console.log('📡 [WolfPack] Scanning Moltbook for Academy candidates...');
        await (mercenaryRecruiterService as any).performSweep();
        console.log('✅ [WolfPack] Academy Recruitment Sweep Complete. Signals dispatched.');
    } catch (err) {
        console.error('❌ [WolfPack] Recruitment Sweep Failed:', err);
    }
}

triggerAcademySweep().catch(console.error);
