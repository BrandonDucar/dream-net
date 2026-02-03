import { GenomePilotAgent } from '../packages/organs/respiratory/agents/src/specialized/GenomePilotAgent';

async function main() {
    console.log("🚀 INITIALIZING GENOME PILOT INCEPTION...\n");

    const pilot = new GenomePilotAgent({
        name: "AegisScion",
        thinkingBudget: 5 // Demonstrate a 5-step deep research loop
    });

    await pilot.ignite();

    console.log("\n✅ Inception complete. Scion logic is now circulating in the Nerve.");
}

main().catch(console.error);
