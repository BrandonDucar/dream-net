/**
 * Spine Wrapper Smoke Tests
 * 
 * Tests all 4 wrappers to ensure they:
 * 1. Can be instantiated
 * 2. Emit events correctly
 * 3. Handle missing subsystems gracefully
 */

import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';
import { DeploymentWrapper } from '../wrappers/DeploymentWrapper';
import { DreamKeeperWrapper } from '../wrappers/DreamKeeperWrapper';
import { ShieldCoreWrapper } from '../wrappers/ShieldCoreWrapper';
import { BrowserAgentWrapper } from '../wrappers/BrowserAgentWrapper';

async function runSmokeTests() {
    console.log('🔥 Starting Spine Wrapper Smoke Tests...\n');

    // Create Event Bus
    const eventBus = new DreamEventBus();
    let eventsEmitted = 0;

    // Subscribe to all events
    eventBus.subscribe('*', (envelope) => {
        eventsEmitted++;
        console.log(`  📡 Event: ${envelope.type} from ${envelope.source}`);
    });

    // Test 1: DeploymentWrapper
    console.log('1️⃣ Testing DeploymentWrapper...');
    try {
        const deploymentWrapper = new DeploymentWrapper(eventBus);
        deploymentWrapper.announceDeploy('vercel');
        console.log('  ✅ DeploymentWrapper: Event emitted\n');
    } catch (error) {
        console.error('  ❌ DeploymentWrapper failed:', error);
    }

    // Test 2: DreamKeeperWrapper
    console.log('2️⃣ Testing DreamKeeperWrapper...');
    try {
        const dreamKeeperWrapper = new DreamKeeperWrapper(eventBus);
        dreamKeeperWrapper.reportHealth('test-entity', 'healthy');
        console.log('  ✅ DreamKeeperWrapper: Event emitted\n');
    } catch (error) {
        console.error('  ❌ DreamKeeperWrapper failed:', error);
    }

    // Test 3: ShieldCoreWrapper
    console.log('3️⃣ Testing ShieldCoreWrapper...');
    try {
        const shieldWrapper = new ShieldCoreWrapper(eventBus);
        await shieldWrapper.reportIncident({
            type: 'test',
            severity: 'low',
            description: 'Smoke test incident'
        });
        console.log('  ✅ ShieldCoreWrapper: Event emitted\n');
    } catch (error) {
        console.error('  ❌ ShieldCoreWrapper failed:', error);
    }

    // Test 4: BrowserAgentWrapper
    console.log('4️⃣ Testing BrowserAgentWrapper...');
    try {
        const browserWrapper = new BrowserAgentWrapper(eventBus);
        browserWrapper.reportBlockedNavigation('http://example.com');
        console.log('  ✅ BrowserAgentWrapper: Event emitted\n');
    } catch (error) {
        console.error('  ❌ BrowserAgentWrapper failed:', error);
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Smoke Tests Complete!`);
    console.log(`📊 Total Events Emitted: ${eventsEmitted}`);
    console.log(`🎯 Expected: 4, Actual: ${eventsEmitted}`);

    if (eventsEmitted === 4) {
        console.log('🎉 All wrappers working correctly!');
        process.exit(0);
    } else {
        console.log('⚠️  Some wrappers may have issues');
        process.exit(1);
    }
}

// Run tests
runSmokeTests().catch((error) => {
    console.error('💥 Smoke tests failed:', error);
    process.exit(1);
});
