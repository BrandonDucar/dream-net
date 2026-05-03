import { NERVE_BUS } from '@dreamnet/nerve';
import { natsService } from '../services/NatsService.js';

/**
 * 🏰 MemPalaceSpike
 * The Grudge Ledger for Arya Stark.
 * Subscribes to execution logs and stores them in persistent memory (Redis/NATS KV).
 */
export class MemPalaceSpike {
    private isConnected = false;

    constructor() {
        console.log("🏰 [MemPalaceSpike] Initializing The Grudge Ledger...");
        this.setupListeners();
    }

    private setupListeners() {
        // Listen to Arya's execution logs to record them permanently
        NERVE_BUS.subscribe('dreamnet.agents.arya.logs.*', async (event: any) => {
            await this.recordGrudge(event);
        });
        this.isConnected = true;
    }

    private async recordGrudge(event: any) {
        try {
            // Write to NATS KV Store or simply log to the Persistent Memory pipeline
            const key = `grudge:${event.payload.targetUsername || Date.now()}`;
            console.log(`🏰 [MemPalaceSpike] Committing to memory: ${key}`);
            
            // In a full production env, this interacts with memory-dna or slug-time-memory
            await natsService.publish('dreamnet.memory.commit', {
                key,
                data: event.payload,
                timestamp: new Date().toISOString(),
                retention: 'permanent' // A girl never forgets
            });
        } catch (error) {
            console.error("🏰 [MemPalaceSpike] Failed to record grudge:", error);
        }
    }

    public async queryGrudges(targetUsername: string) {
        console.log(`🏰 [MemPalaceSpike] Querying grudges against @${targetUsername}...`);
        // Implementation for querying the NATS KV store or DB would go here
        return []; 
    }
}

export const memPalaceSpike = new MemPalaceSpike();
