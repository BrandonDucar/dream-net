"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeSquadStrategy = optimizeSquadStrategy;
function optimizeSquadStrategy(issue) {
    if (issue.analyzer !== "squadEfficiency")
        return null;
    const squadId = issue.data?.squadId;
    if (!squadId)
        return null;
    return {
        type: "squad.rebalance",
        payload: {
            squadId,
            failureRate: issue.data?.failureRate,
            message: issue.description,
        },
        priority: issue.severity === "high" ? "high" : "medium",
        targetAgents: ["dreamops", "buildkeeper"],
    };
}
