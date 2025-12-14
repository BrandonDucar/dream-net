/**
 * Latent Memory Storage for Neural Mesh
 * Stores and retrieves latent representations for agent collaboration
 */

// Define types locally to avoid circular dependency
export interface LatentMemory {
  id: string;
  agentId: string;
  latentRep: number[];
  originalThought: string;
  timestamp: Date;
  metadata?: {
    task?: string;
    context?: Record<string, any>;
    relatedAgents?: string[];
    onchainContext?: {
      chain?: string;
      walletAddress?: string;
      tokenAddress?: string;
      amount?: string;
    };
  };
}

export interface LatentMetadata {
  task?: string;
  context?: Record<string, any>;
  relatedAgents?: string[];
  onchainContext?: {
    chain?: string;
    walletAddress?: string;
    tokenAddress?: string;
    amount?: string;
  };
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
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

const latentMemories: Map<string, LatentMemory> = new Map();
const MAX_LATENT_MEMORIES = 50000; // Prevent unbounded growth

/**
 * Generate unique ID for latent memory
 */
function generateLatentId(agentId: string): string {
  return `${agentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Latent Memory Store
 */
export const latentMemoryStore = {
  /**
   * Store latent representation
   */
  async storeLatent(
    agentId: string,
    latentRep: number[],
    originalThought: string,
    metadata?: LatentMetadata
  ): Promise<string> {
    const id = generateLatentId(agentId);
    
    const memory: LatentMemory = {
      id,
      agentId,
      latentRep,
      originalThought,
      timestamp: new Date(),
      metadata,
    };
    
    latentMemories.set(id, memory);
    
    // Prune if over limit
    if (latentMemories.size > MAX_LATENT_MEMORIES) {
      // Remove oldest 10%
      const toRemove = Math.floor(MAX_LATENT_MEMORIES * 0.1);
      const entries = Array.from(latentMemories.entries());
      entries.sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime());
      
      for (let i = 0; i < toRemove; i++) {
        latentMemories.delete(entries[i][0]);
      }
    }
    
    return id;
  },

  /**
   * Retrieve similar latent representations
   */
  async retrieveLatent(
    query: number[] | string,
    limit: number = 10,
    agentId?: string
  ): Promise<LatentMemory[]> {
    let queryVector: number[];
    
    // If query is a string, we need to encode it first
    // For now, we'll require the caller to provide a vector
    // In practice, this would use the latentSpace.encodeToLatent function
    if (typeof query === 'string') {
      // Simple fallback: create a hash-based vector
      // In practice, this should use encodeToLatent from latent-collaboration
      queryVector = hashStringToVector(query);
    } else {
      queryVector = query;
    }
    
    // Calculate similarity for all memories
    const withSimilarity = Array.from(latentMemories.values())
      .map((memory) => {
        // Filter by agentId if provided
        if (agentId && memory.agentId !== agentId) {
          return null;
        }
        
        try {
          const similarity = cosineSimilarity(queryVector, memory.latentRep);
          return {
            ...memory,
            similarity,
          };
        } catch (error) {
          // Vectors might have different dimensions
          return null;
        }
      })
      .filter((m): m is LatentMemory & { similarity: number } => m !== null);
    
    // Sort by similarity (descending)
    withSimilarity.sort((a, b) => b.similarity - a.similarity);
    
    // Return top N
    return withSimilarity.slice(0, limit).map(({ similarity, ...memory }) => memory);
  },

  /**
   * Get agent's latent history
   */
  async getAgentLatentHistory(
    agentId: string,
    limit: number = 50
  ): Promise<LatentMemory[]> {
    const memories = Array.from(latentMemories.values())
      .filter((m) => m.agentId === agentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return memories;
  },

  /**
   * Get latent memory by ID
   */
  getLatentMemory(id: string): LatentMemory | undefined {
    return latentMemories.get(id);
  },

  /**
   * Clear latent memories (for testing/cleanup)
   */
  clear(): void {
    latentMemories.clear();
  },

  /**
   * Get status
   */
  status(): { count: number; agents: Set<string> } {
    const agents = new Set<string>();
    latentMemories.forEach((memory) => {
      agents.add(memory.agentId);
    });
    
    return {
      count: latentMemories.size,
      agents,
    };
  },
};

/**
 * Simple hash-based vector generation (fallback)
 */
function hashStringToVector(str: string, dimension: number = 1536): number[] {
  const vector = new Array(dimension).fill(0);
  const hash = simpleHash(str);
  
  for (let i = 0; i < dimension; i++) {
    const seed = hash + i * 31;
    vector[i] = Math.sin(seed) * 0.5 + 0.5;
  }
  
  return vector;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

