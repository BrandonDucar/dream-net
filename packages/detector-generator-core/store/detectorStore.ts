/**
 * Detector Store
 * Registry for detectors
 */

import type { Detector, DetectorSurface, DetectorGeneratorStatus } from '../types';

class DetectorStore {
  private detectors: Map<string, Detector> = new Map();
  
  /**
   * Add a detector
   */
  add(detector: Detector): void {
    this.detectors.set(detector.id, detector);
  }
  
  /**
   * Add multiple detectors
   */
  addMany(detectors: Detector[]): void {
    for (const detector of detectors) {
      this.add(detector);
    }
  }
  
  /**
   * Get a detector by ID
   */
  get(id: string): Detector | undefined {
    return this.detectors.get(id);
  }
  
  /**
   * Get all detectors
   */
  getAll(): Detector[] {
    return Array.from(this.detectors.values());
  }
  
  /**
   * Get detectors by surface
   */
  getBySurface(surface: DetectorSurface): Detector[] {
    return Array.from(this.detectors.values()).filter(d => d.surface === surface);
  }
  
  /**
   * Get detectors by metric
   */
  getByMetric(metric: string): Detector[] {
    return Array.from(this.detectors.values()).filter(d => d.metric === metric);
  }
  
  /**
   * Remove a detector
   */
  remove(id: string): boolean {
    return this.detectors.delete(id);
  }
  
  /**
   * Clear all detectors
   */
  clear(): void {
    this.detectors.clear();
  }
  
  /**
   * Get status
   */
  status(): DetectorGeneratorStatus {
    const detectorsBySurface: Record<DetectorSurface, number> = {
      latency: 0,
      error_rate: 0,
      queue_depth: 0,
      memory_pressure: 0,
      throughput: 0,
    };
    
    let lastGeneratedAt: number | null = null;
    
    for (const detector of this.detectors.values()) {
      detectorsBySurface[detector.surface]++;
      if (!lastGeneratedAt || detector.createdAt > lastGeneratedAt) {
        lastGeneratedAt = detector.createdAt;
      }
    }
    
    return {
      detectorCount: this.detectors.size,
      detectorsBySurface,
      lastGeneratedAt,
    };
  }
}

export const DetectorStore = new DetectorStore();

