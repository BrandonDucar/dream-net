export function envSyncStrategy(issue) {
    if (issue.analyzer !== "envConsistency")
        return null;
    const target = issue.data?.missing || issue.data?.mismatched ? issue.data : null;
    if (!target)
        return null;
    return {
        type: "env.sync",
        payload: {
            differences: target,
            description: issue.description,
        },
        priority: issue.severity === "high" ? "high" : "medium",
        targetAgents: ["envkeeper"],
    };
}
