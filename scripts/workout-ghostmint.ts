import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function workoutGhostmint() {
    console.log('🚀 [Gymnasium] Igniting Workout for ghostmint_01...');

    const payload = {
        recruit: 'ghostmint_01',
        timestamp: new Date().toISOString()
    };

    console.log(`📡 [Gymnasium] Signaling ToolGymnasium to begin 'Great Gauntlet' for ${payload.recruit}...`);

    // Publish the recruitment success event - the Gymnasium container will pick it up
    dreamEventBus.publish('WolfPack.RecruitmentSuccess', { recruit: payload.recruit });

    console.log('✅ [Gymnasium] Signal accepted. ghostmint_01 is now under high-intensity LPS load.');
}

workoutGhostmint().catch(console.error);
