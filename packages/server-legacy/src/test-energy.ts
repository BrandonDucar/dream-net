import { NERVE_BUS } from '@dreamnet/nerve';

/**
 * ⚡ Energy Spine Test Script
 * 
 * Verifies that the AetherFactoryGovernor issues power directives 
 * when EnergyTelemetry signals low SOC.
 */

console.log('⚡ Starting Energy Spine Dry-Run...');

// 1. Simulate low battery (Sodium Forge)
console.log('📉 Injecting low SOC sensory pulse...');

NERVE_BUS.publish('Sensory.Pulse', {
    id: `test-energy-${Date.now()}`,
    channelId: 'ENERGY_SPINE',
    kind: 'METRIC_SNAPSHOT',
    tag: 'EnergySpike',
    payload: {
        soc: 15, // Threshold for THROTTLE is 20
        methane: 40,
        timestamp: Date.now()
    },
    priority: 2
});

console.log('✅ Low energy pulse injected. Monitor logs for POWER_DIRECTIVE and mode switch.');
