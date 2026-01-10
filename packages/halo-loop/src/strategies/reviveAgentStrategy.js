export function reviveAgentStrategy(issue) {
    if (issue.analyzer !== "agentHealth" || issue.severity === "info") {
        return null;
    }
    const agentId = issue.data?.agentId;
    if (!agentId)
        return null;
    return {
        type: "agent.revive",
        payload: {
            agentId,
            reason: issue.description,
        },
        priority: issue.severity === "critical" ? "critical" : "high",
        targetAgents: ["dreamops"],
    };
}
//# sourceMappingURL=reviveAgentStrategy.js.map