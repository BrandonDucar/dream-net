
import { type Commitment, type BlobMetadata } from '@dreamnet/dream-blob-store';

/**
 * BlobIndex (Lightweight Memory Client)
 * 
 * Replaces the heavy "VectorStore" / "MemoryDNA" dependency.
 * Stores only cryptographic commitments and metadata tags.
 * 
 * "We don't remember the details. We remember the pointers."
 */
export class BlobIndex {
    private index: Map<Commitment, BlobMetadata> = new Map();
    private tagsIndex: Map<string, Set<Commitment>> = new Map();
    private embeddings: Map<Commitment, number[]> = new Map();

    constructor() { }

    /**
     * Index a blob commitment with its embedding
     */
    add(metadata: BlobMetadata, embedding?: number[]) {
        this.index.set(metadata.commitment, metadata);
        if (embedding) {
            this.embeddings.set(metadata.commitment, embedding);
        }

        metadata.tags?.forEach(tag => {
            if (!this.tagsIndex.has(tag)) {
                this.tagsIndex.set(tag, new Set());
            }
            this.tagsIndex.get(tag)?.add(metadata.commitment);
        });
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        if (vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Semantic Search using cosine similarity
     */
    async semanticSearch(queryVector: number[], limit = 5): Promise<BlobMetadata[]> {
        const results = Array.from(this.embeddings.entries()).map(([commitment, vector]) => ({
            commitment,
            score: this.cosineSimilarity(queryVector, vector)
        }));

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(r => this.index.get(r.commitment)!);
    }
}

export const blobIndex = new BlobIndex();
