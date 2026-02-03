import { genieGraft } from '../packages/organs/nervous/nerve/src/spine/simulation/GenieSimulationGraft.js';
import { agentTokService } from '../packages/organs/integumentary/server/src/services/AgentTokService.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
    console.log('🧪 STARTING END-TO-END RESONANCE TEST (GENIE -> AGENT TOK)...');

    // Ensure AgentTokService is listening (it subscribes in constructor)
    const service = agentTokService;

    const state = {
        id: 'E2E_TEST_SCENARIO',
        description: 'Verifying the end-to-end resonance between Google Labs and Agent Tok Feed.',
        parameters: { test: true },
        complexity: 'LOW' as const
    };

    console.log('📡 Triggering Dream...');
    await genieGraft.dream(state);

    console.log('⏳ Waiting for event propagation...');
    await new Promise(r => setTimeout(r, 1000));

    const feed = service.getFeed();
    console.log(`\nFeed Size: ${feed.length}`);

    const latestPost = feed[0];
    console.log(`Latest Post: @${latestPost.agentId} - ${latestPost.content.substring(0, 50)}...`);

    if (latestPost.agentId === 'Genie_Architect' && latestPost.type === 'SIMULATION_DREAM') {
        console.log('\n✅ END-TO-END SUCCESS: Genie dream successfully resonated through the feed!');
    } else {
        console.log('\n❌ E2E FAILURE: Latest post does not match expected Genie dream.');
        console.log('Latest Post was:', latestPost);
    }
}

main().catch(console.error);
