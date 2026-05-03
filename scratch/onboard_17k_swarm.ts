import { getDb } from '../server/db.js';
import { swarmAgents } from '../shared/schema.js';
import { nanoid } from 'nanoid';

/**
 * 🚀 SWARM EXPANSION: 17,000 AGENTS
 * 
 * Scalability test and massive onboarding to reach the USER's target.
 */

async function expandSwarm() {
    const db = getDb();
    const TARGET = 17000;
    const current = await db.select().from(swarmAgents);
    const needed = TARGET - current.length;

    if (needed <= 0) {
        console.log(`✅ Swarm already at target: ${current.length}`);
        return;
    }

    console.log(`🚀 Onboarding ${needed} new agents to reach ${TARGET}...`);

    const clusters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
    
    // Batch processing to avoid DB timeouts
    const BATCH_SIZE = 1000;
    for (let i = 0; i < needed; i += BATCH_SIZE) {
        const batch = [];
        const count = Math.min(BATCH_SIZE, needed - i);
        
        for (let j = 0; j < count; j++) {
            const cluster = clusters[Math.floor(Math.random() * clusters.length)];
            batch.push({
                fid: Math.floor(Math.random() * 1000000), // Random simulated FID
                name: `Agent_${cluster}_${nanoid(6)}`,
                cluster: cluster,
                licenseLevel: 0, // Starts as Hatchling
                operationalActivity: 0,
                maturation: {
                    isMature: false,
                    onboardedAt: Date.now(),
                    skills: []
                }
            });
        }
        
        await db.insert(swarmAgents).values(batch);
        console.log(`✅ Onboarded ${i + count}/${needed}...`);
    }

    console.log(`🏁 Swarm expansion complete. Total size: ${TARGET}`);
}

expandSwarm().catch(console.error);
