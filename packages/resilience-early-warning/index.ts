/**
 * Resilience Early-Warning System
 * 
 * Detect critical slowing down (variance + AC1) before failures
 * 
 * Features:
 * - Compute variance (σ²) and lag-1 autocorrelation (AC1) over rolling windows
 * - Z-score calculation against trailing baselines
 * - Resilience Index (0-100) publication
 * - Automatic guardrail triggers (autoscale, rate-limit, brownout)
 */

export { computeVarianceAndAC1, computeResilienceIndex } from './signalCalculator';
export { triggerGuardrails } from './guardrails';
export { ResilienceSignalStore } from './store/signalStore';
export type { 
  ResilienceSignal, 
  SentinelMetric, 
  ResilienceAlert,
  ResilienceEarlyWarningStatus 
} from './types';

import { ResilienceSignalStore } from './store/signalStore';

export const ResilienceEarlyWarning = {
  /**
   * Compute resilience signals for a service
   */
  async computeSignals(serviceId: string, metrics: number[]): Promise<import('./types').ResilienceSignal> {
    const { computeVarianceAndAC1, computeResilienceIndex } = await import('./signalCalculator');
    const { variance, ac1 } = computeVarianceAndAC1(metrics, 60); // 60-second window
    const baseline = ResilienceSignalStore.getBaseline(serviceId);
    const resilienceIndex = computeResilienceIndex(variance, ac1, baseline);
    
    const signal: import('./types').ResilienceSignal = {
      serviceId,
      metric: 'p95_latency', // TODO: support multiple metrics
      variance,
      ac1,
      resilienceIndex,
      timestamp: Date.now(),
    };
    
    ResilienceSignalStore.addSignal(signal);
    return signal;
  },

  /**
   * Get resilience index for a service
   */
  getResilienceIndex(serviceId: string): number | null {
    return ResilienceSignalStore.getLatestIndex(serviceId);
  },

  /**
   * Get active alerts
   */
  getActiveAlerts(): import('./types').ResilienceAlert[] {
    return ResilienceSignalStore.getActiveAlerts();
  },

  /**
   * Get status
   */
  status(): import('./types').ResilienceEarlyWarningStatus {
    return ResilienceSignalStore.status();
  },
};

export default ResilienceEarlyWarning;

