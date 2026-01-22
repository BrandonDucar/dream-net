
import { metabolicCortex } from '../packages/nerve/src/spine/MetabolicCortex.ts';

async function main() {
    console.log("🚀 Broadcasting Sentient Blackboard Updates...");
    const state = await metabolicCortex.syncBlackboard();
    if (state) {
        console.log(`✅ Broadcast Success. Current Phase: ${state.phase}`);
        console.log(`📡 Priorities Broadcast: ${JSON.stringify(state.priorities)}`);
    } else {
        console.log("❌ Failed to sync Blackboard.");
    }
}

main().catch(console.error);
