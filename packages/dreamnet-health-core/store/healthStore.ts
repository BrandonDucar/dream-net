/**
 * Health Store
 * Stores health check configurations and results
 */

import type { HealthCheck, HealthResult, ClusterHealth } from "../types";

class HealthStore {
  private checks: Map<string, HealthCheck> = new Map();
  private results: Map<string, HealthResult[]> = new Map();
  private maxResultsPerCluster = 100;

  registerCheck(check: HealthCheck): void {
    this.checks.set(check.id, check);
  }

  getCheck(checkId: string): HealthCheck | undefined {
    return this.checks.get(checkId);
  }

  getChecksForCluster(clusterId: string): HealthCheck[] {
    return Array.from(this.checks.values()).filter((c) => c.clusterId === clusterId && c.enabled);
  }

  getAllChecks(): HealthCheck[] {
    return Array.from(this.checks.values());
  }

  recordResult(result: HealthResult): void {
    const existing = this.results.get(result.clusterId) || [];
    existing.push(result);
    
    // Keep only recent results
    if (existing.length > this.maxResultsPerCluster) {
      existing.shift();
    }
    
    this.results.set(result.clusterId, existing);

    // Update check status
    const checks = this.getChecksForCluster(result.clusterId);
    for (const check of checks) {
      const checkResult = result.checks.find((c) => c.name === check.name);
      if (checkResult) {
        check.lastCheck = result.timestamp;
        check.lastStatus = checkResult.status;
        check.lastError = checkResult.error;
        
        if (checkResult.status === "down" || checkResult.status === "degraded") {
          check.consecutiveFailures++;
        } else {
          check.consecutiveFailures = 0;
        }
        
        this.checks.set(check.id, check);
      }
    }

    // Bridge health failures to Shield Core
    if (result.status === "down" || result.status === "degraded") {
      try {
        const { bridgeHealthResultToShield } = require("../logic/healthShieldBridge");
        bridgeHealthResultToShield(result);
      } catch (error) {
        // Bridge not available, continue without error
      }
    }
  }

  getRecentResults(clusterId: string, limit: number = 10): HealthResult[] {
    const results = this.results.get(clusterId) || [];
    return results.slice(-limit).reverse();
  }

  getClusterHealth(clusterId: string): ClusterHealth | null {
    const checks = this.getChecksForCluster(clusterId);
    const results = this.getRecentResults(clusterId, 1);
    
    if (checks.length === 0) {
      return null;
    }

    const latestResult = results[0];
    const overallStatus = latestResult?.status || "unknown";
    const lastCheck = latestResult?.timestamp || 0;
    
    // Calculate uptime (simplified - would need more data in production)
    const uptime = checks.reduce((sum, check) => {
      if (check.lastStatus === "healthy") {
        return sum + (check.intervalMs || 60000);
      }
      return sum;
    }, 0);

    return {
      clusterId,
      status: overallStatus,
      lastCheck,
      uptime,
      checks,
      recentResults: results,
    };
  }

  getAllClusterHealth(): Record<string, ClusterHealth> {
    const clusterIds = new Set(Array.from(this.checks.values()).map((c) => c.clusterId));
    const health: Record<string, ClusterHealth> = {};

    for (const clusterId of clusterIds) {
      const clusterHealth = this.getClusterHealth(clusterId);
      if (clusterHealth) {
        health[clusterId] = clusterHealth;
      }
    }

    return health;
  }
}

export const healthStore = new HealthStore();

