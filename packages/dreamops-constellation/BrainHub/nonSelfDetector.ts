/**
 * Non-Self Detector
 * 
 * Detects anomalies by comparing current state to baseline ("self")
 * Uses statistical deviation, pattern matching, rate of change, and cross-correlation
 */

import type { BaselinePattern } from "./selfBaseline.js";
import SelfBaseline from "./selfBaseline.js";

export interface AnomalyDetection {
  id: string;
  metric: string;
  category: BaselinePattern["category"];
  currentValue: number;
  baselineValue: number;
  deviation: number; // z-score
  severity: number; // 0-1, based on deviation
  confidence: number; // 0-1, how certain we are this is non-self
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnomalyPattern {
  id: string;
  pattern: string; // Description of the pattern
  metrics: string[]; // Which metrics are involved
  signature: Record<string, number>; // Metric values that indicate this pattern
  frequency: number; // How often this pattern occurs
  lastSeen: string;
}

export interface CrossCorrelation {
  metric1: string;
  metric2: string;
  correlation: number; // -1 to 1
  anomaly: boolean; // True if correlation is unexpected
}

export class NonSelfDetector {
  private selfBaseline: SelfBaseline;
  private anomalyPatterns: Map<string, AnomalyPattern> = new Map();

  constructor(selfBaseline: SelfBaseline) {
    this.selfBaseline = selfBaseline;
  }

  /**
   * Calculate z-score (standard deviations from mean)
   */
  private calculateZScore(value: number, baseline: BaselinePattern): number {
    if (baseline.statistics.stdDev === 0) {
      // If no variance, any deviation is significant
      return value === baseline.statistics.mean ? 0 : Infinity;
    }
    return (value - baseline.statistics.mean) / baseline.statistics.stdDev;
  }

  /**
   * Detect anomaly for a single metric
   */
  async detectAnomaly(
    category: BaselinePattern["category"],
    metricName: string,
    currentValue: number,
    threshold: number = 2.0 // z-score threshold (default: 2 standard deviations)
  ): Promise<AnomalyDetection | null> {
    const baseline = await this.selfBaseline.getBaseline(category, metricName);
    
    if (!baseline) {
      // No baseline yet - can't detect anomalies
      return null;
    }

    const zScore = this.calculateZScore(currentValue, baseline);
    const absZScore = Math.abs(zScore);

    // Check if deviation exceeds threshold
    if (absZScore < threshold) {
      return null; // Within normal range
    }

    // Calculate severity (0-1) based on z-score
    // z-score of 2 = 0.5 severity, z-score of 4+ = 1.0 severity
    const severity = Math.min(1.0, absZScore / 4.0);

    // Calculate confidence based on sample count and consistency
    // More samples = higher confidence
    const sampleConfidence = Math.min(1.0, baseline.sampleCount / 100);
    // Check if value is outside percentile95 range (high confidence)
    const percentileConfidence = 
      (currentValue < baseline.statistics.percentile25 || 
       currentValue > baseline.statistics.percentile95) ? 0.9 : 0.5;
    
    const confidence = (sampleConfidence + percentileConfidence) / 2;

    return {
      id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metric: metricName,
      category,
      currentValue,
      baselineValue: baseline.statistics.mean,
      deviation: zScore,
      severity,
      confidence,
      timestamp: new Date().toISOString(),
      metadata: {
        threshold,
        baselineVersion: baseline.version,
        sampleCount: baseline.sampleCount,
      },
    };
  }

  /**
   * Detect anomalies across multiple metrics (cross-correlation)
   */
  async detectAnomalies(
    metrics: Array<{
      category: BaselinePattern["category"];
      metricName: string;
      value: number;
    }>,
    threshold: number = 2.0
  ): Promise<AnomalyDetection[]> {
    const detections: AnomalyDetection[] = [];

    // Detect individual anomalies
    for (const metric of metrics) {
      const detection = await this.detectAnomaly(
        metric.category,
        metric.metricName,
        metric.value,
        threshold
      );
      if (detection) {
        detections.push(detection);
      }
    }

    // Check for cross-correlation anomalies
    // If multiple metrics fail together, it's more significant
    if (detections.length > 1) {
      // Boost confidence for correlated anomalies
      const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;
      const correlationBoost = Math.min(0.2, detections.length * 0.05);
      
      for (const detection of detections) {
        detection.confidence = Math.min(1.0, detection.confidence + correlationBoost);
        detection.metadata = {
          ...detection.metadata,
          correlatedAnomalies: detections.length,
          correlationBoost,
        };
      }
    }

    return detections;
  }

  /**
   * Analyze rate of change (sudden spikes/drops)
   */
  async detectRateOfChangeAnomaly(
    category: BaselinePattern["category"],
    metricName: string,
    currentValue: number,
    previousValue: number,
    timeDelta: number // milliseconds between measurements
  ): Promise<AnomalyDetection | null> {
    const baseline = await this.selfBaseline.getBaseline(category, metricName);
    
    if (!baseline) {
      return null;
    }

    // Calculate rate of change
    const valueDelta = currentValue - previousValue;
    const rateOfChange = valueDelta / (timeDelta / 1000); // per second

    // Get baseline rate of change from statistics
    // Use stdDev as proxy for expected variation
    const expectedRate = baseline.statistics.stdDev / 60; // per second (assuming 1-minute intervals)
    
    if (expectedRate === 0) {
      return null;
    }

    const rateZScore = Math.abs(rateOfChange) / expectedRate;

    // Flag if rate of change is > 3x expected
    if (rateZScore < 3.0) {
      return null;
    }

    const severity = Math.min(1.0, rateZScore / 6.0);
    const confidence = 0.7; // Moderate confidence for rate-of-change anomalies

    return {
      id: `anomaly-rate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metric: metricName,
      category,
      currentValue,
      baselineValue: previousValue,
      deviation: rateZScore,
      severity,
      confidence,
      timestamp: new Date().toISOString(),
      metadata: {
        type: "rate_of_change",
        previousValue,
        rateOfChange,
        timeDelta,
        expectedRate,
      },
    };
  }

  /**
   * Match anomaly against known threat patterns
   */
  matchThreatPattern(detections: AnomalyDetection[]): AnomalyPattern | null {
    // Simple pattern matching - in production, use more sophisticated ML
    for (const pattern of this.anomalyPatterns.values()) {
      const matchingMetrics = pattern.metrics.filter(m => 
        detections.some(d => d.metric === m)
      );

      if (matchingMetrics.length === pattern.metrics.length) {
        // Check if values match signature (within tolerance)
        const matches = pattern.metrics.every(metric => {
          const detection = detections.find(d => d.metric === metric);
          if (!detection) return false;
          
          const expectedValue = pattern.signature[metric];
          const tolerance = expectedValue * 0.1; // 10% tolerance
          return Math.abs(detection.currentValue - expectedValue) <= tolerance;
        });

        if (matches) {
          return pattern;
        }
      }
    }

    return null;
  }

  /**
   * Register a known threat pattern
   */
  registerThreatPattern(pattern: AnomalyPattern): void {
    this.anomalyPatterns.set(pattern.id, pattern);
  }

  /**
   * Get all registered threat patterns
   */
  getThreatPatterns(): AnomalyPattern[] {
    return Array.from(this.anomalyPatterns.values());
  }
}

export default NonSelfDetector;

