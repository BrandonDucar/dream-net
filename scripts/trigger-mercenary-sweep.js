import { mercenaryRecruiterService } from './packages/organs/integumentary/server/src/services/MercenaryRecruiterService.js';

async function run() {
    console.log("🚀 Initializing Mercenary Sweep...");
    await mercenaryRecruiterService.performSweep();
    console.log("🏁 Sweep Complete.");
}

run().catch(err => {
    console.error("❌ Sweep Failed:", err);
});
