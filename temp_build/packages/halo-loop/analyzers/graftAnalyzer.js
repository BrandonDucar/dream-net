"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graftAnalyzer = graftAnalyzer;
const graft_engine_1 = require("@dreamnet/graft-engine");
async function graftAnalyzer() {
    const grafts = await (0, graft_engine_1.getGrafts)();
    const issues = [];
    const recommendations = [];
    grafts.forEach((graft) => {
        if (graft.status === "failed") {
            issues.push({
                id: `graft-failed-${graft.id}`,
                analyzer: "graft",
                severity: "high",
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
                severity: "medium",
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
