/**
 * DAG Loader
 * 
 * Loads service definitions from deploy/graph.json and registers them with the DAG.
 * Handles conditional initialization based on environment variables.
 */

import { getStartupDAG, ServiceNode, checkDatabaseHealth, alwaysHealthy } from './startup-dag';
import { getHealthGates, checkDatabaseGate, checkDAGGate } from './health-gates';
import { initializeAllQueues } from './queue-init';
import { runMigrations } from './migrations';

interface GraphService {
  id: string;
  name: string;
  dependencies: string[];
  critical: boolean;
  initModule?: string;
  initFunction?: string;
  healthCheckModule?: string;
  healthCheckFunction?: string;
  conditional?: string; // Environment variable name
}

/**
 * Load services from graph.json and register with DAG
 */
export async function loadServicesFromGraph(): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const graphPath = path.join(process.cwd(), 'deploy', 'graph.json');
    const content = await fs.readFile(graphPath, 'utf-8');
    const graph = JSON.parse(content) as { services?: GraphService[] };
    
    if (!graph.services || graph.services.length === 0) {
      console.warn('⚠️  [DAGLoader] No services defined in graph.json');
      return;
    }
    
    const dag = getStartupDAG();
    
    for (const service of graph.services) {
      // Check conditional (e.g., INIT_SUBSYSTEMS)
      if (service.conditional && process.env[service.conditional] !== 'true') {
        console.log(`   ⏭️  [DAGLoader] Skipping ${service.id} (${service.conditional} not enabled)`);
        continue;
      }
      
      // Create init function
      const initFn = service.initModule && service.initFunction
        ? await createInitFunction(service.initModule, service.initFunction)
        : async () => {
            // Default: no-op if no init function specified
            console.log(`   ⏭️  [DAGLoader] ${service.id} has no init function, skipping`);
          };
      
      // Create health check function
      const healthCheckFn = service.healthCheckModule && service.healthCheckFunction
        ? await createHealthCheckFunction(service.healthCheckModule, service.healthCheckFunction)
        : alwaysHealthy;
      
      // Register with DAG
      dag.register({
        id: service.id,
        name: service.name,
        dependencies: service.dependencies || [],
        init: initFn,
        healthCheck: healthCheckFn,
        critical: service.critical || false,
      });
      
      console.log(`   ✅ [DAGLoader] Registered ${service.id}`);
    }
    
    console.log(`✅ [DAGLoader] Loaded ${graph.services.length} service(s) from graph.json`);
  } catch (error: any) {
    console.warn(`⚠️  [DAGLoader] Could not load services from graph.json: ${error.message}`);
  }
}

/**
 * Create init function from module path
 */
async function createInitFunction(modulePath: string, functionName: string): Promise<() => Promise<void>> {
  try {
    // Handle relative paths
    const resolvedPath = modulePath.startsWith('.') 
      ? modulePath 
      : `../${modulePath}`;
    
    const module = await import(resolvedPath);
    const fn = module[functionName] || module.default?.[functionName];
    
    if (!fn) {
      throw new Error(`Function ${functionName} not found in ${modulePath}`);
    }
    
    return async () => {
      if (typeof fn === 'function') {
        await fn();
      } else if (typeof fn === 'object' && fn.init) {
        await fn.init();
      } else {
        throw new Error(`Invalid init function: ${functionName}`);
      }
    };
  } catch (error: any) {
    console.warn(`⚠️  [DAGLoader] Could not load init function ${functionName} from ${modulePath}: ${error.message}`);
    return async () => {
      // Fallback: no-op
    };
  }
}

/**
 * Create health check function from module path
 */
async function createHealthCheckFunction(modulePath: string, functionName: string): Promise<() => Promise<boolean>> {
  try {
    // Handle special cases
    if (modulePath.includes('startup-dag')) {
      if (functionName === 'checkDatabaseHealth') {
        return checkDatabaseHealth;
      }
      if (functionName === 'alwaysHealthy') {
        return alwaysHealthy;
      }
    }
    
    if (modulePath.includes('health-gates')) {
      if (functionName === 'checkDatabaseGate') {
        return checkDatabaseGate;
      }
      if (functionName === 'checkDAGGate') {
        return checkDAGGate;
      }
    }
    
    // Try to load from module
    const resolvedPath = modulePath.startsWith('.') 
      ? modulePath 
      : `../${modulePath}`;
    
    const module = await import(resolvedPath);
    const fn = module[functionName] || module.default?.[functionName];
    
    if (!fn) {
      return alwaysHealthy; // Fallback
    }
    
    return async () => {
      if (typeof fn === 'function') {
        return await fn();
      }
      return true;
    };
  } catch (error: any) {
    console.warn(`⚠️  [DAGLoader] Could not load health check ${functionName} from ${modulePath}: ${error.message}`);
    return alwaysHealthy; // Fallback
  }
}

/**
 * Initialize health gates for critical services
 */
export async function initializeHealthGates(): Promise<void> {
  const gates = getHealthGates();
  
  // Database gate (critical)
  gates.register({
    serviceId: 'database',
    name: 'Database',
    check: checkDatabaseGate,
    critical: true,
    requiredPasses: 3,
  });
  
  // DAG gate (critical)
  gates.register({
    serviceId: 'startup-dag',
    name: 'Startup DAG',
    check: checkDAGGate,
    critical: true,
    requiredPasses: 3,
  });
  
  // Start periodic checks
  gates.start();
  
  console.log('✅ [HealthGates] Initialized and started');
}

/**
 * Initialize reliability system (called on server startup)
 */
export async function initializeReliabilitySystem(): Promise<void> {
  console.log('🛡️  [Reliability] Initializing reliability system...');
  
  try {
    // 1. Run migrations (idempotent)
    await runMigrations();
    
    // 2. Initialize queues (idempotent)
    await initializeAllQueues();
    
    // 3. Load services from graph.json
    await loadServicesFromGraph();
    
    // 4. Initialize health gates
    await initializeHealthGates();
    
    // 5. Initialize DAG (if services registered)
    const dag = getStartupDAG();
    const status = dag.getStatus();
    if (status.total > 0) {
      console.log(`🚀 [Reliability] Initializing ${status.total} service(s) via DAG...`);
      await dag.initialize();
    }
    
    console.log('✅ [Reliability] Reliability system initialized');
  } catch (error: any) {
    console.error('❌ [Reliability] Failed to initialize reliability system:', error.message);
    // Don't throw - allow server to start in degraded mode
  }
}

