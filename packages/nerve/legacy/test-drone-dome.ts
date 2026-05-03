import { DOME } from './spine/GoldenDroneDome.js';
import { NERVE_BUS } from './bus.js';

async function testDome() {
    console.log('🐝 [Nerve] Starting Golden Drone Dome Simulation...');

    // 1. Subscribe to DOME signals
    NERVE_BUS.subscribeAll((envelope: any) => {
        console.log(`[📡 BUS] Received: ${envelope.eventType || envelope.routing?.channel} ->`, envelope.payload || envelope);
    });

    // 2. Start the heartbeat
    DOME.startHeartbeat(2000);

    // 3. Simulate agents laying pheromones
    console.log('\n--- 🧪 SIMULATION: Pheromone Deposition ---');
    DOME.layPheromone('TASK_AZURE_PG_SCALE', 0.4, 'AntigravityPrime');
    await new Promise(r => setTimeout(r, 1000));

    DOME.layPheromone('TASK_REPLIT_SOLIDIFY', 0.6, 'DevOpsAgent');
    await new Promise(r => setTimeout(r, 1000));

    DOME.layPheromone('TASK_AZURE_PG_SCALE', 0.2, 'PhilosopherAgent');

    // 4. Wait for convergence
    console.log('\n--- 🧪 SIMULATION: Convergence Check ---');
    await new Promise(r => setTimeout(r, 5000));

    const target = DOME.getStrongestTask();
    console.log(`\n🐝 [DOME] Strongest Signal converged on: ${target}`);

    if (target) {
        DOME.claimTask(target, 'ThreadLeader');
    }

    // 5. Cleanup
    DOME.stopHeartbeat();
    console.log('\n✅ Simulation Complete.');
    process.exit(0);
}

testDome().catch(console.error);
