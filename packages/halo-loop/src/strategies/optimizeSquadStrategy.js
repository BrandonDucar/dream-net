export function optimizeSquadStrategy(issue) {
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
        priority: (issue.severity === "critical" || issue.severity === "error") ? "high" : "normal",
        targetAgents: ["dreamops", "buildkeeper"],
    };
}
//# sourceMappingURL=optimizeSquadStrategy.js.map