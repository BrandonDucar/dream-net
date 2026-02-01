import { Pool } from 'pg';
import { withCircuitBreaker } from '../core/circuit-breaker';

export interface LatentSession {
    id?: number;
    session_id: string;
    agent_id: string;
    context_summary: string;
    embedding_vector: number[];
    metadata?: Record<string, any>;
    created_at?: Date;
    updated_at?: Date;
    expires_at?: Date;
}

export class LatentCollaborationService {
    private static instance: LatentCollaborationService;
    private pool: Pool;
    private enabled: boolean;

    private constructor() {
        this.enabled = process.env.USE_LATENT_COLLABORATION === 'true';

        if (this.enabled) {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
            });
        }
    }

    public static getInstance(): LatentCollaborationService {
        if (!LatentCollaborationService.instance) {
            LatentCollaborationService.instance = new LatentCollaborationService();
        }
        return LatentCollaborationService.instance;
    }

    /**
     * Create a latent session (agent shares context)
     */
    public async createSession(session: Omit<LatentSession, 'id' | 'created_at' | 'updated_at'>): Promise<LatentSession | null> {
        if (!this.enabled) {
            console.log('⚠️ Latent Collaboration disabled');
            return null;
        }

        try {
            // Wrap DB query with circuit breaker
            return await withCircuitBreaker('db-latent-session', async () => {
                const result = await this.pool.query(
                    `INSERT INTO latent_sessions (session_id, agent_id, context_summary, embedding_vector, metadata, expires_at)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING *`,
                    [
                        session.session_id,
                        session.agent_id,
                        session.context_summary,
                        session.embedding_vector,
                        JSON.stringify(session.metadata || {}),
                        session.expires_at,
                    ]
                );
                return result.rows[0];
            });
        } catch (error) {
            console.error('❌ Failed to create latent session:', error);
            return null;
        }
    }

    /**
     * Get recent sessions from other agents
     */
    public async getRecentSessions(currentAgentId: string, limit: number = 10): Promise<LatentSession[]> {
        if (!this.enabled) {
            return [];
        }

        try {
            // Wrap DB query with circuit breaker
            return await withCircuitBreaker('db-latent-session', async () => {
                const result = await this.pool.query(
                    `SELECT * FROM latent_sessions
                     WHERE agent_id != $1
                     AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
                     ORDER BY created_at DESC
                     LIMIT $2`,
                    [currentAgentId, limit]
                );
                return result.rows;
            });
        } catch (error) {
            console.error('❌ Failed to get latent sessions:', error);
            return [];
        }
    }

    /**
     * Generate embedding using OpenAI (or fallback to hash)
     */
    public async generateEmbedding(text: string): Promise<number[]> {
        if (!this.enabled) {
            return this.hashBasedEmbedding(text);
        }

        try {
            // Wrap embedding generation with circuit breaker
            return await withCircuitBreaker('openai-embeddings', async () => {
                // TODO: Integrate with OpenAI embeddings API
                // For now, use hash-based fallback as a simulation
                return this.hashBasedEmbedding(text);
            });
        } catch (error) {
            console.error('❌ Failed to generate embedding, using fallback:', error);
            return this.hashBasedEmbedding(text);
        }
    }

    /**
     * Fallback: Hash-based embedding (deterministic)
     */
    private hashBasedEmbedding(text: string): number[] {
        const hash = this.simpleHash(text);
        const embedding = new Array(128).fill(0);

        for (let i = 0; i < 128; i++) {
            embedding[i] = ((hash >> i) & 1) ? 1 : -1;
        }

        return embedding;
    }

    private simpleHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash;
    }

    /**
     * Cleanup expired sessions
     */
    public async cleanupExpiredSessions(): Promise<number> {
        if (!this.enabled) {
            return 0;
        }

        try {
            return await withCircuitBreaker('db-latent-session', async () => {
                const result = await this.pool.query('SELECT cleanup_expired_latent_sessions()');
                return result.rows[0].cleanup_expired_latent_sessions;
            });
        } catch (error) {
            console.error('❌ Failed to cleanup expired sessions:', error);
            return 0;
        }
    }
}
