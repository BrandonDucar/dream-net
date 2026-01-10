"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviveAgentStrategy = reviveAgentStrategy;
function reviveAgentStrategy(issue) {
    if (issue.analyzer !== "agentHealth" || issue.severity === "low") {
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
