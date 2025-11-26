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
  pattern: Record<string, { min: number; max: number }>; // Metric ranges
  generation: number;
  fitness: number; // 0-1, based on false positive/negative rates
  falsePositives: number;
  falseNegatives: number;
  truePositives: number;
  trueNegatives: number;
  createdAt: string;
  lastUsed: string;
}

export class DetectorGenerator {
  private selfBaseline: SelfBaseline;
  private detectors: Map<string, Detector> = new Map();
  private readonly MAX_DETECTORS = 1000;
  private readonly MIN_FITNESS = 0.3; // Remove detectors below this fitness

  constructor(selfBaseline: SelfBaseline) {
    this.selfBaseline = selfBaseline;
  }

  /**
   * Generate a random detector pattern
   */
  private generateRandomDetector(
    categories: BaselinePattern["category"][],
    generation: number = 1
  ): Detector {
    const pattern: Record<string, { min: number; max: number }> = {};

    // For each category, pick a random metric and create a range
    for (const category of categories) {
      // Get baselines for this category
      this.selfBaseline.getBaselinesByCategory(category).then(baselines => {
        if (baselines.length > 0) {
          const randomBaseline = baselines[Math.floor(Math.random() * baselines.length)];
          const metricName = randomBaseline.metrics[0]?.name || "unknown";
          
          // Create a range that's outside the baseline (non-self)
          const mean = randomBaseline.statistics.mean;
          const stdDev = randomBaseline.statistics.stdDev;
          
          // Randomly choose to be above or below baseline
          const isAbove = Math.random() > 0.5;
          const offset = stdDev * (2 + Math.random() * 2); // 2-4 std devs away
          
          if (isAbove) {
            pattern[metricName] = {
              min: mean + offset,
              max: mean + offset * 2,
            };
          } else {
            pattern[metricName] = {
              min: mean - offset * 2,
              max: mean - offset,
            };
          }
        }
      });
    }

    return {
      id: `detector-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pattern,
      generation,
      fitness: 0.5, // Initial fitness
      falsePositives: 0,
      falseNegatives: 0,
      truePositives: 0,
      trueNegatives: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
  }

  /**
   * Test detector against self baseline
   * Returns true if detector doesn't match self (good detector)
   */
  private async testDetectorAgainstSelf(detector: Detector): Promise<boolean> {
    for (const [metricName, range] of Object.entries(detector.pattern)) {
      // Find baseline for this metric
      const categories: BaselinePattern["category"][] = ["service_health", "deployment", "resource_usage", "integration"];
      
      for (const category of categories) {
        const baseline = await this.selfBaseline.getBaseline(category, metricName);
        if (baseline) {
          // Check if detector range overlaps with baseline range
          const baselineMin = baseline.statistics.percentile25;
          const baselineMax = baseline.statistics.percentile75;
          
          // If detector range overlaps with baseline, it matches self (bad detector)
          if (range.min <= baselineMax && range.max >= baselineMin) {
            return false; // Matches self - reject detector
          }
        }
      }
    }

    return true; // Doesn't match self - keep detector
  }

  /**
   * Generate detectors using negative selection
   */
  async generateDetectors(
    count: number = 100,
    categories: BaselinePattern["category"][] = ["service_health", "deployment", "resource_usage", "integration"]
  ): Promise<Detector[]> {
    const newDetectors: Detector[] = [];
    let attempts = 0;
    const maxAttempts = count * 10; // Try up to 10x to find valid detectors

    while (newDetectors.length < count && attempts < maxAttempts) {
      attempts++;
      
      const detector = this.generateRandomDetector(categories, 1);
      const isValid = await this.testDetectorAgainstSelf(detector);
      
      if (isValid) {
        newDetectors.push(detector);
        this.detectors.set(detector.id, detector);
      }
    }

    // Trim to max detectors if needed
    if (this.detectors.size > this.MAX_DETECTORS) {
      await this.evolveDetectors(); // Remove low-fitness detectors
    }

    return newDetectors;
  }

  /**
   * Test a metric value against a detector
   */
  testValue(detector: Detector, metricName: string, value: number): boolean {
    const range = detector.pattern[metricName];
    if (!range) {
      return false; // Detector doesn't cover this metric
    }

    return value >= range.min && value <= range.max;
  }

  /**
   * Update detector fitness based on detection results
   */
  updateDetectorFitness(
    detectorId: string,
    isTruePositive: boolean,
    isFalsePositive: boolean,
    isFalseNegative: boolean,
    isTrueNegative: boolean
  ): void {
    const detector = this.detectors.get(detectorId);
    if (!detector) {
      return;
    }

    if (isTruePositive) detector.truePositives++;
    if (isFalsePositive) detector.falsePositives++;
    if (isFalseNegative) detector.falseNegatives++;
    if (isTrueNegative) detector.trueNegatives++;

    // Calculate fitness: (TP + TN) / (TP + TN + FP + FN)
    const total = detector.truePositives + detector.trueNegatives + 
                  detector.falsePositives + detector.falseNegatives;
    
    if (total > 0) {
      detector.fitness = (detector.truePositives + detector.trueNegatives) / total;
    }

    detector.lastUsed = new Date().toISOString();
  }

  /**
   * Evolve detectors: remove low-fitness, clone high-fitness
   */
  async evolveDetectors(): Promise<void> {
    // Remove low-fitness detectors
    const toRemove: string[] = [];
    for (const [id, detector] of this.detectors.entries()) {
      if (detector.fitness < this.MIN_FITNESS && detector.generation > 1) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      this.detectors.delete(id);
    }

    // Clone high-fitness detectors with mutations
    const highFitnessDetectors = Array.from(this.detectors.values())
      .filter(d => d.fitness > 0.7)
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 10); // Top 10

    for (const parent of highFitnessDetectors) {
      if (this.detectors.size >= this.MAX_DETECTORS) {
        break;
      }

      // Create mutated clone
      const clone: Detector = {
        ...parent,
        id: `detector-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        generation: parent.generation + 1,
        fitness: 0.5, // Reset fitness for new generation
        falsePositives: 0,
        falseNegatives: 0,
        truePositives: 0,
        trueNegatives: 0,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
      };

      // Mutate pattern (slightly adjust ranges)
      for (const metricName in clone.pattern) {
        const range = clone.pattern[metricName];
        const mutation = (range.max - range.min) * 0.1; // 10% mutation
        range.min += (Math.random() - 0.5) * mutation;
        range.max += (Math.random() - 0.5) * mutation;
      }

      // Test against self before adding
      const isValid = await this.testDetectorAgainstSelf(clone);
      if (isValid) {
        this.detectors.set(clone.id, clone);
      }
    }
  }

  /**
   * Get all detectors
   */
  getDetectors(): Detector[] {
    return Array.from(this.detectors.values());
  }

  /**
   * Get best detectors (highest fitness)
   */
  getBestDetectors(limit: number = 10): Detector[] {
    return Array.from(this.detectors.values())
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, limit);
  }

  /**
   * Convert detector to anomaly pattern for threat recognition
   */
  detectorToAnomalyPattern(detector: Detector): AnomalyPattern {
    const signature: Record<string, number> = {};
    for (const [metric, range] of Object.entries(detector.pattern)) {
      signature[metric] = (range.min + range.max) / 2; // Use midpoint
    }

    return {
      id: detector.id,
      pattern: `Detector pattern for ${Object.keys(detector.pattern).join(", ")}`,
      metrics: Object.keys(detector.pattern),
      signature,
      frequency: detector.truePositives + detector.falsePositives,
      lastSeen: detector.lastUsed,
    };
  }
}

export default DetectorGenerator;

