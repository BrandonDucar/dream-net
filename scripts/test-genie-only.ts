import { genieGraft } from '../packages/organs/nervous/nerve/src/spine/simulation/GenieSimulationGraft.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
    console.log('🧪 TESTING GENIE GRAFT (ISOLATED)...');

    // Trigger the Circulatory Garden dream
    // This will emit to event bus. If AgentTokService is listening via main server, well, we are in a script.
    // In this script, AgentTokService is NOT initialized, so only invalid subscribers might cause issues.

    // However, event bus is in-memory for the process. 
    // So if AgentTokService isn't imported, it won't be listening.
    // This strictly tests GenieGraft's ability to run.

    const result = await genieGraft.triggerSystemDream('CIRCULATORY_GARDEN', 0.9);

    console.log('\n🎨 GENERATED SKETCH:');
    console.log(result.sketch.substring(0, 150) + '...');

    console.log('\n🤖 SIM-PILOT REACTION:');
    console.log(result.reaction);

    console.log('\n✅ Genie Graft Success (Isolated)');
}

main().catch(console.error);
