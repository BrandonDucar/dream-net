/**
 * Resilience Early-Warning System Types
 * Detect critical slowing down (variance + AC1) before failures
 */

export interface ResilienceSignal {
  serviceId: string;
  metric: string;
  variance: number; // σ²
  ac1: number;      // lag-1 autocorrelation
  resilienceIndex: number; // 0-100
  timestamp: number;
}

export interface SentinelMetric {
  serviceId: string;
  metric: string;
  values: number[];
  windowSize: number;
  baseline: {
    variance: number;
    ac1: number;
  };
}

export interface ResilienceAlert {
  id: string;
  serviceId: string;
  resilienceIndex: number;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: number;
  consecutiveWindows: number; // K consecutive windows
}

export interface ResilienceEarlyWarningStatus {
  monitoredServices: number;
  activeAlerts: number;
  lastComputedAt: number | null;
  resilienceIndices: Record<string, number>;
}

