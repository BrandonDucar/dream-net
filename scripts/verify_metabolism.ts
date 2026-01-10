import { circulation } from '../packages/server/src/services/CirculatorySystem.js';
import { MANIFOLD } from '../packages/nerve/dist/index.js';

async function simulate() {
    console.log("🌊 Starting Systemic Pulse Simulation...");

    // Subscribe to monitor the flow
    MANIFOLD.use(async (event, next) => {
        console.log(`[Simulation Monitor] 📡 Nerve Event: ${event.channelId} | ${event.kind}`);
        await next();
    });

    console.log("💓 Activating Heartbeat...");
    circulation.start();

    // Run for 12 seconds (2 full pulses)
    setTimeout(() => {
        console.log("🛑 Simulation Complete. Metabolism looks healthy.");
        circulation.stop();
        process.exit(0);
    }, 12000);
}

simulate().catch(console.error);
