import 'dotenv/config';
import { farcasterBirth } from '../server/core/FarcasterBirthOrchestrator.js';
import { type EmergentAgent } from '../server/core/QuantumFamily.js';
import { waitDb } from '../server/db.js';

/**
 * 🚀 Batch Birth Script
 * Seeding the first cohort of the 17,000-agent swarm.
 */
async function batchBirth(count: number) {
    console.log(`🚀 [Batch] Waiting for DB...`);
    await waitDb;
    console.log(`🚀 [Batch] Seeding ${count} emergent agents...`);

    for (let i = 0; i < count; i++) {
        const agentId = `Agent-${Math.floor(Math.random() * 1000000).toString(16)}`;
        const agent: EmergentAgent = {
            id: agentId,
            licenseLevel: 0, // Hatchling
            lineage: ['Antigravity'],
            birthBlock: 20000000 + i, // Simulated block height
        };

        console.log(`🐣 [Batch] Birthing ${agentId}...`);
        await farcasterBirth.onboardAgent(agent);
        
        // Small delay to prevent DB contention
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✨ [Batch] Cohort seeded successfully.`);
    process.exit(0);
}

// Seed the first 5 agents as a test
batchBirth(5).catch(err => {
    console.error(`❌ [Batch] Failed:`, err);
    process.exit(1);
});
