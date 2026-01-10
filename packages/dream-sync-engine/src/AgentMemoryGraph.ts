
import { NERVE_BUS } from '@dreamnet/nerve';

interface MemoryNode {
    id: string;
    type: 'task' | 'thought' | 'result' | 'error';
    content: any;
    timestamp: number;
    tags: string[];
}

/**
 * AgentMemoryGraph (DreamNet Sync Hijack)
 * 
 * Hijacks Linear's "Local Graph" concept.
 * Agents utilize this in-memory graph for O(1) access to context.
 * Changes are "Optimistically" applied here, then synced to storage.
 */
export class AgentMemoryGraph {
    private nodes: Map<string, MemoryNode> = new Map();
    private indexes: Map<string, Set<string>> = new Map();

    constructor() { }

    /**
     * O(1) Instant Write
     */
    add(type: MemoryNode['type'], content: any, tags: string[] = []) {
        const id = crypto.randomUUID();
        const node: MemoryNode = {
            id,
            type,
            content,
            timestamp: Date.now(),
            tags
        };

        this.nodes.set(id, node);

        // Update Indexes
        tags.forEach(tag => {
            if (!this.indexes.has(tag)) this.indexes.set(tag, new Set());
            this.indexes.get(tag)?.add(id);
        });

        // Trigger Background Sync (Fire & Forget)
        this.syncToPermanentStorage(node);

        return id;
    }

    /**
     * O(1) Instant Read
     */
    get(id: string) {
        return this.nodes.get(id);
    }

    /**
     * O(1) Tag Lookup
     */
    getByTag(tag: string) {
        const ids = this.indexes.get(tag);
        if (!ids) return [];
        return Array.from(ids).map(id => this.nodes.get(id));
    }

    /**
     * The Sync Engine Loop
     * Pushes to Dream Blobs / Vector Store in background
     */
    private syncToPermanentStorage(node: MemoryNode) {
        // Emit event for shielding and persistence
        // This satisfies "Memory is recording... if something fails or passes"
        try {
            NERVE_BUS.publish({
                kind: 'MEMORY_SYNC_EVENT',
                channelId: 'dream-blob-store',
                id: crypto.randomUUID(),
                priority: 2,
                payload: {
                    type: 'SYNC_WRITE',
                    node
                },
                context: {
                    source: 'AgentMemoryGraph',
                    persistenceRequired: true
                }
            });
        } catch (e) {
            console.error('Failed to sync memory node', e);
        }
    }
}

export const agentMemory = new AgentMemoryGraph();
