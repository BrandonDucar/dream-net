import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function triggerGymTest() {
    console.log('🚀 [Verification] Igniting ToolGymnasium Test: Recruit_Test_001...');

    // Simulate a recruitment success event
    const payload = {
        recruit: 'Recruit_Test_001',
        timestamp: new Date().toISOString()
    };

    console.log(`📡 [Verification] Publishing WolfPack.RecruitmentSuccess for ${payload.recruit}...`);

    // In a live container world, the Gymnasium service would pick this up via Redis/Nerve
    // For local verification, we can trigger the service directly if required,
    // but here we are testing the Event Bus bridge.
    dreamEventBus.publish('WolfPack.RecruitmentSuccess', { recruit: payload.recruit });

    console.log('✅ [Verification] Event dispatched. Check Gymnasium logs or Persistence for score.');
}

triggerGymTest().catch(console.error);
