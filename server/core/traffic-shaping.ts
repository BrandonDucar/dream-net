/**
 * Traffic Shaping & Gradual Rollout
 * 
 * Supports weighted routing for gradual traffic rollout:
 * 1% → 10% → 50% → 100%
 * 
 * Watches SLOs at each step and auto-rolls back on breach.
 */

export interface RolloutConfig {
  percentage: number; // 0-100
  slo?: {
    errorRate?: number; // Max error rate (0-1)
    p99Latency?: number; // Max p99 latency in ms
  };
  autoRollback?: boolean; // Auto-rollback on SLO breach
}

interface RolloutState {
  config: RolloutConfig;
  startTime: number;
  requestCount: number;
  errorCount: number;
  latencySamples: number[];
}

class TrafficShapingManager {
  private rollouts = new Map<string, RolloutState>();
  private defaultRollout: RolloutConfig = {
    percentage: 100, // Full traffic by default
    autoRollback: false,
  };

  /**
   * Start a gradual rollout
   */
  startRollout(name: string, config: RolloutConfig): void {
    this.rollouts.set(name, {
      config,
      startTime: Date.now(),
      requestCount: 0,
      errorCount: 0,
      latencySamples: [],
    });

    console.log(`🚀 [TrafficShaping] Started rollout "${name}" at ${config.percentage}%`);
  }

  /**
   * Update rollout percentage
   */
  updateRollout(name: string, percentage: number): void {
    const rollout = this.rollouts.get(name);
    if (!rollout) {
      throw new Error(`Rollout not found: ${name}`);
    }

    rollout.config.percentage = Math.max(0, Math.min(100, percentage));
    console.log(`📊 [TrafficShaping] Updated rollout "${name}" to ${rollout.config.percentage}%`);
  }

  /**
   * Check if request should be routed to new version
   */
  shouldRoute(name: string): boolean {
    const rollout = this.rollouts.get(name);
    if (!rollout) {
      return true; // No rollout = full traffic
    }

    const percentage = rollout.config.percentage;
    const random = Math.random() * 100;

    return random < percentage;
  }

  /**
   * Record request metrics
   */
  recordRequest(name: string, success: boolean, latency: number): void {
    const rollout = this.rollouts.get(name);
    if (!rollout) {
      return;
    }

    rollout.requestCount++;
    if (!success) {
      rollout.errorCount++;
    }
    rollout.latencySamples.push(latency);

    // Keep only last 1000 samples
    if (rollout.latencySamples.length > 1000) {
      rollout.latencySamples.shift();
    }

    // Check SLO breach
    if (rollout.config.autoRollback && rollout.config.slo) {
      this.checkSLOBreach(name, rollout);
    }
  }

  /**
   * Check if SLO is breached
   */
  private checkSLOBreach(name: string, rollout: RolloutState): void {
    const { slo } = rollout.config;
    if (!slo) return;

    // Check error rate
    if (slo.errorRate !== undefined && rollout.requestCount > 10) {
      const errorRate = rollout.errorCount / rollout.requestCount;
      if (errorRate > slo.errorRate) {
        console.error(
          `❌ [TrafficShaping] SLO breach: error rate ${(errorRate * 100).toFixed(2)}% > ${(slo.errorRate * 100).toFixed(2)}%`
        );
        this.rollback(name);
        return;
      }
    }

    // Check p99 latency
    if (slo.p99Latency !== undefined && rollout.latencySamples.length > 10) {
      const sorted = [...rollout.latencySamples].sort((a, b) => a - b);
      const p99Index = Math.floor(sorted.length * 0.99);
      const p99Latency = sorted[p99Index];

      if (p99Latency > slo.p99Latency) {
        console.error(
          `❌ [TrafficShaping] SLO breach: p99 latency ${p99Latency}ms > ${slo.p99Latency}ms`
        );
        this.rollback(name);
        return;
      }
    }
  }

  /**
   * Rollback rollout (set to 0%)
   */
  rollback(name: string): void {
    const rollout = this.rollouts.get(name);
    if (!rollout) {
      return;
    }

    rollout.config.percentage = 0;
    console.log(`⏪ [TrafficShaping] Rolled back "${name}" to 0%`);
  }

  /**
   * Get rollout status
   */
  getStatus(name: string): {
    percentage: number;
    requestCount: number;
    errorRate: number;
    p99Latency?: number;
  } | null {
    const rollout = this.rollouts.get(name);
    if (!rollout) {
      return null;
    }

    const errorRate = rollout.requestCount > 0 ? rollout.errorCount / rollout.requestCount : 0;

    let p99Latency: number | undefined;
    if (rollout.latencySamples.length > 0) {
      const sorted = [...rollout.latencySamples].sort((a, b) => a - b);
      const p99Index = Math.floor(sorted.length * 0.99);
      p99Latency = sorted[p99Index];
    }

    return {
      percentage: rollout.config.percentage,
      requestCount: rollout.requestCount,
      errorRate,
      p99Latency,
    };
  }

  /**
   * Get all rollouts
   */
  getAllRollouts(): Array<{ name: string; status: ReturnType<typeof this.getStatus> }> {
    return Array.from(this.rollouts.keys()).map((name) => ({
      name,
      status: this.getStatus(name),
    }));
  }
}

// Singleton instance
let shapingInstance: TrafficShapingManager | null = null;

export function getTrafficShaping(): TrafficShapingManager {
  if (!shapingInstance) {
    shapingInstance = new TrafficShapingManager();
  }
  return shapingInstance;
}

/**
 * Middleware helper: Check if request should be routed to new version
 */
export function shouldRouteToNewVersion(rolloutName: string): boolean {
  const shaping = getTrafficShaping();
  return shaping.shouldRoute(rolloutName);
}

/**
 * Middleware helper: Record request metrics
 */
export function recordRequestMetrics(
  rolloutName: string,
  success: boolean,
  latency: number
): void {
  const shaping = getTrafficShaping();
  shaping.recordRequest(rolloutName, success, latency);
}

