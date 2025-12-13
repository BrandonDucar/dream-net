/**
 * Latent Space Encoding/Decoding
 * Converts agent thoughts to/from latent vector representations
 */

import OpenAI from 'openai';
import type { LatentVector, LatentThought } from './types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = process.env.LATENT_EMBEDDING_MODEL || 'text-embedding-3-small';
const VECTOR_SIZE = parseInt(process.env.LATENT_VECTOR_SIZE || '1536');

let openaiClient: OpenAI | null = null;

if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
}

/**
 * Simple hash-based encoding fallback (when OpenAI API unavailable)
 */
function hashEncode(text: string, dimension: number = 1536): number[] {
  const vector = new Array(dimension).fill(0);
  const hash = simpleHash(text);
  
  // Distribute hash across vector dimensions
  for (let i = 0; i < dimension; i++) {
    const seed = hash + i * 31;
    vector[i] = Math.sin(seed) * 0.5 + 0.5; // Normalize to [0, 1]
  }
  
  return vector;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Encode agent thought to latent representation
 */
export async function encodeToLatent(
  thought: string,
  agentId: string
): Promise<LatentVector> {
  try {
    // Try OpenAI embeddings API first (with circuit breaker protection)
    if (openaiClient) {
      // Check if circuit breaker is available
      let response;
      try {
        const { withCircuitBreaker } = await import('../../../server/core/circuit-breaker');
        response = await withCircuitBreaker('openai-embeddings', async () => {
          return await openaiClient!.embeddings.create({
            model: EMBEDDING_MODEL,
            input: thought,
          });
        });
      } catch (circuitError: any) {
        // Circuit breaker open or not available - use fallback
        if (circuitError.message?.includes('Circuit breaker') || circuitError.message?.includes('not found')) {
          console.warn('[LatentSpace] Circuit breaker protection unavailable or open, using fallback');
          throw circuitError; // Will be caught below
        }
        // Otherwise, try direct call (backward compatibility)
        response = await openaiClient.embeddings.create({
          model: EMBEDDING_MODEL,
          input: thought,
        });
      }
      
      const vector = response.data[0].embedding;
      
      return {
        vector,
        dimension: vector.length,
        model: EMBEDDING_MODEL,
      };
    }
  } catch (error) {
    console.warn('[LatentSpace] OpenAI encoding failed, using fallback:', error instanceof Error ? error.message : String(error));
  }
  
  // Fallback to hash-based encoding
  const vector = hashEncode(`${agentId}:${thought}`, VECTOR_SIZE);
  
  return {
    vector,
    dimension: VECTOR_SIZE,
    model: 'hash-fallback',
  };
}

/**
 * Decode latent representation back to text
 * Note: This is a lossy operation - we can't perfectly reconstruct text from vectors
 * We return the original thought if available, or a similarity-based approximation
 */
export async function decodeLatent(
  latent: LatentVector,
  originalThought?: string
): Promise<string> {
  // If we have the original thought, return it
  if (originalThought) {
    return originalThought;
  }
  
  // Otherwise, we can't perfectly decode - return a placeholder
  // In practice, we should always store originalThought alongside latent vectors
  return `[Decoded from latent vector, dimension: ${latent.dimension}]`;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same dimension');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  
  return dotProduct / denominator;
}

/**
 * Find similar latent thoughts
 */
export async function findSimilarLatents(
  query: LatentVector,
  candidates: LatentThought[],
  limit: number = 10
): Promise<LatentThought[]> {
  // Calculate similarity for each candidate
  const withSimilarity = candidates.map(candidate => ({
    ...candidate,
    similarity: cosineSimilarity(query.vector, candidate.latentVector.vector),
  }));
  
  // Sort by similarity (descending)
  withSimilarity.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  
  // Return top N
  return withSimilarity.slice(0, limit);
}

