/**
 * Detector Generator Core
 * 
 * Automatically generate M≈1-5k detectors per surface for anomaly detection
 * 
 * Features:
 * - Generate detectors for latency, error rate, queue depth, memory pressure, throughput
 * - Automatic scoring (eps=0.85 to avoid overfitting)
 * - Z-score gating to reduce noise
 * - Integration with metrics pipeline
 */

export { generateDetectors, scoreDetector } from './generator';
export { DetectorStore } from './store/detectorStore';
export type { 
  Detector, 
  DetectorSurface, 
  DetectorMetric, 
  DetectorResult,
  DetectorGeneratorStatus 
} from './types';

import { generateDetectors, scoreDetector } from './generator';
import { DetectorStore } from './store/detectorStore';

export const DetectorGeneratorCore = {
  /**
   * Generate detectors for a surface
   */
  generateDetectors(surface: import('./types').DetectorSurface, historicalData: any[]): import('./types').Detector[] {
    const detectors = generateDetectors(surface, historicalData);
    
    // Score detectors
    const scoredDetectors = detectors.map(d => ({
      ...d,
      score: scoreDetector(d, historicalData),
    })).filter(d => d.score && d.score >= 0.85); // eps=0.85 threshold
    
    // Store detectors
    DetectorStore.addMany(scoredDetectors);
    
    return scoredDetectors;
  },

  /**
   * Get all detectors
   */
  getDetectors(): import('./types').Detector[] {
    return DetectorStore.getAll();
  },

  /**
   * Get detectors for a surface
   */
  getDetectorsBySurface(surface: import('./types').DetectorSurface): import('./types').Detector[] {
    return DetectorStore.getBySurface(surface);
  },

  /**
   * Evaluate detectors against current metrics
   */
  async evaluateDetectors(): Promise<import('./types').DetectorResult[]> {
    // TODO: Implement evaluation logic
    return [];
  },

  /**
   * Get status
   */
  status(): import('./types').DetectorGeneratorStatus {
    return DetectorStore.status();
  },
};

export default DetectorGeneratorCore;

