export function predictFailureRisk(ctx) {
    const now = Date.now();
    return [
        {
            id: `failure-${now}`,
            type: "failure-risk",
            confidence: 0.4,
            etaMs: 10 * 60 * 1000,
            meta: {
                reason: "placeholder heuristic: base failure curve",
            },
            createdAt: now,
        },
    ];
}
