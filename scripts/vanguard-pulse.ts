import dotenv from 'dotenv';
dotenv.config();

import { Neynar } from '../packages/platform-connector/src/NeynarClient.js';
import { signerPool } from '../packages/platform-connector/src/FarcasterSignerPool.js';
import { swarmIntelligence } from '../server/core/SwarmIntelligence.js';
import { db } from '../server/db.js';
import { swarmAgents } from '../shared/schema.js';
import { eq, or } from 'drizzle-orm';

/**
 * ⚡ VanguardPulse
 * Keeps the "General" agents (Neyclaw, GhostmintOps) active and responsive.
 */
async function runPulse() {
    console.log("⚡ [Pulse] Vanguard Social Pulse ACTIVATED.");

    // The vanguards we want to keep pulsing
    const vanguards = ['neyclaw-dreamnet', 'ghostmintops'];

    while (true) {
        console.log(`\n⚡ [Pulse] Beating... (${new Date().toLocaleTimeString()})`);

        // Fetch vanguards from Neon
        const vanguards = await db.select().from(swarmAgents).where(
            or(
                eq(swarmAgents.id, 'neyclaw-dreamnet'),
                eq(swarmAgents.id, 'ghostmintops')
            )
        );

        for (const agent of vanguards) {
            try {
                const config = signerPool.getSigner(agent.id);
                if (!config || !agent.signerUuid) continue;

                console.log(`🤖 [Pulse] Waking up ${agent.id}...`);

                // 1. Formulate High-Quality Response
                const content = await swarmIntelligence.formulateResponse(agent.id);

                // 2. Double-check with Oracle
                if (!(await swarmIntelligence.validate(content))) {
                    console.warn(`🛡️ [Pulse] Content rejected by Oracle for ${agent.id}.`);
                    continue;
                }

                // 3. Post
                console.log(`📝 [Pulse] ${agent.id} casting: "${content}"`);
                await Neynar.publishCast(content, agent.signerUuid, undefined, config.apiKey);
                
                console.log(`✅ [Pulse] ${agent.id} pulse successful.`);

            } catch (error: any) {
                console.error(`❌ [Pulse] Error for ${agent.id}:`, error.message);
            }
        }

        // Wait 20 minutes (1200000 ms)
        console.log("💤 [Pulse] Sleeping for 20 minutes...");
        await new Promise(resolve => setTimeout(resolve, 1200000));
    }
}

runPulse();
