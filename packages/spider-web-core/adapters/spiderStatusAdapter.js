import { SpiderWebCore } from "../index";
export function getSpiderDashboardView() {
    const status = SpiderWebCore.status();
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
