import { getGrafts } from "@dreamnet/graft-engine";
export async function graftAnalyzer() {
    const grafts = await getGrafts();
    const issues = [];
    const recommendations = [];
    grafts.forEach((graft) => {
        if (graft.status === "failed") {
            issues.push({
                id: `graft-failed-${graft.id}`,
                analyzer: "graft",
                severity: "critical",
                description: `Graft ${graft.name} failed: ${graft.error ?? "unknown error"}`,
                data: { graftId: graft.id, status: graft.status },
            });
            recommendations.push({
                action: "graft.repair",
                description: `Retry graft ${graft.name}`,
                target: graft.id,
            });
        }
        else if (graft.status === "pending") {
            issues.push({
                id: `graft-pending-${graft.id}`,
                analyzer: "graft",
                severity: "error",
                description: `Graft ${graft.name} is pending installation`,
                data: { graftId: graft.id, status: graft.status },
            });
            recommendations.push({
                action: "graft.install",
                description: `Schedule installation for ${graft.name}`,
                target: graft.id,
            });
        }
    });
    return {
        name: "graftAnalyzer",
        issues,
        recommendations,
    };
}
//# sourceMappingURL=graftAnalyzer.js.map