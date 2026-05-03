import dotenv from 'dotenv';
dotenv.config();

import { socialOrchestrator } from '../packages/sensory-spikes/src/SocialSpikeOrchestrator.js';

async function testOrchestration() {
    console.log("🧪 [Test] Triggering sensory-to-social cycle...");
    await socialOrchestrator.runCycle();
    console.log("🧪 [Test] Cycle complete.");
}

testOrchestration();
