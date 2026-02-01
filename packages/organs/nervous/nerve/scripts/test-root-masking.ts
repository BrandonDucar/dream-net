/**
 * 🧠 RootReport: Wave 3 Intelligence & Masking Verification
 * 
 * Usage: pnpm exec tsx packages/nerve/scripts/test-root-masking.ts
 */

import { elizaBridge } from'../src/spine/ElizaBridge.js';
import { metabolicCortex } from'../src/spine/MetabolicCortex.js';

async function testRootMasking() {
    console.log("🧠 [Root Oracle] Simulating Deep Research Report...");

    const rawData = {
        subject: "Recursive Agent Economies",
        findings: "According to BrandonDucar's previous notes, the interaction between 143 Citizens and ElizaOS Mech Suits creates a high-vibe DeFAI ecosystem.",
        source: "Internal Knowledge Base / Arxiv Sync",
        criticality: "HIGH"
    };

    console.log("---------------------------------------");
    console.log("📤 Sending report from Pilot ROOT (contains sensitive name)...");

    await elizaBridge.reportBack("ROOT", "arxiv_scraper", rawData);

    console.log("---------------------------------------");
    console.log("🌀 INSPECTING THE CORTEX...");

    const insights = metabolicCortex.getRecentInsights();
    const lastReport = insights[insights.length - 1];

    console.log("Received Report in Cortex (JSON):");
    console.log(JSON.stringify(lastReport, null, 2));

    if (JSON.stringify(lastReport).includes("BrandonDucar")) {
        console.error("❌ MASKING FAILED: Sensitive name leaked.");
    } else if (JSON.stringify(lastReport).includes("[REDACTED_COMMANDER]")) {
        console.log("✅ MASKING SUCCESSFUL: 'BrandonDucar' replaced with '[REDACTED_COMMANDER]'.");
    } else {
        console.warn("⚠️ REDACTION NOT FOUND: Ensure target list matches.");
    }

    console.log("---------------------------------------");
}

testRootMasking();
