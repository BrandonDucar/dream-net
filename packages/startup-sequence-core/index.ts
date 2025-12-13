/**
 * Startup Sequence Core
 * 
 * Safe-by-default service initialization with dependency DAG
 * 
 * Features:
 * - Dependency DAG rendering and validation
 * - Idempotent initialization (never double-do work)
 * - Health gates (liveness + readiness)
 * - Gradual traffic opening (1% → 10% → 50% → 100%)
 */

export { dagBuilder } from './dagBuilder';
export { checkLiveness, checkReadiness, checkDependencies } from './healthGates';
export { getTrafficPercentage, getDefaultTrafficPhases } from './trafficGrader';
export { initOrchestrator } from './initOrchestrator';
export type {
  ServiceNode,
  DependencyDAG,
  DependencyEdge,
  HealthCheck,
  LivenessCheck,
  ReadinessCheck,
  TrafficGrader,
  TrafficPhase,
  StartupStatus,
} from './types';

import { initOrchestrator } from './initOrchestrator';
import { dagBuilder } from './dagBuilder';

export const StartupSequenceCore = {
  /**
   * Initialize services from DAG
   */
  async initialize(dag: import('./types').DependencyDAG) {
    return initOrchestrator.initialize(dag);
  },

  /**
   * Build DAG from service nodes
   */
  buildDAG(nodes: import('./types').ServiceNode[]) {
    return dagBuilder.buildDAG(nodes);
  },

  /**
   * Validate DAG
   */
  validateDAG(dag: import('./types').DependencyDAG) {
    return dagBuilder.validateDAG(dag);
  },

  /**
   * Get initialization order
   */
  getInitOrder(dag: import('./types').DependencyDAG) {
    return dagBuilder.topologicalSort(dag);
  },

  /**
   * Check if service is ready
   */
  async isServiceReady(serviceId: string, dag: import('./types').DependencyDAG) {
    return initOrchestrator.isServiceReady(serviceId, dag);
  },

  /**
   * Get status
   */
  getStatus(dag: import('./types').DependencyDAG): import('./types').StartupStatus {
    return initOrchestrator.getStatus(dag);
  },
};

export default StartupSequenceCore;

