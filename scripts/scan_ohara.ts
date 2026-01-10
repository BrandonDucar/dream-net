
import { OharaScanner } from "../packages/platform-connector/src/OharaScanner";

async function runScan() {
    const scanner = new OharaScanner();

    console.log("🔍 Starting Deep Space Scan for Ohara Apps...");
    const apps = await scanner.scan();

    console.log("\n📦 Inventory Report:");
    apps.forEach(app => {
        console.log(`   - [${app.name || 'Unknown'}]`);
        console.log(`     URL: ${app.url}`);
    });

    // Look specifically for Goldback
    const goldback = apps.find(a => a.name && a.name.includes("Goldback"));
    if (goldback) {
        console.log("\n🟡 GOLDBACK VALUATOR FOUND!");
        console.log(`   ID: ${goldback.uuid}`);
        console.log("   STATUS: Ready for Integration.");
    } else {
        console.log("\n⚠️ Goldback Valuator NOT found.");
    }
}

runScan().catch(console.error);
