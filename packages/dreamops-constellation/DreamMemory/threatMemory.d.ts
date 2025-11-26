/**
 * Threat Memory System
 *
 * Extends DreamMemory to store threat patterns, signatures, and response effectiveness
 * Based on immune system's memory of past threats
 */
import type DreamMemory from "./index.js";
export interface ThreatSignature {
    id: string;
    pattern: string;
    metrics: Record<string, number>;
    embedding?: number[];
    frequency: number;
    firstSeen: string;
    lastSeen: string;
    version: number;
}
export interface ThreatResponse {
    threatId: string;
    responseStage: 0 | 1 | 2 | 3;
    actions: string[];
    success: boolean;
    responseTime: number;
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
export declare class ThreatMemory {
    private dreamMemory;
    private threatSignatures;
    private threatResponses;
    private falsePositives;
    private falseNegatives;
    constructor(dreamMemory: DreamMemory);
    /**
     * Store a threat signature
     */
    storeThreatSignature(signature: Omit<ThreatSignature, "id" | "version" | "firstSeen" | "lastSeen">): Promise<ThreatSignature>;
    /**
     * Record a response to a threat
     */
    recordThreatResponse(response: ThreatResponse): Promise<void>;
    /**
     * Get response effectiveness for a threat
     */
    getResponseEffectiveness(threatId: string): Promise<{
        totalResponses: number;
        successfulResponses: number;
        successRate: number;
        averageResponseTime: number;
        bestResponseStage: 0 | 1 | 2 | 3 | undefined;
    }>;
    /**
     * Record a false positive
     */
    recordFalsePositive(threatId: string, reason: string): Promise<FalsePositiveRecord>;
    /**
     * Record a false negative
     */
    recordFalseNegative(threatId: string, impact: "low" | "medium" | "high" | "critical"): Promise<FalseNegativeRecord>;
    /**
     * Track threat evolution
     */
    trackThreatEvolution(threatId: string, metric: string, oldValue: number, newValue: number, reason?: string): Promise<void>;
    /**
     * Search threats by similarity (using embeddings)
     */
    searchSimilarThreats(queryEmbedding: number[], limit?: number): Promise<Array<{
        threat: ThreatSignature;
        similarity: number;
    }>>;
    /**
     * Calculate cosine similarity between two embeddings
     */
    private cosineSimilarity;
    /**
     * Get threat signature by ID
     */
    getThreatSignature(threatId: string): Promise<ThreatSignature | undefined>;
    /**
     * Get all threat signatures
     */
    getAllThreatSignatures(): ThreatSignature[];
    /**
     * Get false positive/negative statistics
     */
    getFalsePositiveNegativeStats(): {
        totalFalsePositives: number;
        totalFalseNegatives: number;
        falsePositiveRate: number;
        falseNegativeRate: number;
    };
}
export default ThreatMemory;
