/**
 * Startup Sequence Core Types
 * Safe-by-default service initialization with dependency DAG
 */

export interface ServiceNode {
  id: string;
  service: string;
  dependencies: string[]; // IDs of dependent services
  healthCheck: HealthCheck;
  initFunction: () => Promise<void>;
  trafficGrader?: TrafficGrader;
  priority?: number; // Lower = higher priority
}

export interface DependencyEdge {
  from: string; // Service ID
  to: string;   // Service ID
  type: 'required' | 'optional';
}

export interface DependencyDAG {
  nodes: ServiceNode[];
  edges: DependencyEdge[];
}

export interface HealthCheck {
  liveness: LivenessCheck;
  readiness: ReadinessCheck;
}

export interface LivenessCheck {
  type: 'http' | 'tcp' | 'process' | 'custom';
  endpoint?: string;
  port?: number;
  timeout: number; // ms
  interval: number; // ms
}

export interface ReadinessCheck {
  checks: Array<{
    type: 'dependency' | 'database' | 'queue' | 'custom';
    name: string;
    check: () => Promise<boolean>;
  }>;
  allRequired: boolean;
}

export interface TrafficGrader {
  phases: TrafficPhase[];
  currentPhase: number;
  phaseStartTime: number;
}

export interface TrafficPhase {
  percentage: number; // 1, 10, 50, 100
  duration: number; // ms
  healthThreshold: number; // 0-100
}

export interface StartupStatus {
  initializedServices: string[];
  pendingServices: string[];
  failedServices: string[];
  currentPhase: Record<string, number>; // serviceId -> traffic phase
  healthScores: Record<string, number>; // serviceId -> health score
}

