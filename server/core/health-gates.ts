/**
 * Health Gates System
 * 
 * Tracks readiness state per service and prevents traffic
 * until all critical services pass X consecutive health checks.
 */

import { getStartupDAG } from './startup-dag';

export interface HealthGate {
  serviceId: string;
  name: string;
  check: () => Promise<boolean>;
  critical: boolean; // Blocks traffic if false
  consecutivePasses: number;
  requiredPasses: number; // Default: 3
  lastCheck?: number;
  lastResult?: boolean;
}

class HealthGatesManager {
  private gates = new Map<string, HealthGate>();
  private checkInterval: NodeJS.Timeout | null = null;
  private checkIntervalMs = 5000; // Check every 5 seconds

  /**
   * Register a health gate
   */
  register(gate: Omit<HealthGate, 'consecutivePasses' | 'lastCheck' | 'lastResult'>): void {
    this.gates.set(gate.serviceId, {
      ...gate,
      consecutivePasses: 0,
      requiredPasses: gate.requiredPasses || 3,
    });
  }

  /**
   * Run health check for a single gate
   */
  private async checkGate(gate: HealthGate): Promise<boolean> {
    try {
      const result = await Promise.race([
        gate.check(),
        new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), 5000); // 5s timeout
        }),
      ]);

      gate.lastCheck = Date.now();
      gate.lastResult = result;

      if (result) {
        gate.consecutivePasses++;
      } else {
        gate.consecutivePasses = 0; // Reset on failure
      }

      return result;
    } catch (error) {
      gate.lastCheck = Date.now();
      gate.lastResult = false;
      gate.consecutivePasses = 0;
      return false;
    }
  }

  /**
   * Check all gates
   */
  async checkAll(): Promise<{
    allReady: boolean;
    criticalReady: boolean;
    gates: Array<{
      serviceId: string;
      name: string;
      ready: boolean;
      consecutivePasses: number;
      requiredPasses: number;
      critical: boolean;
      lastCheck?: number;
    }>;
  }> {
    const results = await Promise.all(
      Array.from(this.gates.values()).map(async (gate) => {
        const passed = await this.checkGate(gate);
        return {
          serviceId: gate.serviceId,
          name: gate.name,
          ready: passed && gate.consecutivePasses >= gate.requiredPasses,
          consecutivePasses: gate.consecutivePasses,
          requiredPasses: gate.requiredPasses,
          critical: gate.critical,
          lastCheck: gate.lastCheck,
        };
      })
    );

    const criticalGates = results.filter((r) => r.critical);
    const criticalReady = criticalGates.every((r) => r.ready);
    const allReady = results.every((r) => r.ready);

    return {
      allReady,
      criticalReady,
      gates: results,
    };
  }

  /**
   * Start periodic health checks
   */
  start(): void {
    if (this.checkInterval) {
      return; // Already started
    }

    // Initial check
    this.checkAll().catch((error) => {
      console.error('[HealthGates] Initial check failed:', error);
    });

    // Periodic checks
    this.checkInterval = setInterval(() => {
      this.checkAll().catch((error) => {
        console.error('[HealthGates] Periodic check failed:', error);
      });
    }, this.checkIntervalMs);

    console.log(`✅ [HealthGates] Started periodic checks (every ${this.checkIntervalMs}ms)`);
  }

  /**
   * Stop periodic health checks
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('⏹️  [HealthGates] Stopped periodic checks');
    }
  }

  /**
   * Get current readiness status
   */
  async getReadiness(): Promise<{
    ready: boolean;
    criticalReady: boolean;
    gates: Array<{
      serviceId: string;
      name: string;
      ready: boolean;
      consecutivePasses: number;
      requiredPasses: number;
      critical: boolean;
    }>;
  }> {
    const status = await this.checkAll();
    return {
      ready: status.criticalReady, // Only critical gates block traffic
      criticalReady: status.criticalReady,
      gates: status.gates,
    };
  }
}

// Singleton instance
let gatesInstance: HealthGatesManager | null = null;

export function getHealthGates(): HealthGatesManager {
  if (!gatesInstance) {
    gatesInstance = new HealthGatesManager();
  }
  return gatesInstance;
}

/**
 * Helper: Check database health
 */
export async function checkDatabaseGate(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return true; // Not configured, consider healthy
  }

  try {
    const { getDb } = await import('../db');
    const db = getDb();
    if (!db) return false;
    
    await db.execute({ sql: 'SELECT 1', args: [] });
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper: Check if DAG services are ready
 */
export async function checkDAGGate(): Promise<boolean> {
  try {
    const dag = getStartupDAG();
    return dag.areCriticalServicesReady();
  } catch {
    return false;
  }
}

