/**
 * Startup Dependency DAG
 * 
 * Ensures services start in correct order based on dependencies.
 * Blocks each node until its parents report readiness.
 */

export interface ServiceNode {
  id: string;
  name: string;
  dependencies: string[]; // IDs of services this depends on
  init: () => Promise<void>;
  healthCheck: () => Promise<boolean>;
  critical: boolean; // Blocks traffic if not ready
  timeout?: number; // Max init time in ms (default: 30000)
}

interface ServiceState {
  node: ServiceNode;
  status: 'pending' | 'initializing' | 'ready' | 'failed';
  error?: Error;
  startedAt?: number;
  readyAt?: number;
}

class StartupDAG {
  private nodes = new Map<string, ServiceNode>();
  private states = new Map<string, ServiceState>();
  private initialized = false;

  /**
   * Register a service node
   */
  register(node: ServiceNode): void {
    if (this.initialized) {
      throw new Error('Cannot register nodes after DAG initialization');
    }
    this.nodes.set(node.id, node);
    this.states.set(node.id, {
      node,
      status: 'pending',
    });
  }

  /**
   * Get topological sort of services (dependency order)
   */
  private getTopologicalOrder(): string[] {
    const visited = new Set<string>();
    const tempMark = new Set<string>();
    const result: string[] = [];

    const visit = (id: string): void => {
      if (tempMark.has(id)) {
        throw new Error(`Circular dependency detected involving: ${id}`);
      }
      if (visited.has(id)) {
        return;
      }

      tempMark.add(id);
      const node = this.nodes.get(id);
      if (!node) {
        throw new Error(`Service node not found: ${id}`);
      }

      // Visit dependencies first
      for (const depId of node.dependencies) {
        if (!this.nodes.has(depId)) {
          throw new Error(`Dependency not found: ${depId} (required by ${id})`);
        }
        visit(depId);
      }

      tempMark.delete(id);
      visited.add(id);
      result.push(id);
    };

    // Visit all nodes
    for (const id of this.nodes.keys()) {
      if (!visited.has(id)) {
        visit(id);
      }
    }

    return result;
  }

  /**
   * Check if all dependencies are ready
   */
  private areDependenciesReady(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;

    return node.dependencies.every((depId) => {
      const depState = this.states.get(depId);
      return depState?.status === 'ready';
    });
  }

  /**
   * Initialize a single service
   */
  private async initializeService(nodeId: string): Promise<void> {
    const state = this.states.get(nodeId);
    if (!state) {
      throw new Error(`Service state not found: ${nodeId}`);
    }

    if (state.status === 'ready' || state.status === 'initializing') {
      return; // Already done or in progress
    }

    state.status = 'initializing';
    state.startedAt = Date.now();

    const node = state.node;
    const timeout = node.timeout || 30000;

    try {
      // Wait for dependencies
      const waitStart = Date.now();
      while (!this.areDependenciesReady(nodeId)) {
        if (Date.now() - waitStart > timeout) {
          throw new Error(`Timeout waiting for dependencies of ${nodeId}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Initialize service
      const initPromise = node.init();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Init timeout: ${nodeId}`)), timeout);
      });

      await Promise.race([initPromise, timeoutPromise]);

      // Verify health check
      const healthCheckPromise = node.healthCheck();
      const healthTimeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 5000); // 5s health check timeout
      });

      const healthy = await Promise.race([healthCheckPromise, healthTimeoutPromise]);

      if (!healthy) {
        throw new Error(`Health check failed for ${nodeId}`);
      }

      state.status = 'ready';
      state.readyAt = Date.now();
    } catch (error) {
      state.status = 'failed';
      state.error = error instanceof Error ? error : new Error(String(error));
      throw error;
    }
  }

  /**
   * Initialize all services in dependency order
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return; // Already initialized
    }

    this.initialized = true;
    const order = this.getTopologicalOrder();

    console.log(`🚀 [StartupDAG] Initializing ${order.length} services in dependency order...`);

    // Initialize services sequentially (respecting dependencies)
    // Services with no shared deps could be parallelized, but sequential is safer
    for (const nodeId of order) {
      const node = this.nodes.get(nodeId);
      if (!node) continue;

      try {
        console.log(`   ⏳ [${nodeId}] Initializing ${node.name}...`);
        await this.initializeService(nodeId);
        const duration = this.states.get(nodeId)?.readyAt 
          ? (this.states.get(nodeId)!.readyAt! - (this.states.get(nodeId)!.startedAt || 0))
          : 0;
        console.log(`   ✅ [${nodeId}] ${node.name} ready (${duration}ms)`);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`   ❌ [${nodeId}] ${node.name} failed:`, err.message);
        
        if (node.critical) {
          throw new Error(`Critical service ${nodeId} failed to initialize: ${err.message}`);
        } else {
          console.warn(`   ⚠️  [${nodeId}] Non-critical service failed, continuing...`);
        }
      }
    }

    console.log(`✅ [StartupDAG] All services initialized`);
  }

  /**
   * Get status of all services
   */
  getStatus(): {
    total: number;
    ready: number;
    failed: number;
    pending: number;
    services: Array<{
      id: string;
      name: string;
      status: string;
      critical: boolean;
      duration?: number;
      error?: string;
    }>;
  } {
    const services = Array.from(this.states.values()).map((state) => ({
      id: state.node.id,
      name: state.node.name,
      status: state.status,
      critical: state.node.critical,
      duration: state.readyAt && state.startedAt 
        ? state.readyAt - state.startedAt 
        : undefined,
      error: state.error?.message,
    }));

    return {
      total: services.length,
      ready: services.filter((s) => s.status === 'ready').length,
      failed: services.filter((s) => s.status === 'failed').length,
      pending: services.filter((s) => s.status === 'pending' || s.status === 'initializing').length,
      services,
    };
  }

  /**
   * Check if all critical services are ready
   */
  areCriticalServicesReady(): boolean {
    return Array.from(this.states.values()).every((state) => {
      if (!state.node.critical) return true; // Non-critical can be pending/failed
      return state.status === 'ready';
    });
  }
}

// Singleton instance
let dagInstance: StartupDAG | null = null;

export function getStartupDAG(): StartupDAG {
  if (!dagInstance) {
    dagInstance = new StartupDAG();
  }
  return dagInstance;
}

/**
 * Helper to create a simple health check that always passes
 */
export function alwaysHealthy(): Promise<boolean> {
  return Promise.resolve(true);
}

/**
 * Helper to create a health check that checks database
 */
export async function checkDatabaseHealth(): Promise<boolean> {
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

