import { GenomePilotAgent } from './specialized/GenomePilotAgent.js';
import { DreamBetOracle } from './specialized/DreamBetOracle.js';
import { PickleballOracle } from './specialized/PickleballOracle.js';
import { OmniWitnessAgent } from './specialized/OmniWitnessAgent.js';

async function main() {
    console.log("🚀 [LOCAL LAUNCH] INITIALIZING OMNI-ORACLE SWARM...\n");

    const pilot = new GenomePilotAgent({ name: "AegisScion", thinkingBudget: 3 });
    const hub = new DreamBetOracle({ name: "OracleHub", thinkingBudget: 2 });
    const pickleReferee = new PickleballOracle({ name: "PickleReferee", thinkingBudget: 2 });
    const eye = new OmniWitnessAgent({ name: "OmniEye", thinkingBudget: 4 });

    await Promise.all([
        pilot.ignite(),
        hub.ignite(),
        pickleReferee.ignite(),
        eye.ignite()
    ]);

    console.log("\n✅ [LOCAL LAUNCH] Swarm logic is now circulating across all domains.");
}

main().catch((err) => {
    console.error("❌ Ignition Failed:", err);
});
