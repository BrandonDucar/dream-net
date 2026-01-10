"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairGraftStrategy = repairGraftStrategy;
function repairGraftStrategy(issue) {
    if (issue.analyzer !== "graft")
        return null;
    const graftId = issue.data?.graftId;
    if (!graftId)
        return null;
    if (issue.description.includes("pending")) {
        return {
            type: "graft.install",
            payload: { graftId },
            priority: "high",
        };
    }
    return {
        type: "graft.repair",
        payload: { graftId },
        priority: "critical",
    };
}
