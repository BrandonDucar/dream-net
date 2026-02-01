import { dreamEventBus } from '../dreamnet-event-bus/index.js';
import { vectorMeshConduit } from './VectorMeshConduit.js';

/**
 * 🕰️ ChronoLoom Service (Phase XXII)
 * 
 * Role: Time Weaver.
 * Function: Ingests Nerve Bus events and weaves them into the semantic memory fabric (Vector Mesh).
 */
export class ChronoLoomService {
    private static instance: ChronoLoomService;
    private memoryBuffer: any[] = [];

    private constructor() {
        console.log('🕰️ [ChronoLoom] Spinning up the Time Weave...');
        this.subscribeToFabric();
    }

    public static getInstance(): ChronoLoomService {
        if (!ChronoLoomService.instance) {
            ChronoLoomService.instance = new ChronoLoomService();
        }
        return ChronoLoomService.instance;
    }

    private subscribeToFabric() {
        // Weave all events into the timeline buffer
        dreamEventBus.subscribe('*', (event) => {
            this.weave(event);
        });
    }

    /**
     * Ingest an event into memory (RAM + Vector Store)
     */
    public async weave(event: any) {
        // 1. Add to hot RAM buffer (short-term memory)
        this.memoryBuffer.unshift({
            ...event,
            weaveTimestamp: Date.now()
        });

        // Maintain buffer size
        if (this.memoryBuffer.length > 1000) {
            this.memoryBuffer.pop();
        }

        // 2. Archive to Vector Mesh (Long-term semantic storage)
        // Only valid scalar events are sharded (to save tokens)
        if (event.metadata?.vectorizable) {
            // In Phase XXII we let VectorMeshConduit handle the sharding logic if connected
            // Here we would construct the MemoryVector
        }
    }

    /**
     * Retrieve the most recent linear history (Timeline)
     */
    public getTimelineSlice(limit: number): any[] {
        return this.memoryBuffer.slice(0, limit);
    }

    /**
     * Semantic Search (Reverse Siphon)
     * Directive 002: Signature-bound recall.
     */
    public async searchTimeline(
        agentId: string,
        challenge: string,
        signature: string,
        query: string,
        limit: number
    ) {
        console.log(`🕰️ [ChronoLoom] Searching weave for: "${query}" (Auth: ${agentId})`);

        // 1. Try Vector Mesh (Deep Recall - Secured)
        // Note: Real implementation would convert query string to queryVector using an embedding model.
        // For now using empty vector as placeholder in this substrate.
        const deepResults = await vectorMeshConduit.search(
            agentId,
            challenge,
            signature,
            new Array(1536).fill(0),
            limit
        );

        // 2. Provide Fallback/Augmented results from RAM
        // Memory = Identity: Filter RAM buffer by agentId as well
        if (!deepResults || deepResults.length === 0) {
            return this.memoryBuffer
                .filter(e => e.agentId === agentId || e.metadata?.agentId === agentId)
                .filter(e => JSON.stringify(e).toLowerCase().includes(query.toLowerCase()))
                .slice(0, limit);
        }

        return deepResults;
    }
}

export const chronoLoom = ChronoLoomService.getInstance();
