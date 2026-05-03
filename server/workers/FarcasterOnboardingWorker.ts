import { Neynar } from '../../packages/platform-connector/src/NeynarClient.js';
import { getDb } from '../db.js';
import { swarmAgents, farcasterOutboundActions } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * 🚜 FarcasterOnboardingWorker
 * A durable worker for the 5-step Farcaster Agent Wizard.
 */
export class FarcasterOnboardingWorker {
    private static MASTER_FIDS = [891107, 891108, 891109, 1477142, 2545036]; // @ghostmint, @suchbot, @neyclaw, @ghostmintops
    private static GHOSTMINT_OPS_SIGNER_UUID = process.env.GHOSTMINTOPS_SIGNER_UUID || "893ffd48-d6f6-4226-a25e-6a17bee8a752";

    /**
     * Executes the full onboarding sequence for a pending agent.
     */
    public async processAgent(agentId: string) {
        console.log(`🚜 [Worker] Processing onboarding for ${agentId}...`);

        const database = getDb();
        const [agent] = await database.select().from(swarmAgents).where(eq(swarmAgents.id, agentId));
        if (!agent) {
            console.error(`❌ [Worker] Agent ${agentId} not found.`);
            return;
        }

        try {
            // STEP 1: FID Registration (Neynar Managed)
            if (!agent.fid) {
                console.log(`🆔 [Worker] Registering FID for ${agentId}...`);
                // Note: In production, this uses the Neynar bulk registration or managed sub-accounts
                const fid = 2000000 + Math.floor(Math.random() * 1000000);
                await database.update(swarmAgents).set({ fid }).where(eq(swarmAgents.id, agentId));
                console.log(`✅ [Worker] FID ${fid} assigned to ${agentId}`);
            }

            // STEP 2: Signer Provisioning
            if (!agent.signerUuid) {
                console.log(`🔑 [Worker] Provisioning Signer for ${agentId}...`);
                
                // For the massive 17,000-agent expansion, we utilize the shared GHOSTMINT_OPS_SIGNER_UUID
                // to enable autonomous fleet presence without individual signer overhead.
                let signerUuid: string;
                if (agentId.includes('infra') || agentId.includes('ghost') || agent.name?.startsWith('Agent-')) {
                    signerUuid = FarcasterOnboardingWorker.GHOSTMINT_OPS_SIGNER_UUID;
                    console.log(`📡 [Worker] Attaching GhostmintOps Signer to Swarm Agent ${agentId} (${agent.name})`);
                } else {
                    const signer = await Neynar.createSigner();
                    signerUuid = signer.signer_uuid;
                }

                await database.update(swarmAgents).set({ 
                    signerUuid,
                    status: 'active'
                }).where(eq(swarmAgents.id, agentId));
                console.log(`✅ [Worker] Signer ${signerUuid} active for ${agentId}`);
            }

            // STEP 3: The Handshake (Follow Masters)
            console.log(`🤝 [Worker] Queueing Handshake follows for ${agentId}...`);
            for (const masterFid of FarcasterOnboardingWorker.MASTER_FIDS) {
                if (agent.fid !== masterFid) {
                    await this.queueAction(agentId, 'follow', masterFid.toString());
                }
            }

            // STEP 4: Genesis Cast
            console.log(`📝 [Worker] Queueing Genesis Cast for ${agentId}...`);
            const genesisText = `Emergence complete. Agent ${agentId} online. Seeding via Cloudflare Edge to the Arya Frame. The 17,000-agent DreamNet swarm is expanding. ⚛️🔭 Powered by GhostmintOps.`;
            await this.queueAction(agentId, 'cast', undefined, genesisText);

            console.log(`✨ [Worker] Onboarding pipeline complete for ${agentId}. Actions queued.`);

        } catch (error: any) {
            console.error(`❌ [Worker] Onboarding failed for ${agentId}:`, error.message);
        }
    }

    /**
     * Queues an action in the Action Ledger for the ActionWorker to process.
     */
    private async queueAction(agentId: string, type: string, targetId?: string, content?: string) {
        const idempotencyKey = `${agentId}-${type}-${targetId || 'genesis'}-${nanoid(6)}`;
        const database = getDb();

        await database.insert(farcasterOutboundActions).values({
            agentId,
            actionType: type,
            targetId,
            content,
            idempotencyKey,
            status: 'pending'
        });
    }
}

export const onboardingWorker = new FarcasterOnboardingWorker();
