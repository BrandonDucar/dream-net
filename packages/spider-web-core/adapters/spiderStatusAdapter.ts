import { SpiderWebCore } from "../index";
import { SpiderWebStatus } from "../types";

export interface SpiderDashboardView {
  threadCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  failedCount: number;
  insightCount: number;
  
  // Fly metrics
  flyCount: number;
  fliesCaughtToday: number;
  stickyFlyCount: number;
  activeSensors: number;
  
  // Thread metrics
  avgExecutionTime: number;
  threadSuccessRate: number;
  templateCount: number;
  patternCount: number;
  
  threads: {
    id: string;
    source: string;
    targets: string[];
    kind: string;
    status: string;
    priority: string;
    executable: boolean;
  }[];
  
  insights: {
    id: string;
    type: string;
    title: string;
    description: string;
  }[];
  
  flies: {
    id: string;
    type: string;
    source: string;
    priority: string;
    sticky: boolean;
    processed: boolean;
  }[];
  
  sensors: {
    id: string;
    type: string;
    active: boolean;
    catchRate: number;
  }[];
}

export function getSpiderDashboardView(): SpiderDashboardView {
  const status: SpiderWebStatus = SpiderWebCore.status();

  return {
    threadCount: status.threadCount,
    pendingCount: status.pendingCount,
    inProgressCount: status.inProgressCount,
    completedCount: status.completedCount,
    failedCount: status.failedCount,
    insightCount: status.insightCount,
    flyCount: status.flyCount,
    fliesCaughtToday: status.fliesCaughtToday,
    stickyFlyCount: status.stickyFlyCount,
    activeSensors: status.activeSensors,
    avgExecutionTime: status.avgExecutionTime,
    threadSuccessRate: status.threadSuccessRate,
    templateCount: status.templateCount,
    patternCount: status.patternCount,
    threads: status.sampleThreads.map((t) => ({
      id: t.id,
      source: `${t.source.kind}:${t.source.id}`,
      targets: t.targets.map((tg) => `${tg.kind}:${tg.id}`),
      kind: t.kind,
      status: t.status,
      priority: t.priority,
      executable: t.executable,
    })),
    insights: status.sampleInsights.map((i) => ({
      id: i.id,
      type: i.type,
      title: i.title,
      description: i.description,
    })),
    flies: status.sampleFlies.map((f) => ({
      id: f.id,
      type: f.type,
      source: f.source,
      priority: f.priority,
      sticky: f.sticky,
      processed: f.processed,
    })),
    sensors: status.activeSensorsList.map((s) => ({
      id: s.id,
      type: s.type,
      active: s.active,
      catchRate: s.catchRate,
    })),
  };
}
