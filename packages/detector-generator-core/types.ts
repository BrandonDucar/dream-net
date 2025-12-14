/**
 * Detector Generator Core Types
 * Automatically generate M≈1-5k detectors per surface for anomaly detection
 */

export type DetectorSurface = 
  | 'latency' 
  | 'error_rate' 
  | 'queue_depth' 
  | 'memory_pressure' 
  | 'throughput';

export type DetectorMetric = 
  | 'p95' 
  | 'p99' 
  | 'error_percentage' 
  | 'queue_depth' 
  | 'memory_usage' 
  | 'requests_per_second';

export interface Detector {
  id: string;
  surface: DetectorSurface;
  metric: DetectorMetric;
  threshold: number;
  windowSize: number; // seconds
  score?: number; // precision score (eps=0.85 threshold)
  createdAt: number;
}

export interface DetectorResult {
  detectorId: string;
  triggered: boolean;
  value: number;
  threshold: number;
  timestamp: number;
}

export interface DetectorGeneratorStatus {
  detectorCount: number;
  detectorsBySurface: Record<DetectorSurface, number>;
  lastGeneratedAt: number | null;
}

