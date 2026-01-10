export interface MemoryLayer {
    store(key: string, value: any): Promise<void>;
    recall(key: string): Promise<any>;
    name: 'LIZARD' | 'MAMMAL' | 'COSMIC';
}
/**
 * The Lizard Brain: High-speed, ephemeral, survival-focused.
 * Implementation: Verifiable In-memory Map (Simulating Redis/Hot Cache).
 */
export declare class LizardLayer implements MemoryLayer {
    name: 'LIZARD';
    private cache;
    store(key: string, value: any, ttlSeconds?: number): Promise<void>;
    recall(key: string): Promise<any>;
    private generateChecksum;
    private verifyEntry;
}
/**
 * The Mammal Brain: Associative, emotional, relational.
 * Implementation: Relational Interface with Limbic Weighting.
 */
export declare class MammalLayer implements MemoryLayer {
    name: 'MAMMAL';
    private associativeNodes;
    store(key: string, value: any): Promise<void>;
    recall(key: string): Promise<any>;
    /**
     * Relational Retrieval: Gets nodes related to a key, weighted by sentiment.
     */
    recallRelational(keyContext: string): Promise<any[]>;
    searchByTag(tag: string): Promise<any[]>;
    getRecent(count?: number): Promise<any[]>;
}
/**
 * The Cosmic Brain: Permanent, holographic, distributed.
 * Implementation: HMAC-SHA256 Merkle-Ledger (Simulating Immutable Ledger).
 */
export declare class CosmicLayer implements MemoryLayer {
    name: 'COSMIC';
    private log;
    private currentHMAC;
    private readonly SECRET;
    constructor();
    store(key: string, value: any): Promise<void>;
    recall(key: string): Promise<any>;
    /**
     * Permanent Retrieval: Gets the entire history for a key (Temporal Scan)
     */
    recallHistory(key: string): Promise<any[]>;
    /**
     * Cryptographic Integrity Check
     * Verifies that the soul of the ledger has not been severed.
     */
    verifyIntegrity(): boolean;
    getCurrentRoot(): string;
    private save;
    private load;
}
/**
 * The Triune Memory System Manager
 */
export declare class TriuneMemory {
    lizard: LizardLayer;
    mammal: MammalLayer;
    cosmic: CosmicLayer;
    initialize(): Promise<void>;
    /**
     * Automatic routing of memory based on "Evolutionary Priority"
     */
    remember(key: string, value: any, context: 'SURVIVAL' | 'SOCIAL' | 'WISDOM'): Promise<void>;
}
export declare const memorySystem: TriuneMemory;
