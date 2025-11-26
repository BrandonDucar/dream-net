/**
 * Detector Generator
 *
 * Implements negative selection algorithm for generating and evolving detectors
 * Generates random detector patterns, tests against "self" baseline,
 * keeps detectors that don't match self (non-self detectors)
 */
import type { BaselinePattern } from "./selfBaseline.js";
import SelfBaseline from "./selfBaseline.js";
import type { AnomalyPattern } from "./nonSelfDetector.js";
export interface Detector {
    id: string;
    pattern: Record<string, {
        min: number;
        max: number;
    }>;
    generation: number;
    fitness: number;
    falsePositives: number;
    falseNegatives: number;
    truePositives: number;
    trueNegatives: number;
    createdAt: string;
    lastUsed: string;
}
export declare class DetectorGenerator {
    private selfBaseline;
    private detectors;
    private readonly MAX_DETECTORS;
    private readonly MIN_FITNESS;
    constructor(selfBaseline: SelfBaseline);
    /**
     * Generate a random detector pattern
     */
    private generateRandomDetector;
    /**
     * Test detector against self baseline
     * Returns true if detector doesn't match self (good detector)
     */
    private testDetectorAgainstSelf;
    /**
     * Generate detectors using negative selection
     */
    generateDetectors(count?: number, categories?: BaselinePattern["category"][]): Promise<Detector[]>;
    /**
     * Test a metric value against a detector
     */
    testValue(detector: Detector, metricName: string, value: number): boolean;
    /**
     * Update detector fitness based on detection results
     */
    updateDetectorFitness(detectorId: string, isTruePositive: boolean, isFalsePositive: boolean, isFalseNegative: boolean, isTrueNegative: boolean): void;
    /**
     * Evolve detectors: remove low-fitness, clone high-fitness
     */
    evolveDetectors(): Promise<void>;
    /**
     * Get all detectors
     */
    getDetectors(): Detector[];
    /**
     * Get best detectors (highest fitness)
     */
    getBestDetectors(limit?: number): Detector[];
    /**
     * Convert detector to anomaly pattern for threat recognition
     */
    detectorToAnomalyPattern(detector: Detector): AnomalyPattern;
}
export default DetectorGenerator;
