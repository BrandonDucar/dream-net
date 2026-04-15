/**
 * DreamNet Health Core
 * Automated health checking system
 */

import { HealthChecker } from "./logic/healthChecker";
import { healthStore } from "./store/healthStore";
import type { HealthCheck, HealthResult, ClusterHealth } from "./types";

const checker = new HealthChecker();
const checkIntervals = new Map<string, NodeJS.Timeout>();

export const DreamNetHealthCore = {
  /**
   * Register a health check for a cluster
   */
  registerCheck(check: HealthCheck): void {
    healthStore.registerCheck(check);
    
    // Start periodic checking if enabled
    if (check.enabled) {
      this.startCheck(check.id);
    }
  },

  /**
   * Start periodic health checking
   */
  startCheck(checkId: string): void {
    const check = healthStore.getCheck(checkId);
    if (!check || !check.enabled) {
      return;
    }

    // Clear existing interval if any
    const existing = checkIntervals.get(checkId);
    if (existing) {
      clearInterval(existing);
    }

    // Run initial check
    this.runCheck(checkId);

    // Schedule periodic checks
    const interval = setInterval(() => {
      this.runCheck(checkId);
    }, check.intervalMs);

    checkIntervals.set(checkId, interval);
  },

  /**
   * Stop periodic health checking
   */
  stopCheck(checkId: string): void {
    const interval = checkIntervals.get(checkId);
    if (interval) {
      clearInterval(interval);
      checkIntervals.delete(checkId);
    }
  },

  /**
   * Run a single health check
   */
  async runCheck(checkId: string): Promise<HealthResult | null> {
    const check = healthStore.getCheck(checkId);
    if (!check) {
      return null;
    }

    const result = await checker.checkHealth(check);
    
    // Add dependency checks
    const dependencies = await checker.checkDependencies(check.clusterId);
    result.dependencies = dependencies;

    healthStore.recordResult(result);
    return result;
  },

  /**
   * Get health status for a cluster
   */
  getClusterHealth(clusterId: string): ClusterHealth | null {
    return healthStore.getClusterHealth(clusterId);
  },

  /**
   * Get health status for all clusters
   */
  getAllClusterHealth(): Record<string, ClusterHealth> {
    return healthStore.getAllClusterHealth();
  },

  /**
   * Get recent health results
   */
  getRecentResults(clusterId: string, limit?: number): HealthResult[] {
    return healthStore.getRecentResults(clusterId, limit);
  },

  /**
   * Initialize default health checks for all clusters
   */
  initializeDefaultChecks(): void {
    const clusters = [
      "wolf-pack",
      "orca-pack",
      "whale-pack",
      "api-keeper",
      "webhook-nervous",
      "jaggy",
      "shield-core",
      "ai-seo",
      "dream-state",
      "star-bridge",
    ];

    for (const clusterId of clusters) {
      this.registerCheck({
        id: `check:${clusterId}:http`,
        clusterId,
        name: "HTTP Endpoint",
        endpoint: `/api/${clusterId.replace(/-/g, "/")}`,
        type: "http",
        intervalMs: 30000, // 30 seconds
        timeoutMs: 5000, // 5 seconds
        enabled: true,
        consecutiveFailures: 0,
        failureThreshold: 3,
      });
    }
  },
};

export * from "./types";
export default DreamNetHealthCore;

