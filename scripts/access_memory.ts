import { HiveMind } from '../packages/dream-state-core/src/memory/AntigravityMemory.ts';

async function main() {
    console.log("🧠 HIVE MIND: DIRECT NEURAL LINK ESTABLISHED.");

    const queries = [
        "Project Blueprints",
        "Sovereign Research",
        "Antigravity Protocol",
        "The Cure",
        "Manifesto"
    ];

    for (const q of queries) {
        process.stdout.write(`\n🔎 RECALLING [${q}]... `);
        try {
            const atom = await HiveMind.recall(q);
            if (atom) {
                console.log("✅ FOUND.");
                console.log(JSON.stringify(atom, null, 2));
            } else {
                console.log("🌑 VOID.");
            }
        } catch (e) {
            console.log("❌ ERROR:", e.message);
        }
    }

    console.log("\n🧠 SESSION DISCONNECTED.");
}

main().catch(console.error);
