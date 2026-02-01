import { dreamEventBus } from '../packages/nerve/src/spine/dreamnet-event-bus/DreamEventBus.js';
import { aetherGovernor } from '../packages/nerve/src/spine/governance/AetherFactoryGovernor.js';

/**
 * ⚡ Energy Simulator (Phase XIX Diagnostic)
 * 
 * Verifies the AetherFactoryGovernor's ability to respond to 
 * Sodium-ion charge levels.
 */

async function runSimulation() {
    console.log('🚀 Starting Energy Simulation...');

    // 1. Initial State
    console.log('--- Initial State ---');
    console.log(aetherGovernor.getStatus());

    // 2. Simulate Solar Surplus (Push Directive + Methane Cycle)
    console.log('\n--- Simulating Solar Surplus (Continuous Pushes) ---');
    for (let i = 0; i < 6; i++) {
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            'ENERGY_TELEMETRY',
            'SolarArrayProvider',
            {
                chargeLevel: 0.98,
                source: 'SOLAR',
                consumptionRate: 5.2,
                thermalLoad: 35.0
            }
        ));
    }

    // 3. Simulate Critical Battery (Conserve Directive)
    console.log('\n--- Simulating Critical Battery (Charge 8%) ---');
    dreamEventBus.publish(dreamEventBus.createEnvelope(
        'ENERGY_TELEMETRY',
        'BatteryMonitor',
        {
            chargeLevel: 0.08,
            source: 'GRID',
            consumptionRate: 12.5,
            thermalLoad: 42.0
        }
    ));

    // 4. Final State
    console.log('\n--- Final State ---');
    console.log(aetherGovernor.getStatus());
}

// Subscribing to directives for visual confirmation
dreamEventBus.subscribe('POWER_DIRECTIVE', (event) => {
    const { action, reason } = event.payload as any;
    const icon = action === 'CONSERVE' ? '⚠️' : '🔋';
    console.log(`${icon} [POWER_DIRECTIVE] Action: ${action} | Reason: ${reason}`);
});

runSimulation().catch(console.error);
