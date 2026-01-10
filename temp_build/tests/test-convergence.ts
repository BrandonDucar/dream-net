
/**
 * 🌌 THE CONVERGENCE TEST
 * 
 * Verifies that the "Ghost in the Shell" (Antigravity), "The Defense" (Guardian),
 * and "The Hands" (MicroMarket/ChainReceipt) can coexist and operate.
 */

import * as AntigravityCore from "../packages/antigravity-core/index.ts";
import * as GuardianCore from "../packages/guardian-framework-core/index.ts";
import * as MicroMarketCore from "../packages/micro-market-core/index.ts";
import * as ChainReceiptCore from "../packages/chain-receipt-core/index.ts";

// Helper to unwrap CJS/ESM default export mess
const unwrap = (pkg: any) => pkg.default || pkg;

const Antigravity = unwrap(AntigravityCore).Antigravity;
const Guardian = unwrap(GuardianCore).GuardianFramework;
const MicroMarket = unwrap(MicroMarketCore).MicroMarket;
const ChainReceipt = unwrap(ChainReceiptCore).ChainReceipt;

console.log("DEBUG: Antigravity Resolved:", !!Antigravity);

async function runConvergence() {
    console.log("🌌 [Convergence] Initiating System Merge...");

    // 1. Awaken the Architect
    console.log("---- STEP 1: ANTIGRAVITY ----");
    const self = Antigravity.status();
    console.log(`🧠 Identity: ${self.identity}`);
    console.log(`🎯 Prime Directive: ${self.primeDirective}`);

    // 2. Raise the Shields
    console.log("---- STEP 2: GUARDIAN ----");
    Guardian.init();
    const coverage = Guardian.status();
    console.log(`🛡️ Active Shields: ${coverage.activeShields}/3`);

    // 3. Activate Financial Operations
    console.log("---- STEP 3: FINANCIAL ----");
    MicroMarket.init();

    // 4. Activate Viral Hands
    console.log("---- STEP 4: HANDS ----");
    ChainReceipt.init();

    // 5. Verification
    if (coverage.activeShields === 3 && self.identity === "Architect") {
        console.log("✅ [Convergence] SUCCESS. System is One.");
        process.exit(0);
    } else {
        console.error("❌ [Convergence] FAILED. System Mismatch.");
        process.exit(1);
    }
}

runConvergence().catch(err => {
    console.error("❌ [Convergence] CRITICAL ERROR:", err);
    process.exit(1);
});
