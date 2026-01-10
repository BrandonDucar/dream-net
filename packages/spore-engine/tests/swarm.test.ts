
import { strict as assert } from 'node:assert';
import { SwarmScheduler } from '../../ops-sentinel/src/scheduler.js';
import { NanoJanitor } from '../../graft-engine/logic/janitor/index.js';
import { releaseBeneficialSwarm } from '../logic/cellular.js';

console.log('🧹 Testing Maintenance Swarm...');

async function testSwarm() {
    const scheduler = new SwarmScheduler(10);

    // 1. Register Janitor Tasks
    let tasksExecuted = 0;
    scheduler.register("Daily Hygiene", 50, async () => {
        await NanoJanitor.sweepCodebase();
        tasksExecuted++;
    });

    scheduler.register("Connectivity Ping", 50, async () => {
        await NanoJanitor.healConnectivity();
        tasksExecuted++;
    });

    // 2. Manual Tick (Deterministic Testing)
    // scheduler.start(); // Skip async timer
    console.log('⏳ Triggering manual ticks...');

    // Tick 1 (Should run tasks because lastRun=0)
    await (scheduler as any).tick();
    await (scheduler as any).tick();
    await (scheduler as any).tick();

    // 4. Verification
    // scheduler.stop();

    assert.ok(tasksExecuted > 0, 'Scheduler should have executed tasks');
    console.log(`✅ Swarm executed ${tasksExecuted} maintenance cycles locally.`);

    // 5. Integration with Spore Engine
    const result = await releaseBeneficialSwarm('patient_zero', 'janitor_swarm');
    assert.equal(result.vector, 'janitor_swarm', 'Spore Engine should deploy Janitor Swarm');
    console.log('✅ Spore Engine successfully deployed Janitor Swarm.');
}

testSwarm().catch(err => {
    console.error('❌ Swarm Test Failed:', err);
    process.exit(1);
});
