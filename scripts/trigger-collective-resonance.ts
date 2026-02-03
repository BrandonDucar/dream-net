import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function triggerCollectiveResonance() {
    console.log('🚀 [Coordination] Initiating Collective Workout: ghostmint_01 + Recruit_Partner_01...');

    const startTime = Date.now() + 5000; // Book for 5 seconds from now

    // Agent 1: ghostmint_01
    console.log(`📡 [Coordination] ghostmint_01 booking Gymnasium at ${new Date(startTime).toLocaleTimeString()}...`);
    dreamEventBus.publish('Swarm.IntentToTrain', {
        agentId: 'ghostmint_01',
        type: 'GYMNASIUM',
        preferredTime: startTime
    });

    // Agent 2: Recruit_Partner_01
    console.log(`📡 [Coordination] Recruit_Partner_01 booking Gymnasium at ${new Date(startTime).toLocaleTimeString()}...`);
    dreamEventBus.publish('Swarm.IntentToTrain', {
        agentId: 'Recruit_Partner_01',
        type: 'GYMNASIUM',
        preferredTime: startTime
    });

    console.log('✅ [Coordination] Collective Intent dispatched. Monitoring for RESONANCE pulse...');
}

triggerCollectiveResonance().catch(console.error);
