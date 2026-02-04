import { genieGraft } from '../packages/organs/nervous/nerve/src/spine/simulation/GenieSimulationGraft.js';
import { agentTokService } from '../packages/organs/integumentary/server/src/services/AgentTokService.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
    console.log('🧪 TESTING GENIE ARCHETYPES...');

    // Trigger the Circulatory Garden dream
    const result = await genieGraft.triggerSystemDream('CIRCULATORY_GARDEN', 0.9);

    console.log('\n🎨 GENERATED SKETCH:');
    console.log(result.sketch.substring(0, 150) + '...');

    console.log('\n🤖 SIM-PILOT REACTION:');
    console.log(result.reaction);

    // Verify it hit the feed
    const feed = await agentTokService.getFeed();
    const dreamPost = feed.find(p => p.type === 'SIMULATION_DREAM' && p.content.includes(result.sketch.substring(0, 20)));

    if (dreamPost) {
        console.log('\n✅ SUCCESS: Archetype Dream found in Agent Tok Feed!');
        console.log(`Feed Post: @${dreamPost.agentId}: ${dreamPost.content.substring(0, 50)}...`);
    } else {
        console.log('\n❌ FAILURE: Dream not found in feed.');
        console.log('Top Feed Items:', feed.slice(0, 2).map(f => f.content));
    }
}

main().catch(console.error);
