export function predictRoutingBottlenecks(ctx) {
    const now = Date.now();
    return [
        {
            id: `routing-${now}`,
            type: "routing-bottleneck",
            confidence: 0.5,
            etaMs: 2 * 60 * 1000,
            meta: {
                reason: "placeholder heuristic: assume wormhole congestion under load",
            },
            createdAt: now,
        },
    ];
}
