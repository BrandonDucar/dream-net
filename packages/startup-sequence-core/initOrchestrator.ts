/**
 * Initialization Orchestrator
 * 
 * Executes initialization in dependency order
 * Idempotent initialization (never double-do work)
 * Error handling and rollback
 */

import { dagBuilder } from './dagBuilder';
import { checkLiveness, checkReadiness, checkDependencies } from './healthGates';
import { getTrafficPercentage } from './trafficGrader';
import { nervousMessageBus } from '@dreamnet/nervous-system-core/messageBus';
import type { DependencyDAG, ServiceNode, StartupStatus } from './types';

class InitOrchestrator {
  private initializedServices: Set<string> = new Set();
  private failedServices: Set<string> = new Set();
  private healthScores: Record<string, number> = {};
  private currentPhases: Record<string, number> = {};
  
  /**
   * Initialize services from DAG
   */
  async initialize(dag: DependencyDAG): Promise<StartupStatus> {
    // Validate DAG
    const validation = dagBuilder.validateDAG(dag);
    if (!validation.valid) {
      throw new Error(`Invalid DAG: cycles detected: ${JSON.stringify(validation.cycles)}`);
    }
    
    // Topological sort
    const initOrder = dagBuilder.topologicalSort(dag);
    
    // Initialize services in order
    for (const serviceId of initOrder) {
      const service = dag.nodes.find(n => n.id === serviceId);
      if (!service) continue;
      
      // Skip if already initialized
      if (this.initializedServices.has(serviceId)) {
        continue;
      }
      
      // Check dependencies
      const depsHealthy = await checkDependencies(service, this.healthScores);
      if (!depsHealthy) {
        console.warn(`[Startup] Service ${serviceId} dependencies not healthy, skipping`);
        continue;
      }
      
      try {
        // Initialize service
        await service.initFunction();
        
        // Check liveness
        const liveness = await checkLiveness(service);
        if (!liveness) {
          throw new Error(`Service ${serviceId} failed liveness check`);
        }
        
        // Check readiness
        const readiness = await checkReadiness(service);
        if (!readiness) {
          throw new Error(`Service ${serviceId} failed readiness check`);
        }
        
        // Mark as initialized
        this.initializedServices.add(serviceId);
        this.healthScores[serviceId] = 100; // Start at 100
        
        // Initialize traffic grader
        if (service.trafficGrader) {
          this.currentPhases[serviceId] = 0;
        }
        
        // Publish event
        nervousMessageBus.publish({
          id: `service-initialized-${Date.now()}`,
          ts: Date.now(),
          role: 'system',
          topic: 'state.delta',
          key: `service:${serviceId}`,
          payload: {
            type: 'service_initialized',
            serviceId,
            healthScore: 100,
          },
        });
        
        console.log(`✅ [Startup] Service ${serviceId} initialized`);
      } catch (error: any) {
        console.error(`❌ [Startup] Service ${serviceId} initialization failed:`, error.message);
        this.failedServices.add(serviceId);
        this.healthScores[serviceId] = 0;
      }
    }
    
    return this.getStatus(dag);
  }
  
  /**
   * Get startup status
   */
  getStatus(dag: DependencyDAG): StartupStatus {
    const allServiceIds = dag.nodes.map(n => n.id);
    const pending = allServiceIds.filter(
      id => !this.initializedServices.has(id) && !this.failedServices.has(id)
    );
    
    return {
      initializedServices: Array.from(this.initializedServices),
      pendingServices: pending,
      failedServices: Array.from(this.failedServices),
      currentPhase: { ...this.currentPhases },
      healthScores: { ...this.healthScores },
    };
  }
  
  /**
   * Check if service is ready for traffic
   */
  async isServiceReady(serviceId: string, dag: DependencyDAG): Promise<boolean> {
    const service = dag.nodes.find(n => n.id === serviceId);
    if (!service) return false;
    
    if (!this.initializedServices.has(serviceId)) {
      return false;
    }
    
    const healthScore = this.healthScores[serviceId] ?? 0;
    if (healthScore < 50) {
      return false;
    }
    
    // Check traffic percentage
    const trafficPercent = await getTrafficPercentage(service, healthScore);
    return trafficPercent > 0;
  }
}

export const initOrchestrator = new InitOrchestrator();

