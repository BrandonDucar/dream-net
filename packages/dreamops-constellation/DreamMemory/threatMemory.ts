/**
 * Threat Memory System
 * 
 * Extends DreamMemory to store threat patterns, signatures, and response effectiveness
 * Based on immune system's memory of past threats
 */

import type DreamMemory from "./index.js";
import type { MemoryEntry } from "./index.js";

export interface ThreatSignature {
  id: string;
  pattern: string; // Description of the threat pattern
  metrics: Record<string, number>; // Metric values that indicate this threat
  embedding?: number[]; // Embedding for similarity search
  frequency: number; // How often this threat occurs
  firstSeen: string;
  lastSeen: string;
  version: number;
}

export interface ThreatResponse {
  threatId: string;
  responseStage: 0 | 1 | 2 | 3;
  actions: string[]; // Actions taken
  success: boolean;
  responseTime: number; // milliseconds
  resolvedAt: string;
  metadata?: Record<string, any>;
}

export interface ThreatEvolution {
  threatId: string;
  changes: Array<{
    timestamp: string;
    metric: string;
    oldValue: number;
    newValue: number;
    reason?: string;
  }>;
}

export interface FalsePositiveRecord {
  id: string;
  threatId: string;
  detectedAt: string;
  verifiedAsFalse: string;
  reason: string;
}

export interface FalseNegativeRecord {
  id: string;
  threatId: string;
  missedAt: string;
  discoveredAt: string;
  impact: "low" | "medium" | "high" | "critical";
}

export class ThreatMemory {
  private dreamMemory: DreamMemory;
  private threatSignatures: Map<string, ThreatSignature> = new Map();
  private threatResponses: Map<string, ThreatResponse[]> = new Map();
  private falsePositives: Map<string, FalsePositiveRecord> = new Map();
  private falseNegatives: Map<string, FalseNegativeRecord> = new Map();

  constructor(dreamMemory: DreamMemory) {
    this.dreamMemory = dreamMemory;
  }

  /**
   * Store a threat signature
   */
  async storeThreatSignature(signature: Omit<ThreatSignature, "id" | "version" | "firstSeen" | "lastSeen">): Promise<ThreatSignature> {
    const existing = await this.dreamMemory.recall("ops", `threat:${signature.pattern}`);
    
    let threatSig: ThreatSignature;
    if (existing) {
      const existingSig = existing.content as ThreatSignature;
      threatSig = {
        ...existingSig,
        ...signature,
        frequency: existingSig.frequency + 1,
        lastSeen: new Date().toISOString(),
        version: existingSig.version + 1,
      };
    } else {
      threatSig = {
        id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...signature,
        frequency: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        version: 1,
      };
    }

    // Generate embedding if not provided
    if (!threatSig.embedding) {
      threatSig.embedding = await this.dreamMemory.generateEmbedding({
        pattern: threatSig.pattern,
        metrics: threatSig.metrics,
      });
    }

    // Store in DreamMemory
    await this.dreamMemory.store("ops", `threat:${threatSig.id}`, threatSig, {
      type: "threat_signature",
      pattern: threatSig.pattern,
      version: threatSig.version,
    });

    this.threatSignatures.set(threatSig.id, threatSig);
    return threatSig;
  }

  /**
   * Record a response to a threat
   */
  async recordThreatResponse(response: ThreatResponse): Promise<void> {
    const responses = this.threatResponses.get(response.threatId) || [];
    responses.push(response);
    this.threatResponses.set(response.threatId, responses);

    // Store in DreamMemory
    await this.dreamMemory.store("ops", `threat-response:${response.threatId}:${Date.now()}`, response, {
      type: "threat_response",
      threatId: response.threatId,
      success: response.success,
    });

    // Update threat signature frequency
    const signature = this.threatSignatures.get(response.threatId);
    if (signature) {
      signature.frequency++;
      signature.lastSeen = new Date().toISOString();
      await this.dreamMemory.store("ops", `threat:${signature.id}`, signature);
    }
  }

  /**
   * Get response effectiveness for a threat
   */
  async getResponseEffectiveness(threatId: string): Promise<{
    totalResponses: number;
    successfulResponses: number;
    successRate: number;
    averageResponseTime: number;
    bestResponseStage: 0 | 1 | 2 | 3 | undefined;
  }> {
    const responses = this.threatResponses.get(threatId) || [];
    
    if (responses.length === 0) {
      return {
        totalResponses: 0,
        successfulResponses: 0,
        successRate: 0,
        averageResponseTime: 0,
        bestResponseStage: undefined,
      };
    }

    const successful = responses.filter(r => r.success);
    const successRate = successful.length / responses.length;
    
    const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length;

    // Find best response stage (highest success rate)
    const byStage: Record<0 | 1 | 2 | 3, { total: number; successful: number }> = {
      0: { total: 0, successful: 0 },
      1: { total: 0, successful: 0 },
      2: { total: 0, successful: 0 },
      3: { total: 0, successful: 0 },
    };

    for (const response of responses) {
      byStage[response.responseStage].total++;
      if (response.success) {
        byStage[response.responseStage].successful++;
      }
    }

    let bestStage: 0 | 1 | 2 | 3 | undefined;
    let bestRate = 0;
    for (const [stage, stats] of Object.entries(byStage) as Array<[string, { total: number; successful: number }]>) {
      if (stats.total > 0) {
        const rate = stats.successful / stats.total;
        if (rate > bestRate) {
          bestRate = rate;
          bestStage = parseInt(stage) as 0 | 1 | 2 | 3;
        }
      }
    }

    return {
      totalResponses: responses.length,
      successfulResponses: successful.length,
      successRate,
      averageResponseTime,
      bestResponseStage: bestStage,
    };
  }

  /**
   * Record a false positive
   */
  async recordFalsePositive(
    threatId: string,
    reason: string
  ): Promise<FalsePositiveRecord> {
    const record: FalsePositiveRecord = {
      id: `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      threatId,
      detectedAt: new Date().toISOString(),
      verifiedAsFalse: new Date().toISOString(),
      reason,
    };

    this.falsePositives.set(record.id, record);
    await this.dreamMemory.store("ops", `false-positive:${record.id}`, record, {
      type: "false_positive",
      threatId,
    });

    return record;
  }

  /**
   * Record a false negative
   */
  async recordFalseNegative(
    threatId: string,
    impact: "low" | "medium" | "high" | "critical"
  ): Promise<FalseNegativeRecord> {
    const record: FalseNegativeRecord = {
      id: `fn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      threatId,
      missedAt: new Date(Date.now() - 3600000).toISOString(), // Assume missed 1 hour ago
      discoveredAt: new Date().toISOString(),
      impact,
    };

    this.falseNegatives.set(record.id, record);
    await this.dreamMemory.store("ops", `false-negative:${record.id}`, record, {
      type: "false_negative",
      threatId,
      impact,
    });

    return record;
  }

  /**
   * Track threat evolution
   */
  async trackThreatEvolution(
    threatId: string,
    metric: string,
    oldValue: number,
    newValue: number,
    reason?: string
  ): Promise<void> {
    const evolutionKey = `threat-evolution:${threatId}`;
    const existing = await this.dreamMemory.recall("ops", evolutionKey);
    
    let evolution: ThreatEvolution;
    if (existing) {
      evolution = existing.content as ThreatEvolution;
    } else {
      evolution = {
        threatId,
        changes: [],
      };
    }

    evolution.changes.push({
      timestamp: new Date().toISOString(),
      metric,
      oldValue,
      newValue,
      reason,
    });

    await this.dreamMemory.store("ops", evolutionKey, evolution, {
      type: "threat_evolution",
      threatId,
    });
  }

  /**
   * Search threats by similarity (using embeddings)
   */
  async searchSimilarThreats(
    queryEmbedding: number[],
    limit: number = 10
  ): Promise<Array<{ threat: ThreatSignature; similarity: number }>> {
    const threats = Array.from(this.threatSignatures.values());
    const similarities: Array<{ threat: ThreatSignature; similarity: number }> = [];

    for (const threat of threats) {
      if (!threat.embedding) {
        continue;
      }

      const similarity = this.cosineSimilarity(queryEmbedding, threat.embedding);
      similarities.push({ threat, similarity });
    }

    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, limit);
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Get threat signature by ID
   */
  async getThreatSignature(threatId: string): Promise<ThreatSignature | undefined> {
    // Check cache
    if (this.threatSignatures.has(threatId)) {
      return this.threatSignatures.get(threatId);
    }

    // Load from DreamMemory
    const memory = await this.dreamMemory.recall("ops", `threat:${threatId}`);
    if (memory) {
      const signature = memory.content as ThreatSignature;
      this.threatSignatures.set(threatId, signature);
      return signature;
    }

    return undefined;
  }

  /**
   * Get all threat signatures
   */
  getAllThreatSignatures(): ThreatSignature[] {
    return Array.from(this.threatSignatures.values());
  }

  /**
   * Get false positive/negative statistics
   */
  getFalsePositiveNegativeStats(): {
    totalFalsePositives: number;
    totalFalseNegatives: number;
    falsePositiveRate: number; // Based on total detections
    falseNegativeRate: number; // Based on total threats
  } {
    const totalThreats = this.threatSignatures.size;
    const totalFalsePositives = this.falsePositives.size;
    const totalFalseNegatives = this.falseNegatives.size;

    // Calculate rates (simplified - would need total detections in real system)
    const totalDetections = totalThreats + totalFalsePositives;
    const falsePositiveRate = totalDetections > 0 ? totalFalsePositives / totalDetections : 0;
    const falseNegativeRate = totalThreats > 0 ? totalFalseNegatives / totalThreats : 0;

    return {
      totalFalsePositives,
      totalFalseNegatives,
      falsePositiveRate,
      falseNegativeRate,
    };
  }
}

export default ThreatMemory;

