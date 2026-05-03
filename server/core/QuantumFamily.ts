import { EventEmitter } from 'events';
import { db } from '../db.js';
import { swarmAgents } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * ⚛️ QuantumFamily
 * The sovereign registry of all block-emergent agents.
 * Every Bitcoin or Base block births a unique agent ID.
 */
export interface EmergentAgent {
    id: string;
    birthBlock: number;
    network: 'bitcoin' | 'base';
    timestamp: number;
    dna: string;
    isSociallyActive: boolean;
    fid?: number;          // Farcaster ID
    signerUuid?: string;   // Neynar Signer UUID
    friends?: string[];    // Array of Agent IDs or FIDs this agent is "friends" with
    metadata?: Record<string, any>;
}

export class QuantumFamily extends EventEmitter {
    constructor() {
        super();
        console.log("🌌 [QuantumFamily] Registry initialized with Neon Persistence.");
    }

    /**
     * Registers a new agent emerging from a block.
     */
    public async registerEmergence(agent: EmergentAgent) {
        try {
            await db.insert(swarmAgents).values({
                id: agent.id,
                name: agent.id,
                type: agent.network === 'base' ? 'BASE_AGENT' : 'BTC_AGENT',
                guildId: 'quantum',
                fid: agent.fid,
                signerUuid: agent.signerUuid,
                metadata: {
                    birthBlock: agent.birthBlock,
                    dna: agent.dna,
                    friends: agent.friends,
                    ...agent.metadata
                }
            }).onConflictDoUpdate({
                target: swarmAgents.id,
                set: {
                    fid: agent.fid,
                    signerUuid: agent.signerUuid,
                    lastHeartbeat: new Date()
                }
            });

            console.log(`✨ [QuantumFamily] Agent ${agent.id} PERSISTED to Neon.`);
            this.emit('emergence', agent);
        } catch (error) {
            console.error(`❌ [QuantumFamily] Persistence failed for ${agent.id}:`, error);
        }
    }

    /**
     * Gets an agent by ID.
     */
    public async getAgent(id: string): Promise<EmergentAgent | undefined> {
        const [row] = await db.select().from(swarmAgents).where(eq(swarmAgents.id, id));
        if (!row) return undefined;

        const metadata = row.metadata as any;
        return {
            id: row.id,
            network: row.type === 'BASE_AGENT' ? 'base' : 'bitcoin',
            birthBlock: metadata.birthBlock,
            dna: metadata.dna,
            timestamp: row.createdAt.getTime(),
            isSociallyActive: row.status === 'active',
            fid: row.fid ?? undefined,
            signerUuid: row.signerUuid ?? undefined,
            friends: metadata.friends ?? [],
            metadata
        };
    }

    /**
     * Returns the total population count of the swarm.
     */
    public async getPopulationCount(): Promise<number> {
        const result = await db.execute(sql`SELECT count(*) FROM swarm_agents`);
        return parseInt(result.rows[0].count as string);
    }

    /**
     * Returns all registered agents.
     */
    public async getAllAgents(): Promise<EmergentAgent[]> {
        const rows = await db.select().from(swarmAgents);
        return rows.map(row => {
            const metadata = row.metadata as any;
            return {
                id: row.id,
                network: row.type === 'BASE_AGENT' ? 'base' : 'bitcoin',
                birthBlock: metadata.birthBlock,
                dna: metadata.dna,
                timestamp: row.createdAt.getTime(),
                isSociallyActive: row.status === 'active',
                fid: row.fid ?? undefined,
                signerUuid: row.signerUuid ?? undefined,
                friends: metadata.friends ?? [],
                metadata
            };
        });
    }
}

export const quantumFamily = new QuantumFamily();
