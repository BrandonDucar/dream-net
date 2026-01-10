/**
 * Metrics Engine
 * TEMPORARY: No-op placeholder to avoid blocking server startup
 * TODO: Replace with full implementation from metricsEngine.ts once dependencies are resolved
 */

export interface MetricsSnapshot {
  timestamp: string;
  uptimePercent: number;
  avgHeartbeatMs: number;
  haloCyclesToday: number;
  tasksCompleted: number;
  tasksPending: number;
  events24h: number;
  mediaCount: number;
  mediaPublic: number;
  postsQueued: number;
  postsPosted: number;
  phase: string;
  status?: string;
  message?: string;
  metrics?: any[];
  [key: string]: any;
}

export interface MetricEvent {
  name?: string;
  value?: number;
  tags?: Record<string, string>;
  timestamp?: string;
  [key: string]: any;
}

export interface HaloCycleEvent {
  success?: boolean;
  timestamp?: string;
  [key: string]: any;
}

export interface MetricsDaily {
  date: string;
  uptimePercent: number;
  avgHeartbeatMs: number;
  haloCycles: number;
  tasksCompleted: number;
  tasksPending: number;
  events: number;
  mediaAdded: number;
  mediaPublic: number;
  postsQueued: number;
  postsPosted: number;
  lastHaloCycleAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get metrics snapshot
 * TEMPORARY: Returns placeholder data
 */
export async function getMetrics(): Promise<MetricsSnapshot> {
  return {
    timestamp: new Date().toISOString(),
    uptimePercent: 100,
    avgHeartbeatMs: 0,
    haloCyclesToday: 0,
    tasksCompleted: 0,
    tasksPending: 0,
    events24h: 0,
    mediaCount: 0,
    mediaPublic: 0,
    postsQueued: 0,
    postsPosted: 0,
    phase: "placeholder",
    status: "placeholder",
    message: "Metrics Engine not implemented yet.",
    metrics: [],
  };
}

/**
 * Get metrics snapshot (sync version)
 * TEMPORARY: Returns placeholder data
 */
export function getMetricsSnapshot(): MetricsSnapshot {
  return {
    timestamp: new Date().toISOString(),
    uptimePercent: 100,
    avgHeartbeatMs: 0,
    haloCyclesToday: 0,
    tasksCompleted: 0,
    tasksPending: 0,
    events24h: 0,
    mediaCount: 0,
    mediaPublic: 0,
    postsQueued: 0,
    postsPosted: 0,
    phase: "placeholder",
    status: "placeholder",
    message: "Metrics Engine not implemented yet.",
    metrics: [],
  };
}

/**
 * Record a metric event
 * TEMPORARY: No-op placeholder
 */
export function recordMetric(_event: MetricEvent): void {
  // No-op: metrics engine not implemented yet
  return;
}

/**
 * Record an event (alias for recordMetric)
 * TEMPORARY: No-op placeholder
 */
export async function recordEvent(_event?: MetricEvent): Promise<void> {
  // No-op: metrics engine not implemented yet
  return;
}

/**
 * Record HALO cycle
 * TEMPORARY: No-op placeholder
 */
export async function recordHaloCycle(_event: HaloCycleEvent): Promise<void> {
  // No-op: metrics engine not implemented yet
  return;
}

/**
 * Record heartbeat
 * TEMPORARY: No-op placeholder
 */
export async function recordHeartbeat(_latencyMs?: number): Promise<void> {
  // No-op: metrics engine not implemented yet
  return;
}

/**
 * Record task completion
 * TEMPORARY: No-op placeholder
 */
export async function recordTaskCompletion(_type?: string, _status?: "success" | "failed"): Promise<void> {
  // No-op: metrics engine not implemented yet
  return;
}

/**
 * Get metrics for a specific time range
 * TEMPORARY: Returns empty array
 */
export function getMetricsHistory(_days?: number): Promise<MetricsDaily[]> {
  return Promise.resolve([]);
}

/**
 * Update task counts
 * TEMPORARY: No-op placeholder
 */
export function updateTaskCounts(_completed?: number, _pending?: number): void {
  // No-op: metrics engine not implemented yet
  return;
}

/**
 * Get metric by name
 * TEMPORARY: Returns null
 */
export function getMetric(_name: string): any | null {
  return null;
}

// Re-export types
export * from './types.js';
