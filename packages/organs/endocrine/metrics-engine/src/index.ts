/**
 * Metrics Engine (Sovereign Implementation)
 * Stores time-series data in-memory (Active RAM).
 * Future Upgrade: Persist to SQLite/JSON.
 */

export interface MetricEvent {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: number;
}

// The Black Box (In-Memory Store)
const METRIC_STORE: MetricEvent[] = [];
const MAX_HISTORY = 1000; // Keep last 1000 points per boot

export function recordMetric(event: MetricEvent): void {
  const entry = {
    ...event,
    timestamp: event.timestamp || Date.now(),
  };

  METRIC_STORE.push(entry);

  // Prune if too large (Amor Fati - Let go of the old)
  if (METRIC_STORE.length > MAX_HISTORY) {
    METRIC_STORE.shift();
  }

  console.log(`[Metrics] Recorded: ${entry.name} = ${entry.value}`);
}

export function getMetricsHistory(options?: { name?: string; limit?: number }): MetricEvent[] {
  let data = METRIC_STORE;

  if (options?.name) {
    data = data.filter(m => m.name === options.name);
  }

  if (options?.limit) {
    data = data.slice(-options.limit);
  }

  return data;
}

// -- Legacy Stubs (Kept for compatibility) --
export function getMetricsSnapshot() { return { status: "Active", count: METRIC_STORE.length }; }
export function recordEvent(e: any) { recordMetric({ name: e.name || "unknown", value: 1 }); }
export function recordHaloCycle(e: any) { recordMetric({ name: "halo_cycle", value: e.success ? 1 : 0 }); }
export function recordHeartbeat() { /* pulse */ }
export function recordTaskCompletion() { recordMetric({ name: "task_complete", value: 1 }); }
export function updateTaskCounts() { }
export function getMetrics() { return METRIC_STORE; }
export function getMetric(name: string) { return METRIC_STORE.find(m => m.name === name); }

export { createMetricsRouter } from './router.js';
