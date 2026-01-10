"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairEndpointStrategy = repairEndpointStrategy;
function repairEndpointStrategy(issue) {
    if (issue.analyzer !== "endpointHealth") {
        return null;
    }
    const endpoint = issue.data?.path;
    if (!endpoint)
        return null;
    return {
        type: "repair.api.endpoint",
        payload: {
            endpoint,
            details: issue.data,
        },
        priority: issue.severity === "critical" ? "critical" : "high",
        targetAgents: ["deploykeeper"],
    };
}
