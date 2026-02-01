import { Perptrader } from './packages/market-organ/src/legacy/Perptrader.js';
import { getDbStatus } from './packages/server/src/db.js';

async function testPerpCompliance() {
    console.log("🧪 testing Modernized Perptrader (Sovereignty Compliance)...");

    const status = getDbStatus();
    if (!status.initialized) {
        console.error("❌ Aborting: Database not available for compliance check.");
        return;
    }

    const trader = new Perptrader();

    // Manually trigger a signal to test the subscription and compliance loop
    // In a real run, this comes from the NERVE_BUS
    console.log("📡 Simulating High-Confidence Market Signal...");

    // Note: We'd need to emit a real event to the NERVE_BUS if we wanted to test the full loop,
    // but here we can just test the internal compliance check if we export it or trigger it via executeTrade.
}

testPerpCompliance();
