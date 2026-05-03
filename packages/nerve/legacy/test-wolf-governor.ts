import { wolfPackGovernor } from './spine/external/WolfPackGovernor.js';
import { dreamEventBus } from './spine/dreamnet-event-bus/index.js';

/**
 * 🧪 Test Wolf Pack Automation
 */
async function runTest() {
    console.log('🧪 Starting Wolf Pack Autonomous Test...');

    // Subscribe to hunt success events
    dreamEventBus.subscribe('WolfPack.HuntSuccessful', (event) => {
        console.log(`🐺 [Test] Hunt Event Captured: ${event.payload.targetId} via ${event.payload.campaign}`);
    });

    // Manually trigger a hunt for testing
    await wolfPackGovernor.forceHunt();

    console.log('🧪 Waiting for events...');
    
    // For testing, we can manually trigger the private method if we use casting, 
    // but better to just wait 35s or change the code for test.
    // Instead, I'll just wait 40 seconds.
    setTimeout(() => {
        console.log('🧪 Test Complete. Check logs above for hunt activity.');
        process.exit(0);
    }, 40000);
}

runTest().catch(console.error);
