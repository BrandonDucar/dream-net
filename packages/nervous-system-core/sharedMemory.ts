/**
 * Shared Memory Implementation
 * 
 * Three-layer memory system:
 * - KV: Key-value storage with TTL
 * - Doc: Document storage with query
 * - Vec: Vector storage (uses Neural Mesh)
 */

import { NeuralMesh } from '@dreamnet/neural-mesh';
import type { SharedMemory, SharedMemoryKV, SharedMemoryDoc, SharedMemoryVec } from './types';

interface KVEntry<T> {
  value: T;
  expiresAt?: number;
}

class SharedMemoryKVImpl implements SharedMemoryKV {
  private store: Map<string, KVEntry<any>> = new Map();
  
  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return entry.value as T;
  }
  
  async put<T>(key: string, value: T, ttlSec?: number): Promise<void> {
    const expiresAt = ttlSec ? Date.now() + ttlSec * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
  }
  
  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
  
  size(): number {
    return this.store.size;
  }
  
  clear(): void {
    this.store.clear();
  }
}

class SharedMemoryDocImpl implements SharedMemoryDoc {
  private store: Map<string, Record<string, any>> = new Map();
  
  async read(id: string): Promise<Record<string, any> | null> {
    return this.store.get(id) ?? null;
  }
  
  async upsert(id: string, doc: Record<string, any>): Promise<void> {
    const existing = this.store.get(id);
    const merged = {
      ...existing,
      ...doc,
      _id: id,
      _updatedAt: Date.now(),
      _createdAt: existing?._createdAt ?? Date.now(),
    };
    this.store.set(id, merged);
  }
  
  async query(q: Record<string, any>): Promise<Record<string, any>[]> {
    const results: Record<string, any>[] = [];
    
    for (const [id, doc] of this.store.entries()) {
      let matches = true;
      for (const [key, value] of Object.entries(q)) {
        if (doc[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) {
        results.push({ id, ...doc });
      }
    }
    
    return results;
  }
  
  size(): number {
    return this.store.size;
  }
  
  clear(): void {
    this.store.clear();
  }
}

class SharedMemoryVecImpl implements SharedMemoryVec {
  async upsert(id: string, embedding: number[], meta?: Record<string, any>): Promise<void> {
    // Use Neural Mesh's latent memory store
    await NeuralMesh.storeLatent('shared-memory', embedding, JSON.stringify(meta ?? {}), {
      id,
      ...meta,
    });
  }
  
  async search(
    embedding: number[], 
    k: number, 
    filter?: Record<string, any>
  ): Promise<Array<{ id: string; score: number; meta: any }>> {
    // Use Neural Mesh's latent memory retrieval
    const results = await NeuralMesh.retrieveLatent(embedding, k);
    
    // Filter results if filter provided
    let filtered = results;
    if (filter) {
      filtered = results.filter(r => {
        if (!r.metadata) return false;
        for (const [key, value] of Object.entries(filter)) {
          if (r.metadata[key] !== value) return false;
        }
        return true;
      });
    }
    
    return filtered.map(r => ({
      id: r.id,
      score: 0.8, // Placeholder - Neural Mesh doesn't return scores yet
      meta: r.metadata ?? {},
    }));
  }
  
  async getAgentHistory(agentId: string, limit?: number): Promise<Array<{ id: string; score: number; meta: any }>> {
    const results = await NeuralMesh.getAgentLatentHistory(agentId, limit);
    return results.map(r => ({
      id: r.id,
      score: 0.8,
      meta: r.metadata ?? {},
    }));
  }
}

class SharedMemoryImpl implements SharedMemory {
  kv: SharedMemoryKV = new SharedMemoryKVImpl();
  doc: SharedMemoryDoc = new SharedMemoryDocImpl();
  vec: SharedMemoryVec = new SharedMemoryVecImpl();
  
  getStats() {
    return {
      kv: {
        size: (this.kv as SharedMemoryKVImpl).size(),
      },
      doc: {
        size: (this.doc as SharedMemoryDocImpl).size(),
      },
      vec: {
        // Vec size would need to be tracked separately if needed
        provider: 'neural-mesh',
      },
    };
  }
  
  clear(): void {
    (this.kv as SharedMemoryKVImpl).clear();
    (this.doc as SharedMemoryDocImpl).clear();
  }
}

export const sharedMemory = new SharedMemoryImpl();

