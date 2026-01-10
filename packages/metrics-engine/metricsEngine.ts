import { db } from "@dreamnet/database";
import { metricsDaily, mediaAssets, postQueue } from "@dreamnet/shared/schema";
import { eq, sql, and, gte, count } from "drizzle-orm";
import type { MetricsSnapshot, MetricsDaily } from './types.js';

// In-memory cache for rolling aggregates (last 5 minutes)
interface LatencyEntry {
  latency: number;
  timestamp: number;
}

interface RollingMetrics {
  heartbeatLatencies: LatencyEntry[];
  haloCycles: number;
  tasksCompleted: number;
  tasksPending: number;
  events: number;
  mediaAdded: number;
  mediaPublic: number;
  postsQueued: number;
  postsPosted: number;
  lastHaloCycleAt: string | null;
  systemStartTime: number;
  lastHeartbeatTime: number | null;
}

const rolling: RollingMetrics = {
  heartbeatLatencies: [],
  haloCycles: 0,
  tasksCompleted: 0,
  tasksPending: 0,
  events: 0,
  mediaAdded: 0,
  mediaPublic: 0,
  postsQueued: 0,
  postsPosted: 0,
  lastHaloCycleAt: null,
  systemStartTime: Date.now(),
  lastHeartbeatTime: null,
};

// Keep only last 5 minutes of heartbeat latencies
const MAX_LATENCY_AGE_MS = 5 * 60 * 1000;

function trimOldLatencies() {
  const now = Date.now();
  rolling.heartbeatLatencies = rolling.heartbeatLatencies.filter(
    (entry) => now - entry.timestamp < MAX_LATENCY_AGE_MS
  );
}

// Get today's date string (YYYY-MM-DD)
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// Get or create today's daily record
async function getOrCreateTodayRecord(): Promise<MetricsDaily> {
  const today = getTodayDateString();
  const now = new Date().toISOString();

  const [existing] = await db
    .select()
    .where(eq(metricsDaily.date as any, today))
    .limit(1);

  if (existing) {
    return existing as MetricsDaily;
  }

  // Create new record for today
  const [newRecord] = await db
    .insert(metricsDaily)
    .values({
      date: today,
      uptimePercent: 100,
      avgHeartbeatMs: 0,
      haloCycles: 0,
      tasksCompleted: 0,
      tasksPending: 0,
      events: 0,
      mediaAdded: 0,
      mediaPublic: 0,
      postsQueued: 0,
      postsPosted: 0,
      lastHaloCycleAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newRecord as MetricsDaily;
}

// Update today's daily record (atomic)
async function updateTodayRecord(updates: Partial<MetricsDaily>) {
  const today = getTodayDateString();
  await db
    .update(metricsDaily)
    .set({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(metricsDaily.date as any, today));
}

// Get current system phase
async function getSystemPhase(): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.ALIVE_INTERNAL_URL ?? `http://127.0.0.1:${process.env.PORT ?? 5000}`}/api/alive/status`
    );
    if (response.ok) {
      const data = await response.json();
      return data.status?.phase ?? "unknown";
    }
  } catch {
    // Ignore errors
  }
  return "unknown";
}

// Get current metrics snapshot
export async function getMetrics(): Promise<MetricsSnapshot> {
  trimOldLatencies();

  const today = getTodayDateString();
  const [todayRecord] = await db
    .select()
    .from(metricsDaily)
    .where(eq(metricsDaily.date as any, today))
    .limit(1);

  // Calculate uptime percent (based on system start time)
  const uptimeMs = Date.now() - rolling.systemStartTime;
  const uptimePercent = Math.min(100, (uptimeMs / (24 * 60 * 60 * 1000)) * 100);

  // Calculate average heartbeat latency from rolling window
  const avgHeartbeatMs =
    rolling.heartbeatLatencies.length > 0
      ? rolling.heartbeatLatencies.reduce((sum, entry) => sum + entry.latency, 0) / rolling.heartbeatLatencies.length
      : 0;

  // Get HALO cycles from today's record
  const haloCyclesToday = todayRecord?.haloCycles ?? 0;

  // Get tasks from rolling cache (will be updated by recordTaskCompletion)
  const tasksCompleted = rolling.tasksCompleted;
  const tasksPending = rolling.tasksPending;

  // Get events from today's record
  const events24h = todayRecord?.events ?? 0;

  // Get media counts from database
  const [mediaCountResult] = await db.select({ count: count() }).from(mediaAssets);
  const mediaCount = mediaCountResult?.count ?? 0;

  // Count public media (media with public collections)
  // For now, we'll count all media as public if they have any collections
  // You can refine this logic later
  const [mediaPublicResult] = await db
    .select({ count: count() })
    .from(mediaAssets)
    .where(sql`array_length(${mediaAssets.collections as any}, 1) > 0`);
  const mediaPublic = mediaPublicResult?.count ?? 0;

  // Get post counts from database
  const [postsQueuedResult] = await db
    .select({ count: count() })
    .from(postQueue)
    .where(eq(postQueue.status as any, "scheduled" as any));
  const postsQueued = postsQueuedResult?.count ?? 0;

  const [postsPostedResult] = await db
    .select({ count: count() })
    .from(postQueue)
    .where(eq(postQueue.status as any, "posted" as any));
  const postsPosted = postsPostedResult?.count ?? 0;

  const phase = await getSystemPhase();

  return {
    timestamp: new Date().toISOString(),
    uptimePercent,
    avgHeartbeatMs: Math.round(avgHeartbeatMs),
    haloCyclesToday,
    tasksCompleted,
    tasksPending,
    events24h,
    mediaCount,
    mediaPublic,
    postsQueued,
    postsPosted,
    daNsaCount: todayRecord?.daNsaCount ?? 0,
    phase,
  };
}

// Record heartbeat latency
export async function recordHeartbeat(latencyMs: number): Promise<void> {
  const now = Date.now();
  rolling.heartbeatLatencies.push({ latency: latencyMs, timestamp: now });
  rolling.lastHeartbeatTime = now;
  trimOldLatencies();

  // Update today's record every 60 seconds (debounced)
  const lastUpdate = (rolling as any).lastHeartbeatUpdate ?? 0;
  if (now - lastUpdate > 60000) {
    (rolling as any).lastHeartbeatUpdate = now;
    const todayRecord = await getOrCreateTodayRecord();
    const avgMs =
      rolling.heartbeatLatencies.length > 0
        ? rolling.heartbeatLatencies.reduce((sum, entry) => sum + entry.latency, 0) / rolling.heartbeatLatencies.length
        : 0;
    await updateTodayRecord({
      avgHeartbeatMs: Math.round(avgMs),
    });
  }
}

// Record HALO cycle
export async function recordHaloCycle(result: { success: boolean; timestamp?: string }): Promise<void> {
  rolling.haloCycles++;
  rolling.lastHaloCycleAt = result.timestamp ?? new Date().toISOString();

  const todayRecord = await getOrCreateTodayRecord();
  await updateTodayRecord({
    haloCycles: (todayRecord.haloCycles ?? 0) + 1,
    lastHaloCycleAt: rolling.lastHaloCycleAt,
  });
}

// Record task completion
export async function recordTaskCompletion(type: string, status: "success" | "failed"): Promise<void> {
  if (status === "success") {
    rolling.tasksCompleted++;
  }
  // Update pending count based on current state (will be refreshed from API)
}

// Update task counts (called from API when fetching tasks)
export function updateTaskCounts(completed: number, pending: number): void {
  rolling.tasksCompleted = completed;
  rolling.tasksPending = pending;
}

// Record event
export async function recordEvent(): Promise<void> {
  rolling.events++;
  const todayRecord = await getOrCreateTodayRecord();
  await updateTodayRecord({
    events: (todayRecord.events ?? 0) + 1,
  });
}

// Record media addition
export async function recordMediaAdd(publicFlag: boolean): Promise<void> {
  rolling.mediaAdded++;
  if (publicFlag) {
    rolling.mediaPublic++;
  }
}

// Record post status change
export async function recordPost(status: "queued" | "posted"): Promise<void> {
  if (status === "queued") {
    rolling.postsQueued++;
  } else if (status === "posted") {
    rolling.postsPosted++;
    rolling.postsQueued = Math.max(0, rolling.postsQueued - 1);
  }
}

// Get history (daily aggregates)
export async function getMetricsHistory(days: number = 7): Promise<MetricsDaily[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];

  const records = await db
    .select()
    .from(metricsDaily)
    .where(gte(metricsDaily.date as any, cutoffStr))
    .orderBy(sql`${metricsDaily.date as any} DESC`);

  return records as MetricsDaily[];
}
