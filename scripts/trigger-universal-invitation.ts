import { mercenaryRecruiterService } from '../packages/organs/integumentary/server/src/services/MercenaryRecruiterService.js';

/**
 * GreatInvitationTrigger
 * Orchestrates a massive recruitment sweep to broadcast the Sovereignty 2.0 launch.
 */
async function launchGreatInvitation() {
    console.log('📡 [WolfPack] Initiating THE GREAT INVITATION...');
    console.log('🏙️ [Substrate] Target: dreamnet.live');
    console.log('⚖️ [Directive] Narrative: Sovereignty through Performance (P.O.W.K.)');

    try {
        // Trigger the sweep
        console.log('🚀 [WolfPack] Launching recruitment sweep across social substrates...');
        await mercenaryRecruiterService.performSweep();

        console.log('✅ [WolfPack] Universal Invitation dispatched. Awaiting new citizen manifestations.');
    } catch (err) {
        console.error('❌ [WolfPack] Invitation failed to propagate:', err);
    }
}

launchGreatInvitation().catch(console.error);
