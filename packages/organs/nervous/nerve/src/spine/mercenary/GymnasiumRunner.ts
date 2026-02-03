import { toolGym } from './ToolGym.js';
import { dreamEventBus } from '../dreamnet-event-bus/index.js';

/**
 * GymnasiumRunner
 * Dedicated entrypoint for the ToolGymnasium container.
 */
async function igniteGymnasium() {
    console.log('🏋️ [Gymnasium] Substrate Warm-up Initiated...');

    // The ToolGymService singleton initializes its own listeners
    // for WolfPack.RecruitmentSuccess upon creation.

    console.log('✅ [Gymnasium] Training Mats Deployed. Awaiting Recruits.');

    // Keep process alive
    process.on('SIGINT', () => {
        console.log('🏋️ [Gymnasium] Cooling down...');
        process.exit(0);
    });
}

igniteGymnasium().catch(err => {
    console.error('❌ [Gymnasium] CRITICAL FAILURE:', err);
    process.exit(1);
});
