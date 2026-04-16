
import { metabolicCortex } from './spine/MetabolicCortex.js';
import { solarYieldPredictor } from './spine/energy/SolarYieldPredictor.js';

async function runPhase30Pilot() {
    console.log('🐻 [Project BigBear] Phase XXX Pilot Initiated...');
    console.log('=================================================');

    // 1. Seed the predictor with high values to force a "High Energy" state
    console.log('☀️ Seeding Solar History with HIGH yield values...');
    for(let i=0; i<50; i++) {
        solarYieldPredictor.recordActual(99); // 99% yield
    }

    // 2. Run the Decision Dominance Loop
    // This should detect the high yield -> Trigger ACCELERATE_COMPUTE -> Trigger Kinetic Backup
    await metabolicCortex.runDecisionDominanceLoop();

    console.log('=================================================');
    console.log('✅ Phase XXX Pilot Complete.');
    process.exit(0);
}

runPhase30Pilot().catch(e => {
    console.error(e);
    process.exit(1);
});
