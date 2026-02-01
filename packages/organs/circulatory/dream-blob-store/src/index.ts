/**
 * Dream Blob Store (Danksharding Hijack)
 * Ephemeral storage for raw sensory data ("Blobs")
 * 
 * Philosophy: 
 * "Memory is expensive. Details fade. Only the impression remains."
 */

export type BlobId = string;
export type Commitment = string;

export interface BlobMetadata {
    id: BlobId;
    size: number;
    mimeType: string;
    createdAt: number;
    expiresAt: number;
    commitment: Commitment; // SHA-256 or KZG commitment
    tags?: string[];
}

export interface BlobStore {
    /**
     * Store a blob (ephemeral)
     * @returns Metadata including the Commitment
     */
    put(data: Uint8Array | string, mimeType: string, ttlSeconds?: number): Promise<BlobMetadata>;

    /**
     * Retrieve a blob by ID or Commitment
     */
    get(id: BlobId): Promise<Uint8Array | null>;

    /**
     * Resolve a commitment to data (verifies integrity)
     */
    resolve(commitment: Commitment): Promise<Uint8Array | null>;

    /**
     * Prune expired blobs (Garbage Collection)
     */
    prune(): Promise<number>;
}

export * from './adapters/FileSystemAdapter.js';
export * from './subscribers/MemorySyncSubscriber.js';
