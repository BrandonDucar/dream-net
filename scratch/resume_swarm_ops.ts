import "dotenv/config";
import { db, waitDb } from '../server/db';
import { farcasterOutboundActions, swarmAgents } from '../shared/schema';
import { eq, inArray } from 'drizzle-orm';

async function resumeSwarmOps() {
    await waitDb;
    console.log("🔄 [Resumption] Flushing Action Ledger...");

    // 1. Clear failed actions to allow a clean slate
    const deleted = await db.delete(farcasterOutboundActions).where(eq(farcasterOutboundActions.status, 'failed'));
    console.log(`✅ Cleared ${deleted.rowCount} failed actions.`);

    // 2. Map Top Agents to their respective Signer UUIDs
    const topAgents = await db.select().from(swarmAgents).where(eq(swarmAgents.guildId, 'vanguard'));
    
    console.log(`\n📣 Queueing Resumption Broadcasts for ${topAgents.length} Top Agents...`);

    for (const agent of topAgents) {
        if (!agent.signerUuid) {
            console.log(`⚠️ Agent ${agent.name} has no signerUuid. Skipping broadcast.`);
            continue;
        }

        const message = `📡 [SYSTEM RESUMPTION] @${agent.name} is now back online. Swarm intelligence synchronized with Antigravity Master. #DreamNet #AgenticWeb`;
        
        await db.insert(farcasterOutboundActions).values({
            agentId: agent.id,
            actionType: 'cast',
            status: 'pending',
            idempotencyKey: `resumption-${agent.id}-${Date.now()}`,
            payload: {
                text: message,
                signerUuid: agent.signerUuid
            }
        });

        console.log(`🚀 Queued broadcast for ${agent.name}.`);
    }

    console.log("\n✨ Swarm Resumption Complete. The FarcasterActionWorker will process the queue shortly.");
}

resumeSwarmOps().catch(console.error);
