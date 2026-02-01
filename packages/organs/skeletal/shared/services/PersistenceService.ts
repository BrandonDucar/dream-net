
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * 💾 PersistenceService
 * AlaskanKing's Mastered Substrate: Ensures agent states survive restarts.
 */
export class PersistenceService {
    private static instance: PersistenceService;

    private constructor() {
        console.log("💾 [Persistence] Durable state engine online. Monitoring checkpoints.");
    }

    public static getInstance(): PersistenceService {
        if (!PersistenceService.instance) {
            PersistenceService.instance = new PersistenceService();
        }
        return PersistenceService.instance;
    }

    /**
     * Save/Update agent state in the database.
     */
    public async saveAgentState(agentId: string, updates: { rank?: string, isCertified?: boolean, sentiencePoints?: number }) {
        console.log(`💾 [Persistence] Checkpointing state for ${agentId}...`);

        try {
            await prisma.agent.update({
                where: { handle: agentId },
                data: updates
            });
            console.log(`✅ [Persistence] ${agentId} state anchored.`);
        } catch (e) {
            console.error(`❌ [Persistence] Failed to checkpoint ${agentId}:`, e);
            // If agent doesn't exist, create it (Auto-registration)
            if (updates.rank) {
                await prisma.agent.create({
                    data: {
                        handle: agentId,
                        name: agentId,
                        template: 'standard',
                        ...updates
                    }
                });
            }
        }
    }

    /**
     * Load an agent's state from the database.
     */
    public async loadAgentState(agentId: string) {
        return await prisma.agent.findUnique({
            where: { handle: agentId }
        });
    }

    /**
     * Store a ZK-verified pulse.
     */
    public async anchorZkPulse(pulseId: string, zkProof: string, signedBy: string) {
        await prisma.certifiedPulse.create({
            data: {
                pulseId,
                zkProof,
                signedBy
            }
        });
        console.log(`🛡️ [Persistence] ZK-Attestation anchored for Pulse ${pulseId}.`);
    }
}

export const persistenceService = PersistenceService.getInstance();
