/**
 * DreamNet Auto-Scale Core Types
 * Adaptive rate limiting and auto-scaling
 */

export interface ScalingMetrics {
  clusterId: string;
  requestsPerSecond: number;
  errorRate: number;
  averageLatency: number;
  p95Latency: number;
  costPerRequest: number;
  currentRateLimit: number;
  timestamp: number;
}

export interface ScalingRule {
  id: string;
  clusterId: string;
  enabled: boolean;
  minRateLimit: number;
  maxRateLimit: number;
  scaleUpThreshold: {
    requestsPerSecond?: number;
    errorRate?: number;
    latency?: number;
  };
  scaleDownThreshold: {
    requestsPerSecond?: number;
    errorRate?: number;
    latency?: number;
  };
  costThreshold?: number; // Max cost per hour
  adjustmentStep: number; // How much to adjust by
  cooldownMs: number; // Wait before next adjustment
  lastAdjustment?: number;
}

export interface ScalingDecision {
  clusterId: string;
  action: "scale_up" | "scale_down" | "no_change";
  currentLimit: number;
  newLimit: number;
  reason: string;
  metrics: ScalingMetrics;
}

