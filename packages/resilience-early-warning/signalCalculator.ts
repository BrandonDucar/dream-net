/**
 * Resilience Signal Calculator
 * 
 * Compute variance (σ²) and lag-1 autocorrelation (AC1) over rolling windows
 * Calculate Resilience Index (0-100) from variance + AC1
 */

import type { ResilienceSignal } from './types';

/**
 * Compute variance and lag-1 autocorrelation
 */
export function computeVarianceAndAC1(metrics: number[], windowSize: number): {
  variance: number;
  ac1: number;
} {
  if (metrics.length < windowSize) {
    // Use all available data if window is larger than data
    windowSize = metrics.length;
  }
  
  if (windowSize < 2) {
    return { variance: 0, ac1: 0 };
  }
  
  const window = metrics.slice(-windowSize);
  const mean = window.reduce((a, b) => a + b, 0) / window.length;
  
  // Compute variance (σ²)
  const variance = window.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / window.length;
  
  // Compute AC1 (lag-1 autocorrelation)
  let ac1 = 0;
  for (let i = 1; i < window.length; i++) {
    ac1 += (window[i] - mean) * (window[i-1] - mean);
  }
  
  const denominator = (window.length - 1) * variance;
  ac1 = denominator !== 0 ? ac1 / denominator : 0;
  
  return { variance, ac1 };
}

/**
 * Compute Resilience Index from variance and AC1
 * Higher variance + AC1 = lower resilience
 */
export function computeResilienceIndex(
  variance: number, 
  ac1: number, 
  baseline: { variance: number; ac1: number }
): number {
  if (baseline.variance === 0 || baseline.ac1 === 0) {
    // No baseline, return neutral score
    return 50;
  }
  
  // Normalize variance and AC1 against baseline
  const varianceRatio = variance / baseline.variance;
  const ac1Ratio = ac1 / baseline.ac1;
  
  // Higher variance + AC1 = lower resilience
  // Resilience = 100 - (variance_penalty + ac1_penalty)
  // Penalties are weighted: variance contributes more to resilience degradation
  const variancePenalty = Math.min(50, varianceRatio * 30); // Max 50% penalty
  const ac1Penalty = Math.min(30, ac1Ratio * 20); // Max 30% penalty
  
  const resilience = 100 - (variancePenalty + ac1Penalty);
  
  return Math.max(0, Math.min(100, resilience));
}

/**
 * Compute Z-score for a value against baseline
 */
export function computeZScore(value: number, baseline: { mean: number; stdDev: number }): number {
  if (baseline.stdDev === 0) return 0;
  return (value - baseline.mean) / baseline.stdDev;
}

