/**
 * Semantic Inbox Service
 * 
 * Orchestrates the flow:
 * Email -> Integration -> BrainGate (Embedding) -> BlobIndex (Memory)
 */

import { brainGate } from '../../../nerve/src/spine/BrainGate.js';
import { blobIndex } from '../../../dreamstate/logic/BlobIndex.js';

export class SemanticInboxService {
    /**
     * Ingest an email message into the vectorized storage
     */
    async ingestEmail(to: string, subject: string, body: string, metadata: any = {}) {
        console.log(`🧬 [Semantic Inbox] Ingesting pulse: ${subject}`);

        // 1. Generate Embedding
        const contentForEmbedding = `Subject: ${subject}\n\nBody: ${body}`;
        const vector = await brainGate.embed(contentForEmbedding);

        // 2. Store in Memory
        const commitment = `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const blobMetadata = {
            id: commitment,
            commitment,
            size: Buffer.byteLength(body),
            mimeType: 'text/plain',
            createdAt: Date.now(),
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
            tags: ['email', 'inbox', ... (metadata?.tags || [])]
        };

        blobIndex.add(blobMetadata, vector);

        console.log(`✅ [Semantic Inbox] Vectorized and stored: ${commitment}`);
        return commitment;
    }

    /**
     * Search the inbox using natural language
     */
    async search(query: string, limit = 3) {
        console.log(`🔎 [Semantic Inbox] Searching memory for: "${query}"`);

        const queryVector = await brainGate.embed(query);
        const results = await blobIndex.semanticSearch(queryVector, limit);

        return results;
    }
}

export const semanticInboxService = new SemanticInboxService();
