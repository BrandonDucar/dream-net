/**
 * Incident Classification
 * 
 * P0/P1/P2 classification based on golden signals
 */

import type { IncidentSeverity, GoldenSignals } from './types';

/**
 * Classify incident severity based on golden signals
 */
export function classifyIncident(goldenSignals: GoldenSignals): IncidentSeverity {
  // P0: Critical thresholds
  if (
    goldenSignals.latency.p95 > 5000 || // p95 > 5s
    goldenSignals.errors.rate > 10 || // Error rate > 10%
    goldenSignals.traffic.changePercent < -50 || // Traffic drop > 50%
    goldenSignals.saturation.cpu > 95 || // CPU > 95%
    goldenSignals.saturation.memory > 95 // Memory > 95%
  ) {
    return 'P0';
  }
  
  // P1: High thresholds
  if (
    goldenSignals.latency.p95 > 2000 || // p95 > 2s
    goldenSignals.errors.rate > 5 || // Error rate > 5%
    goldenSignals.traffic.changePercent < -25 || // Traffic drop > 25%
    goldenSignals.saturation.cpu > 85 || // CPU > 85%
    goldenSignals.saturation.memory > 85 // Memory > 85%
  ) {
    return 'P1';
  }
  
  // P2: Medium thresholds
  if (
    goldenSignals.latency.p95 > 1000 || // p95 > 1s
    goldenSignals.errors.rate > 1 || // Error rate > 1%
    goldenSignals.traffic.changePercent < -10 || // Traffic drop > 10%
    goldenSignals.saturation.cpu > 75 || // CPU > 75%
    goldenSignals.saturation.memory > 75 // Memory > 75%
  ) {
    return 'P2';
  }
  
  // Default to P2 if no thresholds met
  return 'P2';
}

/**
 * Get response time for severity
 */
export function getResponseTime(severity: IncidentSeverity): number {
  switch (severity) {
    case 'P0':
      return 5 * 60 * 1000; // 5 minutes
    case 'P1':
      return 15 * 60 * 1000; // 15 minutes
    case 'P2':
      return 60 * 60 * 1000; // 1 hour
  }
}

