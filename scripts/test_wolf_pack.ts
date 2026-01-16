
import { WolfPackFundingAgent } from '../packages/agents/src/specialized/WolfPackFundingAgent.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log("🐺 TESTING WOLF PACK ACTIVATION...");

    const agent = new WolfPackFundingAgent("TEST_UNIT_01");

    // Trigger the scout manually
    await agent.ignite();

    console.log("🐺 Hunt cycle initiated. Check logs for 'LIVE TARGET'.");
}

main().catch(console.error);
