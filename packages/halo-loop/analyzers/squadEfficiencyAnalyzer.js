import { randomUUID } from "node:crypto";
async function fetchSquadMetrics() {
    try {
        const response = await fetch(`${process.env.SQUAD_API_BASE ?? "http://127.0.0.1:5000"}/api/squad/metrics`);
        if (response.ok) {
            const data = (await response.json());
            if (Array.isArray(data.squads)) {
                return data.squads;
            }
        }
    }
    catch {
        // ignore network errors, fall back to mock data
    }
    return [
        {
            id: "dreamops-squad",
            name: "DreamOps Strike Team",
            runningTasks: 0,
            failedTasks: 1,
            completedTasks: 8,
            avgDurationMs: 3200,
        },
    ];
}
export async function squadEfficiencyAnalyzer() {
    const squads = await fetchSquadMetrics();
    const issues = [];
    const recommendations = [];
    squads.forEach((squad) => {
        const failureRate = squad.completedTasks + squad.failedTasks === 0
            ? 0
            : squad.failedTasks / (squad.completedTasks + squad.failedTasks);
        if (failureRate > 0.3) {
            issues.push({
                id: `squad-failure-${squad.id}`,
                analyzer: "squadEfficiency",
                severity: "high",
                description: `${squad.name} failure rate at ${(failureRate * 100).toFixed(0)}%`,
                data: { squadId: squad.id, failureRate },
            });
            recommendations.push({
                action: "squad.rebalance",
                description: `Rebalance workload for ${squad.name}`,
                target: squad.id,
                meta: { squadId: squad.id, failureRate },
            });
        }
        else if (squad.runningTasks === 0 && failureRate === 0) {
            recommendations.push({
                action: "squad.optimize",
                description: `${squad.name} is idle; consider scheduling proactive maintenance tasks.`,
                target: squad.id,
            });
        }
    });
    return {
        name: "squadEfficiencyAnalyzer",
        issues: issues.length
            ? issues
            : [
                {
                    id: randomUUID(),
                    analyzer: "squadEfficiency",
                    severity: "low",
                    description: "Squad efficiency within acceptable thresholds",
                },
            ],
        recommendations,
    };
}
