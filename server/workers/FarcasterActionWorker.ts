import { Neynar } from '../../packages/platform-connector/src/NeynarClient.js';
import { getDb } from '../db.js';
import { swarmAgents, farcasterOutboundActions } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';

/**
 * ⚙️ FarcasterActionWorker
 * Processes the 'Action Ledger' (outbound actions) with rate limiting and idempotency.
 */
export class FarcasterActionWorker {
    /**
     * Polls the ledger for pending actions and executes them.
     * Includes rate-limit awareness (429 handling) and signer rotation.
     */
    public async processLedger() {
        const database = getDb();
        const pendingActions = await database.select()
            .from(farcasterOutboundActions)
            .where(eq(farcasterOutboundActions.status, 'pending'))
            .orderBy(farcasterOutboundActions.createdAt) // Process oldest first
            .limit(20); // Batch process 20 at a time for efficiency

        if (pendingActions.length === 0) return;

        console.log(`⚙️ [ActionWorker] Processing ${pendingActions.length} pending actions...`);

        for (const action of pendingActions) {
            try {
                const [agent] = await database.select().from(swarmAgents).where(eq(swarmAgents.id, action.agentId));
                if (!agent || !agent.signerUuid) {
                    console.warn(`⚠️ [ActionWorker] Agent ${action.agentId} or signer not found. Skipping.`);
                    continue;
                }

                // Check for ban status
                if (agent.isBanned) {
                    console.warn(`🚫 [ActionWorker] Agent ${action.agentId} is BANNED. Cancelling action.`);
                    await database.update(farcasterOutboundActions)
                        .set({ status: 'failed', errorMessage: 'Agent Banned' })
                        .where(eq(farcasterOutboundActions.id, action.id));
                    continue;
                }

                console.log(`🚀 [ActionWorker] Executing ${action.actionType} for ${action.agentId}...`);

                let result;
                try {
                    switch (action.actionType) {
                        case 'cast':
                            result = await Neynar.publishCast(action.content || "", agent.signerUuid);
                            break;
                        case 'follow':
                            result = await Neynar.followUser(parseInt(action.targetId!), agent.signerUuid);
                            break;
                        case 'reaction':
                            result = await Neynar.reactToCast(action.targetId!, agent.signerUuid);
                            break;
                    }

                    // Update ledger on success
                    await database.update(farcasterOutboundActions).set({
                        status: 'sent',
                        txHash: result?.hash || 'success',
                        executedAt: new Date()
                    }).where(eq(farcasterOutboundActions.id, action.id));

                    console.log(`✅ [ActionWorker] ${action.actionType} successful for ${action.agentId}.`);

                } catch (error: any) {
                    if (error.response?.status === 429) {
                        console.warn(`⏳ [ActionWorker] Rate limit (429) hit for ${action.agentId}. Backing off...`);
                        // Leave status as pending to retry later, but stop this batch
                        break;
                    }
                    throw error; // Pass to outer catch for generic error handling
                }

                // Jitter to avoid bot-like timing detection (2-5s)
                await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

            } catch (error: any) {
                console.error(`❌ [ActionWorker] Failed to execute action ${action.id}:`, error.message);
                
                await database.update(farcasterOutboundActions).set({
                    status: 'failed',
                    errorMessage: error.message
                }).where(eq(farcasterOutboundActions.id, action.id));
            }
        }
    }
}

export const actionWorker = new FarcasterActionWorker();
